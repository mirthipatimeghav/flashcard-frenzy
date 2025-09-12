// src/app/components/AuthForm.tsx
'use client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabaseClient';
import { useState, useEffect } from 'react'; // Import hooks

export default function AuthForm() {
  // Create state to hold the URL, which will be set on the client
  const [redirectUrl, setRedirectUrl] = useState<string>('');

  // useEffect runs only in the browser, not during the server-side build
  useEffect(() => {
    setRedirectUrl(`${window.location.origin}/auth/callback`);
  }, []);

  // Render the component only after the redirectUrl has been set on the client
  if (!redirectUrl) {
    return null; // or a loading spinner
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">Flashcard Frenzy</h1>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['google', 'github']}
        redirectTo={redirectUrl} // Use the state variable here
      />
    </div>
  );
}