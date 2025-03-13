import React, { useState, useEffect, useRef } from "react";
import AxiosInstance from "../../../../utils/AxiosInstance";
import { notifyError } from "../../../../utils/helpers";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const COLORS = ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"];

const PieChartComponent = () => {
  const [data, setData] = useState([]);
  const chartRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const fetchData = async () => {
    await AxiosInstance.get("/anxietyPredictions/statsOccupation")
      .then((res) => {
        console.log(res.data);
        setData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        notifyError("Error fetching data");
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h2 className="text-xl font-bold mb-4">Occupation Distribution</h2>
      <PieChart width={400} height={300}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          dataKey="count"
          nameKey="occupation"
          label={({ name, percent }) =>
            `${name} (${(percent * 100).toFixed(0)}%)`
          }
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, props) => {
            const { payload } = props;
            return [
              `Count: ${value}`,
              `Avg Severity: ${payload.avgSeverity.toFixed(2)}`,
            ];
          }}
        />
        <Legend />
      </PieChart>
    </div>
  );
};

export default PieChartComponent;
