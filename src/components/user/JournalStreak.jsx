import React, { useState, useEffect } from "react";
import AxiosInstance from "../../../utils/AxiosInstance";
import { getUser } from "../../../utils/helpers";
import { CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";

const JournalStreak = () => {
  const [streakArray, setStreakArray] = useState(new Array(7).fill(false));
  const today = new Date().getDay();
  const user = getUser();

  const fetchStreak = async () => {
    try {
      const res = await AxiosInstance.get(`/journalEntries/streak/${user._id}`);
      if (res.status === 200 && Array.isArray(res.data.streakArray)) {
        setStreakArray(res.data.streakArray);
      }
    } catch (error) {
      console.error("Failed to fetch journal streak:", error);
    }
  };

  useEffect(() => {
    fetchStreak();
  }, []);

  const supportiveTexts = [
    "What are you grateful for today?",
    "Describe a moment that made you smile today.",
    "What’s one thing you learned about yourself today?",
    "How did you handle a challenge today?",
    "Write about a small victory you had today.",
    "What is something that inspired you today?",
    "Reflect on your week—what are you proud of?",
  ];

  return (
    <div className="flex flex-col items-center p-4 bg-violet-800 rounded-xl shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-4">Journaling Streak Tracker</h2>
      <p className="text-gray-200 mb-4 text-center">
        Keep journaling daily to build a strong habit! Every entry counts.
      </p>

      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
          <div
            key={index}
            className="w-16 h-16 flex flex-col items-center justify-center rounded-lg bg-white text-purple-600 font-semibold shadow-md transition-all"
          >
            {streakArray[index] ? (
              <CheckCircle fontSize="large" className="text-green-500" />
            ) : (
              <RadioButtonUnchecked
                fontSize="large"
                className="text-gray-400"
              />
            )}
            <span className="text-xs mt-1">{day.charAt(0)}</span>
          </div>
        ))}
      </div>

      <p className="text-gray-100 mt-4 text-lg font-semibold">
        {streakArray[today]
          ? `🔥 Streak: ${streakArray.filter(Boolean).length} days! Keep writing!`
          : supportiveTexts[today]}
      </p>
      <p className="text-gray-300 mt-2 text-sm">
        Your thoughts matter. Keep expressing yourself! ✍️
      </p>
    </div>
  );
};

export default JournalStreak;
