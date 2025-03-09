import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import AxiosInstance from "../../../../utils/AxiosInstance";
import { moodColors } from "../../../../utils/helpers";

const StackBarChart = () => {
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("MMMM")); // Default to current month
  const [months, setMonths] = useState([]);

  useEffect(() => {
    fetchMoodStats(selectedMonth);
  }, [selectedMonth]);

  const fetchMoodStats = async (month) => {
    try {
      const response = await AxiosInstance.get(`/moodEntries/moodStatsByWeek`);
      const filteredData = response.data.filter((entry) =>
        entry.week.includes(month)
      );
      setData(filteredData);

      // Extract unique months for the dropdown
      const uniqueMonths = [
        ...new Set(response.data.map((entry) => entry.week.split(" - ")[0])),
      ];
      setMonths(uniqueMonths);
    } catch (error) {
      console.error("Error fetching mood stats:", error);
    }
  };

  return (
    <div className="p-4 ">
      <h2 className="text-xl font-semibold mb-4">
        Mood Entries - {selectedMonth}
      </h2>

      {/* Month Selection Dropdown */}
      <select
        className="p-2 border rounded mb-4"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      >
        {months.map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>

      {/* Stacked Bar Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
        >
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Legend />
          {Object.keys(moodColors).map((mood) => (
            <Bar
              key={mood}
              dataKey={mood}
              stackId="a"
              fill={moodColors[mood]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StackBarChart;
