import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import AxiosInstance from "../../../../utils/AxiosInstance";
import { getUser, notifyError, moodColors } from "../../../../utils/helpers";

const MoodPieChart = () => {
  const user = getUser();
  const userId = user._id;
  const [moodPercentage, setMoodPercentage] = useState([
    { mood: "Happy", percentage: 0 },
    { mood: "Sad", percentage: 0 },
    { mood: "Angry", percentage: 0 },
    { mood: "Anxious", percentage: 0 },
    { mood: "Neutral", percentage: 0 },
  ]);

  const fetchMoodPercentage = async () => {
    try {
      const res = await AxiosInstance.get(
        `/moodEntries/moodPercentages/${userId}`
      );
      setMoodPercentage(res.data.moodPercentages);
    } catch (error) {
      console.log(error);
      notifyError("Failed to fetch mood percentage data");
    }
  };

  useEffect(() => {
    fetchMoodPercentage();
  }, []);

  return (
    <>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={moodPercentage.map(({ mood, percentage }) => ({
              name: mood,
              value: percentage,
            }))}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {moodPercentage.map(({ mood }, index) => (
              <Cell
                key={`cell-${index}`}
                fill={moodColors[mood] || "#add8e6"}
              />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
};

export default MoodPieChart;
