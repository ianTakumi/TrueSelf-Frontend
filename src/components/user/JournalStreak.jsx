import { useState, useEffect } from "react";

const StreakTracker = () => {
  const [streak, setStreak] = useState([0, 0, 0, 0, 0, 0, 0]);
  const today = new Date().getDay();

  const supportiveTexts = [
    "What are you grateful for today?",
    "Describe a moment that made you smile today.",
    "What’s one thing you learned about yourself today?",
    "How did you handle a challenge today?",
    "Write about a small victory you had today.",
    "What is something that inspired you today?",
    "Reflect on your week—what are you proud of?",
  ];

  useEffect(() => {
    const storedStreak = JSON.parse(localStorage.getItem("journalStreak")) || [
      0, 0, 0, 0, 0, 0, 0,
    ];
    if (storedStreak.length === 7) {
      if (storedStreak[today] === 0) {
        // storedStreak[today] = 1; // Mark today as completed
        setStreak([...storedStreak]);
        localStorage.setItem("journalStreak", JSON.stringify(storedStreak));
      } else {
        setStreak(storedStreak);
      }
    } else {
      const newStreak = [0, 0, 0, 0, 0, 0, 0];
      // newStreak[today] = 1;
      setStreak(newStreak);
      localStorage.setItem("journalStreak", JSON.stringify(newStreak));
    }
  }, [today]);

  return (
    <div className="flex flex-col items-center p-6 bg-gradient-to-r from-red-600 via-purple-700 to-blue-600 rounded-3xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-white">
        Journaling Streak Tracker
      </h2>
      <p className="text-gray-100 mb-4">
        Write every day to build your journaling habit! Consistency is key.
      </p>
      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
          <div
            key={index}
            className={`w-12 h-12 flex items-center justify-center rounded-lg text-white font-semibold transition-all
              ${streak[index] ? "bg-blue-500" : "bg-gray-300"}`}
          >
            {day.charAt(0)}
          </div>
        ))}
      </div>
      <p className="text-gray-100 mt-4">
        {streak[today] ? "Great job journaling today!" : supportiveTexts[today]}
      </p>
      <p className="text-gray-100 mt-2">
        Your thoughts matter. Keep writing! ✍️
      </p>
    </div>
  );
};

export default StreakTracker;
