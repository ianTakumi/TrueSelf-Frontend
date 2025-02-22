import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import AxiosInstance from "../../../../utils/AxiosInstance";

const MonthlyEngagementChart = () => {
  const [data, setData] = useState([]);

  const fetchMonthlyEngagements = async () => {
    await AxiosInstance.get("/contacts/monthly-engagements").then((res) => {
      if (res.status === 200) {
        const formattedData = res.data.map((item) => ({
          name: new Date(item.year, item.month - 1).toLocaleString("default", {
            month: "short",
          }),
          total: item.total,
        }));
        setData(formattedData);
      }
    });
  };

  useEffect(() => {
    fetchMonthlyEngagements();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
        <XAxis dataKey="name" stroke="#666" />
        <YAxis tickFormatter={(value) => `${value}`} stroke="#666" />
        <Tooltip
          contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px" }}
          labelFormatter={(label) => `Engagements in ${label}`}
        />
        <Line
          type="monotone"
          dataKey="total"
          stroke="url(#colorEngagement)"
          strokeWidth={3}
          dot={{ stroke: "#8884d8", strokeWidth: 3, r: 5 }}
          activeDot={{ r: 8 }}
          isAnimationActive={true}
        />
        <defs>
          <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8884d8" stopOpacity={1} />
            <stop offset="100%" stopColor="#8884d8" stopOpacity={0.3} />
          </linearGradient>
        </defs>
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MonthlyEngagementChart;
