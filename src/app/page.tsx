"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StartPage() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/login"); // navigate to login page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Flashcard Frenzy</h1>
      <button
        onClick={handleLoginClick}
        className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Login
      </button>
    </div>
  );
}
