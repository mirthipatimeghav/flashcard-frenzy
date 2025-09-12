// src/app/game/[roomCode]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

// Define types for our data for type safety
interface Score {
  user_id: string;
  points: number;
}

interface Question {
  id: string;
  question_text: string;
}

// THIS IS THE FIX: We create a dedicated interface for the page's props
interface GamePageProps {
  params: {
    roomCode: string;
  };
}

// AND WE USE THE NEW INTERFACE HERE
export default function GamePage({ params }: GamePageProps) {
  const [user, setUser] = useState<User | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [scores, setScores] = useState<Score[]>([]);
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    // Get the currently logged-in user
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    // Fetch initial game state
    const fetchInitialData = async () => {
        const { data: qData } = await supabase.from('questions').select('*').order('created_at', { ascending: false }).limit(1).single();
        setQuestion(qData);
    };
    fetchInitialData();


    // Set up the real-time subscription
    const channel = supabase
      .channel(`game-${params.roomCode}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'scores' },
        (payload) => {
          const newScore = payload.new as Score;
          setScores((currentScores) => [...currentScores, newScore]);
          console.log('Score updated!', payload);
        }
      )
      .subscribe();

    // Cleanup function to remove the channel subscription when the component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [params.roomCode]);


  const handleAnswerSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user || || !question) return;

      const { data, error } = await supabase.functions.invoke('submit-answer', {
          body: { questionId: question.id, submittedAnswer: answer },
      });

      if (error) {
          console.error('Error submitting answer:', error);
          alert('Error: ' + error.message);
      } else {
          console.log('Answer submitted:', data);
          setAnswer(''); // Clear input on success
      }
  };


  if (!user) return <div>Loading... Please log in.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Room: {params.roomCode}</h1>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {/* Game Board */}
        <div className="col-span-2 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Question:</h2>
          <p className="text-4xl text-center p-8 bg-gray-100 rounded-lg">
            {question ? question.question_text : 'Loading question...'}
          </p>
          <form onSubmit={handleAnswerSubmit} className="mt-6 flex gap-2">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="flex-grow p-2 border rounded-md"
              placeholder="Your Answer"
            />
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Submit
            </button>
          </form>
        </div>

        {/* Scoreboard */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Scoreboard</h2>
          <ul>
            {scores.map((score, index) => (
               <li key={index} className="flex justify-between p-2 bg-gray-50 rounded-md mb-2">
                  <span>User: {score.user_id.substring(0, 8)}...</span>
                  <strong>{score.points}</strong>
               </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}