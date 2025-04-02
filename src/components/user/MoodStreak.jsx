import React, { useState, useEffect } from "react";
import AxiosInstance from "../../../utils/AxiosInstance";
import { getUser } from "../../../utils/helpers";
import { CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";

const MoodStreak = () => {
  const [weekStatus, setWeekStatus] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const today = new Date().getDay();
  const user = getUser();

  const fetchMoodWeekStatus = async () => {
    try {
      const res = await AxiosInstance.get(
        `/moodEntries/moodStreak/${user._id}`
      );
      if (res.status === 200 && res.data.weekStatus) {
        setWeekStatus(res.data.weekStatus);
      }
    } catch (error) {
      console.error("Failed to fetch mood week status:", error);
    }
  };

  useEffect(() => {
    fetchMoodWeekStatus();
  }, []);

  const supportiveTexts = [
    "How will you make today amazing? 🌈",
    "What small goal can you achieve today? ✨",
    "Stay strong! What motivates you? 💖",
    "Midweek boost! What are you proud of this week? 🔥",
    "Almost there! What’s one thing you learned today? 🚀",
    "Happy Friday! What was your biggest win this week? 🎉",
    "Weekend reset! How will you recharge? 💆",
  ];

  return (
    <div className="flex flex-col items-center p-4 bg-purple-600 rounded-xl shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-4">Mood Streak Tracker</h2>
      <p className="text-gray-200 mb-4 text-center">
        Keep logging your moods daily to track your progress. Every day counts!
      </p>

      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
          <div
            key={index}
            className="w-16 h-16 flex flex-col items-center justify-center rounded-lg bg-white text-purple-600 font-semibold shadow-md transition-all"
          >
            {weekStatus[index] ? (
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
        {weekStatus.includes(true)
          ? "✅ Great job! Keep logging your moods!"
          : supportiveTexts[today]}
      </p>
      <p className="text-gray-300 mt-2 text-sm">
        Every small step counts! Keep pushing forward. 💪
      </p>
    </div>
  );
};

export default MoodStreak;
