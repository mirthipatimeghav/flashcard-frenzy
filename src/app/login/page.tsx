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

    // Save room code locally (optional)
    localStorage.setItem("roomCode", roomCode);

    // Navigate to dynamic game page
    router.push(`/game/${roomCode}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Enter Room Code</h1>
      <input
        type="text"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        placeholder="Room Code"
        className="border p-2 mb-3 rounded"
      />
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <button
        onClick={handleJoin}
        className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Join
      </button>
    </div>
  );
}
