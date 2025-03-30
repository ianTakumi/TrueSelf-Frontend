import React, { useState, useEffect, forwardRef } from "react";
import AxiosInstance from "../../../../utils/AxiosInstance";
import { notifyError } from "../../../../utils/helpers";
import { CircularProgress } from "@mui/material";

const MoodPerMonthLineChart = forwardRef((props, ref) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    await AxiosInstance.get(`/moodEntries/moodTrends`)
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.data);
          console.log(res.data.data);
        }
      })
      .catch((err) => {
        notifyError(err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const exportToCSV = () => {};

  const exportToPDF = () => {};

  if (loading) {
    return (
      <div className="flex justify-center flex-col items-center p-10">
        <CircularProgress />
        <h1 className="font-bold mt-2">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-4">
        Mood Swings: A Monthly Analysis
      </h2>
      <div ref={ref} className="w-full"></div>
    </div>
  );
});

export default MoodPerMonthLineChart;
