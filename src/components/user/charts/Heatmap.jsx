import React, { useState, useEffect } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import AxiosInstance from "../../../../utils/AxiosInstance";

export const moodColors = {
  Happy: "#FDC700",
  Sad: "#51A2FF",
  Angry: "#FF6467",
  Neutral: "#99A1AF",
  Anxious: "#00D5BE",
};

const sampleData = [
  { date: "2024-02-01", mood: "Happy" },
  { date: "2024-02-02", mood: "Sad" },
  { date: "2024-02-03", mood: "Angry" },
  { date: "2024-02-04", mood: "Neutral" },
  { date: "2024-02-05", mood: "Anxious" },
  { date: "2024-02-06", mood: "Happy" },
  { date: "2024-02-07", mood: "Sad" },
];

const Heatmap = () => {
  const [moodData, setMoodData] = useState([]);

  const fetchMoodData = async () => {
    // await AxiosInstance.get("/mood");
  };
  useEffect(() => {}, []);
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Mood Heatmap</h2>
      <CalendarHeatmap
        startDate={new Date("2024-02-01")}
        endDate={new Date("2024-02-28")}
        values={sampleData.map(({ date, mood }) => ({ date, mood }))}
        classForValue={(value) => {
          if (!value) return "color-empty";
          return `color-${value.mood}`;
        }}
        tooltipDataAttrs={(value) => {
          return {
            "data-tip": value.date ? `Mood: ${value.mood}` : "No data",
          };
        }}
      />
      <style>
        {`
          .color-Happy { fill: ${moodColors.Happy}; }
          .color-Sad { fill: ${moodColors.Sad}; }
          .color-Angry { fill: ${moodColors.Angry}; }
          .color-Neutral { fill: ${moodColors.Neutral}; }
          .color-Anxious { fill: ${moodColors.Anxious}; }
          .color-empty { fill: #ebedf0; }
        `}
      </style>
    </div>
  );
};

export default Heatmap;
