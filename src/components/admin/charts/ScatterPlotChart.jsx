import React, { useState, useEffect } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label,
} from "recharts";
import AxiosInstance from "../../../../utils/AxiosInstance";

const ScatterPlotChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchAnxietyData = async () => {
      try {
        const response = await AxiosInstance.get(
          "anxietyPredictions/statsDietQuality"
        );

        if (
          response.status === 200 &&
          Array.isArray(response.data.scatterData)
        ) {
          setData(response.data.scatterData);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAnxietyData();
  }, []);

  return (
    <div className="w-full h-[400px]">
      <h2 className="text-lg font-bold text-center mb-4">
        Diet Quality vs. Stress Level
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />

          {/* X-Axis with Label */}
          <XAxis type="number" dataKey="x" name="Diet Quality">
            <Label
              value="Diet Quality (Scale 1-10)"
              offset={-10}
              position="insideBottom"
            />
          </XAxis>

          {/* Y-Axis with Label */}
          <YAxis type="number" dataKey="y" name="Stress Level">
            <Label
              value="Stress Level (Scale 1-10)"
              angle={-90}
              position="insideLeft"
            />
          </YAxis>

          <Tooltip cursor={{ strokeDasharray: "3 3" }} />

          {/* Legend positioned at top right */}
          <Legend
            align="right"
            verticalAlign="top"
            wrapperStyle={{ right: 10, top: 10 }}
          />

          {/* Scatter Plot Data */}
          <Scatter name="Data Points" data={data} fill="#FF4500" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScatterPlotChart;
