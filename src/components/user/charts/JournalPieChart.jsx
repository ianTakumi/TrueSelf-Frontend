import React, { useState, useEffect } from "react";
import AxiosInstance from "../../../../utils/AxiosInstance";
import { getUser } from "../../../../utils/helpers";
import { CircularProgress } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#D0A9F5",
  "#E5C0FF",
  "#CDA2FF",
  "#A685E2",
  "#9B72CF",
  "#7E57C2",
];

export default function JournalPieChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();
  const userId = user?._id;

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      try {
        const res = await AxiosInstance.get(
          `/journalEntries/perMonthPie/${userId}`
        );
        if (res.status === 200 && res.data.data.length > 0) {
          // Convert percentage string to number
          const formattedData = res.data.data.map((entry) => ({
            ...entry,
            percentage: parseFloat(entry.percentage), // Convert to number
          }));
          setData(formattedData);
        } else {
          console.warn("No data received");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center flex-col bg-white rounded-lg shadow-md p-4 h-[300px] w-full">
        <CircularProgress size={30} className="text-primary" />
        <p className="text-center text-lg">Loading...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center flex-col bg-white rounded-lg shadow-md p-4 h-[300px] w-full">
        <p className="text-center text-lg text-gray-500">
          No journal entries data available.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-center text-xl font-semibold mb-4">
        Journal Entries Distribution
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="percentage"
            nameKey="month"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label={({ month, percentage }) => `${month}: ${percentage}%`}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
