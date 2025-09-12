// src/app/game/[roomCode]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

interface Score {
  user_id: string;
  points: number;
}

interface Question {
  id: string;
  question_text: string;
}

export default function GamePage({
  params,
}: {
  params: { roomCode: string };
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [scores, setScores] = useState<Score[]>([]);
  const [answer, setAnswer] = useState("");

  // Fetch user + question + subscribe to scores
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/"); // redirect to login
      }
      setUser(user);
    };
    fetchUser();

    const fetchQuestion = async () => {
      const { data } = await supabase
        .from("questions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      if (data) setQuestion(data);
    };
    fetchQuestion();

    const channel = supabase
      .channel(`game-${params.roomCode}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "scores" },
        (payload) => {
          const newScore = payload.new as Score;
          setScores((prev) => [...prev, newScore]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [params.roomCode, router]);

  // Submit answer
  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !question) return;

    const { data, error } = await supabase.functions.invoke("submit-answer", {
      body: { questionId: question.id, submittedAnswer: answer },
    });

    if (error) {
      console.error("Error submitting answer:", error);
      alert(error.message);
    } else {
      console.log("Answer submitted:", data);
      setAnswer("");
    }
  };

  if (!user) {
    return <div className="p-6 text-center">Loading... Please log in.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Room: {params.roomCode}</h1>
      <div className="grid grid-cols-3 gap-6 mt-6">
        {/* Question Box */}
        <div className="col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Question:</h2>
          <p className="text-2xl text-center p-6 bg-gray-100 rounded-md">
            {question ? question.question_text : "Loading question..."}
          </p>
          <form onSubmit={handleAnswerSubmit} className="mt-6 flex gap-2">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="flex-grow border rounded-md p-2"
              placeholder="Your Answer"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Scoreboard */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Scoreboard</h2>
          <ul>
            {scores.length === 0 ? (
              <li className="text-gray-500">No scores yet</li>
            ) : (
              scores.map((score, i) => (
                <li
                  key={i}
                  className="flex justify-between p-2 bg-gray-50 rounded-md mb-2"
                >
                  <span>User: {score.user_id.substring(0, 8)}...</span>
                  <strong>{score.points}</strong>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
