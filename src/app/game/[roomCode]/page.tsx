"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface GamePageProps {
  params: { roomcode: string };
}

export default function GamePage({ params }: GamePageProps) {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState<string>("");

  useEffect(() => {
    // You can also check localStorage if needed
    setRoomCode(params.roomcode || localStorage.getItem("roomCode") || "");
    if (!params.roomcode && !localStorage.getItem("roomCode")) {
      router.push("/"); // redirect to start if no room code
    }
  }, [params.roomcode, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Flashcard Frenzy</h1>
      <p className="text-xl mb-6">You are in Room: <span className="font-mono">{roomCode}</span></p>
      
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-2xl mb-2">Game Starts Here!</h2>
        <p>Flashcards will appear here for the player to answer.</p>
      </div>
    </div>
  );
}
