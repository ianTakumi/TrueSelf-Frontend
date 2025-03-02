import { useState, useEffect } from "react";

const StreakTracker = () => {
  const [streak, setStreak] = useState([0, 0, 1, 1, 0, 0, 0]); // Pre-set to show the 3rd streak
  const today = new Date().getDay(); // 0 (Sunday) to 6 (Saturday)

  const supportiveTexts = [
    "How will you make today amazing?",
    "What small goal can you achieve today?",
    "Stay strong! What motivates you?",
    "Midweek boost! What are you proud of this week?",
    "Almost there! What’s one thing you learned today?",
    "Happy Friday! What was your biggest win this week?",
    "Weekend reset! How will you recharge?",
  ];

  useEffect(() => {
    const storedStreak = JSON.parse(localStorage.getItem("streak")) || [
      0, 0, 1, 1, 0, 0, 0,
    ];
    if (storedStreak.length === 7) {
      if (storedStreak[today] === 0) {
        storedStreak[today] = 1; // Mark today as completed
        setStreak([...storedStreak]);
        localStorage.setItem("streak", JSON.stringify(storedStreak));
      } else {
        setStreak(storedStreak);
      }
    } else {
      const newStreak = [0, 0, 1, 1, 0, 0, 0];
      newStreak[today] = 1;
      setStreak(newStreak);
      localStorage.setItem("streak", JSON.stringify(newStreak));
    }
  }, [today]);

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-xl font-bold mb-4">Weekly Streak Tracker</h2>
      <p className="text-gray-600 mb-4">
        Keep up your streak by staying consistent every day! Missing a day
        resets your streak, so stay motivated!
      </p>
      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
          <div
            key={index}
            className={`w-12 h-12 flex items-center justify-center rounded-lg text-white font-semibold transition-all
              ${streak[index] ? "bg-green-500" : "bg-gray-300"}`}
          >
            {day.charAt(0)}
          </div>
        ))}
      </div>
      <p className="text-gray-500 mt-4">
        {streak[today] ? "Great job keeping up!" : supportiveTexts[today]}
      </p>
      <p className="text-gray-500 mt-2">
        Every small step counts! Keep pushing forward. 💪
      </p>
    </div>
  );
};

export default StreakTracker;
