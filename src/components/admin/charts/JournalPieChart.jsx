import React, { useState, useEffect, forwardRef } from "react";
import AxiosInstance from "../../../../utils/AxiosInstance";
import { CircularProgress } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { notifyError } from "../../../../utils/helpers";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    await AxiosInstance.get(`/journalEntries/perMonthPieAdmin`)
      .then((res) => {
        if (res.status === 200) {
          const formattedData = res.data.data.map((entry) => ({
            ...entry,
            percentage: parseFloat(entry.percentage), // Convert to number
          }));
          setData(formattedData);
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        notifyError("Error fetching data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const exportCSV = () => {};

  const exportPDF = () => {};

  const handlePrint = () => {
    const input = ref.current;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-center text-xl font-semibold mb-4">
        User Journal Entries Distribution
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
