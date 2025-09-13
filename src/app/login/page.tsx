"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleJoin = () => {
    if (roomCode.trim() === "") {
      setError("Please enter a room code");
      return;
    }
    localStorage.setItem("roomCode", roomCode);
    router.push(`/game/${roomCode}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white">
      <h1 className="text-4xl font-bold mb-6 drop-shadow-md">Enter Room Code</h1>
      <input
        type="text"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        placeholder="Room Code"
        className="border-2 border-white bg-white bg-opacity-20 placeholder-white text-white p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-300"
      />
      {error && <p className="text-red-300 mb-2">{error}</p>}
      <button
        onClick={handleJoin}
        className="px-8 py-3 bg-yellow-400 text-purple-700 font-semibold rounded-2xl shadow-lg hover:bg-yellow-500 hover:scale-105 transition-transform"
      >
        Join
      </button>
    </div>
  );
}
