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
import AxiosInstance from "../../../../utils/AxiosInstance";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const AnxietyBarChart = () => {
  const [anxietyData, setAnxietyData] = useState([]);

  const fetchAnxietyData = async () => {
    try {
      const res = await AxiosInstance.get("/anxietyPredictions/perMonth");
      if (res.status === 200 && res.data.success) {
        const formattedData = res.data.data.map((item) => ({
          month: monthNames[item._id.month - 1], // Convert month number to name
          mild: item.mildCount,
          severe: item.severeCount,
        }));
        setAnxietyData(formattedData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAnxietyData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={anxietyData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="mildGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FED0C5" />
            <stop offset="100%" stopColor="#8B47B5" />
          </linearGradient>
          <linearGradient id="severeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F8B8BA" />
            <stop offset="100%" stopColor="#B13D5D" />
          </linearGradient>
        </defs>

        {/* Chart Components */}
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="mild"
          fill="url(#mildGradient)"
          name="Mild Anxiety"
          animationDuration={1500}
        />
        <Bar
          dataKey="severe"
          fill="url(#severeGradient)"
          name="Severe Anxiety"
          animationDuration={1500}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AnxietyBarChart;
