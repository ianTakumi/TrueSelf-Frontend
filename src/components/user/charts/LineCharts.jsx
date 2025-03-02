import React, { useEffect, useState } from "react";
import AxiosInstance from "../../../../utils/AxiosInstance";
import { getUser, notifyError, moodColors } from "../../../../utils/helpers";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const MoodLineChart = () => {
  const [moodPerMonth, setMoodPerMonth] = useState([]);
  const user = getUser();
  const userId = user._id;
  const fetchMoodPerMonth = async () => {
    try {
      const res = await AxiosInstance.get(
        `/moodEntries/moodPerMonth/${userId}`
      );
      if (res.data.success) {
        const formattedData = res.data.moodsPerMonth.map((entry) => {
          const monthName = new Date(
            entry._id.year,
            entry._id.month - 1
          ).toLocaleString("default", { month: "short" });
          const moodCounts = { month: monthName };

          ["Happy", "Sad", "Angry", "Neutral", "Anxious"].forEach((mood) => {
            const moodEntry = entry.moods.find((m) => m.mood === mood);
            moodCounts[mood] = moodEntry ? moodEntry.count : 0;
          });

          return moodCounts;
        });

        setMoodPerMonth(formattedData);
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMoodPerMonth();
  }, []);

  return (
    <>
      {moodPerMonth.length === 0 ? (
        <div className="flex items-center justify-center flex-col gap-0">
          <img
            src={"/svg/moodDashboard/noDataCalendar.svg"}
            height={300}
            width={300}
            alt=""
          />
          <p className="text-center text-gray-500">No monthly data available</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={moodPerMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            {Object.keys(moodColors).map((mood) => (
              <Line
                key={mood}
                type="monotone"
                dataKey={mood}
                stroke={moodColors[mood]}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </>
  );
};

export default MoodLineChart;
