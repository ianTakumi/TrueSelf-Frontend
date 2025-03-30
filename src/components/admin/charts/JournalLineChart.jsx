import React, { useState, useEffect } from "react";
import AxiosInstance from "../../../../utils/AxiosInstance";
import { CircularProgress } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { notifyError } from "../../../../utils/helpers";

export default function JournalLineChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    await AxiosInstance.get(`/journalEntries/perMonthAdmin`)
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.data);
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6 ">
      <h2 className="text-lg font-semibold text-center mb-4">
        User Journal Entries Per Month
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" stroke="#8884d8" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
