"use client";
import { useRouter } from "next/navigation";

export default function StartPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 text-white">
      <h1 className="text-5xl font-extrabold mb-8 drop-shadow-lg">Flashcard Frenzy</h1>
      <button
        onClick={() => router.push("/login")}
        className="px-8 py-4 bg-yellow-400 text-purple-700 font-bold rounded-2xl shadow-lg hover:bg-yellow-500 hover:scale-105 transition-transform"
      >
        Login to Play
      </button>
    </div>
  );
}
