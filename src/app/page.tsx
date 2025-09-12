// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [roomCode, setRoomCode] = useState("");

  // Check login on mount
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github", // you can change to google/github/etc. based on your setup
    });
    if (error) {
      console.error("Login error:", error.message);
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode) return;
    router.push(`/game/${roomCode}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-4xl font-bold mb-6">🎮 Flashcard Frenzy</h1>

      {!user ? (
        <button
          onClick={handleLogin}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Login to Play
        </button>
      ) : (
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <p className="mb-4 text-gray-700">
            Welcome, <strong>{user.email}</strong>
          </p>

          <form onSubmit={handleJoinRoom} className="flex gap-2 mb-4">
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="flex-grow border rounded-md p-2"
              placeholder="Enter Room Code"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Join
            </button>
          </form>

          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
