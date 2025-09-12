// supabase/functions/submit-answer/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Create a Supabase client with the SERVICE_ROLE_KEY to bypass RLS
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

Deno.serve(async (req) => {
  const { questionId, submittedAnswer } = await req.json();
  
  // Get the user from the authorization header
  const authHeader = req.headers.get('Authorization')!;
  const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // 1. Get the correct answer from the database
  const { data: question, error: qError } = await supabase
    .from('questions')
    .select('answer, match_id')
    .eq('id', questionId)
    .single();

  if (qError || !question) {
    return new Response(JSON.stringify({ error: 'Question not found' }), { status: 404 });
  }

  // 2. Check if the submitted answer is correct
  if (question.answer.toLowerCase() !== submittedAnswer.toLowerCase()) {
    return new Response(JSON.stringify({ error: 'Incorrect answer' }), { status: 400 });
  }

  // 3. Check if anyone has already answered this question correctly
  const { data: existingScore, error: sError } = await supabase
    .from('scores')
    .select('id')
    .eq('question_id', questionId);

  if (sError) {
    return new Response(JSON.stringify({ error: sError.message }), { status: 500 });
  }

  // 4. If no one has scored, award points to this user
  if (existingScore.length === 0) {
    const { error: insertError } = await supabase.from('scores').insert({
      question_id: questionId,
      user_id: user.id,
      match_id: question.match_id,
      points: 10, // Award 10 points for the first correct answer
    });

    if (insertError) {
      // This handles the case where the user tries to answer their own question twice
      if (insertError.code === '23505') { // uniqueness violation
         return new Response(JSON.stringify({ message: 'You have already answered this question.' }), { status: 200 });
      }
      return new Response(JSON.stringify({ error: insertError.message }), { status: 500 });
    }
    return new Response(JSON.stringify({ message: 'Correct! You got the points!' }));
  } else {
    // Also insert a 0-point record for the user to prevent them from submitting again
     await supabase.from('scores').insert({
      question_id: questionId,
      user_id: user.id,
      match_id: question.match_id,
      points: 0,
    });
    return new Response(JSON.stringify({ message: 'Correct, but someone was faster!' }), { status: 200 });
  }
});