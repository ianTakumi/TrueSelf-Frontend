import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import AxiosInstance from "../../../../utils/AxiosInstance";
import { notifyError } from "../../../../utils/helpers";

const SleepBarChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get(
          "/anxietyPredictions/statsSleepHours"
        );
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching sleep severity data:", error);
        notifyError("Error fetching sleep hours data");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full h-96 p-4 x">
      <h2 className="text-xl font-semibold mb-4">
        Anxiety Severity by Sleep Hours
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="sleepRange"
            label={{
              value: "Sleep Hours",
              position: "insideBottom",
              offset: -5,
            }}
          />
          <YAxis
            label={{
              value: "Severity Score",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip />
          <Bar dataKey="avgSeverity" fill="#8884d8" name="Avg Severity" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SleepBarChart;
