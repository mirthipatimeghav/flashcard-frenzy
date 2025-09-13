"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface GamePageProps {
  params: { roomcode: string };
}

export default function GamePage({ params }: GamePageProps) {
  const router = useRouter();
  const roomCode = params.roomcode; // get directly from URL

  useEffect(() => {
    if (!roomCode) {
      router.push("/"); // redirect if no room code in URL
    }
  }, [roomCode, router]);

  if (!roomCode) {
    return null; // or a loader
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-tr from-pink-400 via-red-500 to-yellow-400 text-white">
      <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Flashcard Frenzy</h1>
      <p className="text-2xl mb-6">
        You are in Room: <span className="font-mono bg-white bg-opacity-30 px-2 rounded">{roomCode}</span>
      </p>
      <div className="p-6 bg-white bg-opacity-20 rounded-xl shadow-lg text-purple-900">
        <h2 className="text-3xl mb-2 font-semibold">Game Starts Here!</h2>
        <p className="text-lg">Flashcards will appear here for the player to answer.</p>
      </div>
    </div>
  );
}
