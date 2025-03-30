import React, { useState, useEffect, forwardRef } from "react";
import AxiosInstance from "../../../../utils/AxiosInstance";
import { CircularProgress } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const MoodDistribution = forwardRef((props, ref) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const COLORS = ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"];

  const fetchMoodDistribution = async () => {
    setLoading(true);
    try {
      const res = await AxiosInstance.get("/moodEntries/moodDistribution");
      if (res.status === 200) {
        // console.log(res.data.data);
        setData(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching mood distribution:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMoodDistribution();
  }, []);

  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Distribution of User Moods (Year 2025)\n\n";
    csvContent += "Mood,Count\n";

    data.forEach((entry) => {
      csvContent += `${entry.mood},${entry.count}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "mood_distribution.csv");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = (previousMoodData = null) => {
    const headerImg = new Image();
    headerImg.src = "/logo/result.png";

    headerImg.onload = () => {
      if (ref.current) {
        html2canvas(ref.current, { scale: 2 }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");

          // Add header image (centered)
          const headerWidth = 140;
          const headerX = (pdf.internal.pageSize.width - headerWidth) / 2;
          pdf.addImage(headerImg, "PNG", headerX, 10, headerWidth, 40);

          // Title
          pdf.setFontSize(16);
          pdf.setFont("helvetica", "bold");
          pdf.text(
            "Mood Tracking Analysis Report",
            pdf.internal.pageSize.width / 2,
            60,
            { align: "center" }
          );

          // Add chart image
          const chartWidth = 160;
          const chartHeight = 90;
          const chartX = (pdf.internal.pageSize.width - chartWidth) / 2;
          pdf.addImage(imgData, "PNG", chartX, 70, chartWidth, chartHeight);

          // Calculate Mood Statistics
          const totalUsers = data.reduce((sum, mood) => sum + mood.count, 0);
          const mostCommonMood = data.reduce((prev, current) =>
            prev.count > current.count ? prev : current
          );
          const leastCommonMood = data.reduce((prev, current) =>
            prev.count < current.count ? prev : current
          );

          const positiveMoods =
            data.find((m) => m.mood === "Happy")?.count || 0;
          const negativeMoods =
            (data.find((m) => m.mood === "Sad")?.count || 0) +
            (data.find((m) => m.mood === "Angry")?.count || 0) +
            (data.find((m) => m.mood === "Anxious")?.count || 0);

          const positivePercentage = (
            (positiveMoods / totalUsers) *
            100
          ).toFixed(2);
          const negativePercentage = (
            (negativeMoods / totalUsers) *
            100
          ).toFixed(2);

          let lineY = 170;

          // Analysis Section
          pdf.setFontSize(12);
          pdf.setFont("helvetica", "bold");
          pdf.text("Overall Analysis & Interpretation:", 10, lineY);
          pdf.setFont("helvetica", "normal");

          lineY += 10;
          pdf.text(`• Total Users Analyzed: ${totalUsers}`, 10, lineY);
          lineY += 10;
          pdf.text(
            `• Most Common Mood: ${mostCommonMood.mood} (${mostCommonMood.count} users)`,
            10,
            lineY
          );
          lineY += 10;
          pdf.text(
            `• Least Common Mood: ${leastCommonMood.mood} (${leastCommonMood.count} users)`,
            10,
            lineY
          );
          lineY += 10;
          pdf.text(
            `• Positive Mood Percentage: ${positivePercentage}%`,
            10,
            lineY
          );
          lineY += 10;
          pdf.text(
            `• Negative Mood Percentage: ${negativePercentage}%`,
            10,
            lineY
          );

          // Comparison with Previous Data (if available)
          if (previousMoodData) {
            lineY += 15;
            pdf.setFont("helvetica", "bold");
            pdf.text("Mood Trends Compared to Last Report:", 10, lineY);
            pdf.setFont("helvetica", "normal");
            lineY += 10;

            previousMoodData.forEach((prevMood) => {
              const currentMood = data.find((m) => m.mood === prevMood.mood);
              if (currentMood) {
                const diff = currentMood.count - prevMood.count;
                const trend = diff > 0 ? "increased" : "decreased";
                pdf.text(
                  `• ${prevMood.mood} has ${trend} by ${Math.abs(diff)} users.`,
                  10,
                  lineY
                );
                lineY += 10;
              }
            });
          }

          // Correlation Insights
          lineY += 10;
          pdf.setFont("helvetica", "bold");
          pdf.text("Mood Correlation & Insights:", 10, lineY);
          pdf.setFont("helvetica", "normal");
          lineY += 10;

          if (data.find((m) => m.mood === "Anxious")?.count > 3) {
            pdf.text(
              "• High Anxiety levels detected. Consider stress management techniques.",
              10,
              lineY
            );
            lineY += 10;
          }

          if (data.find((m) => m.mood === "Sad")?.count > 5) {
            pdf.text(
              "• Increase in Sadness detected. Users might benefit from support groups.",
              10,
              lineY
            );
            lineY += 10;
          }

          if (positiveMoods > negativeMoods) {
            pdf.text(
              "• Majority of users are happy, keep promoting positive experiences!",
              10,
              lineY
            );
          } else {
            pdf.text(
              "• Negative moods are rising. Implement mood-boosting activities.",
              10,
              lineY
            );
          }

          pdf.save("mood_tracking_analysis.pdf");
        });
      }
    };
  };

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
      <h2 className="text-lg font-semibold mb-4">Distribution of User Moods</h2>

      <div ref={ref} className="w-full">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="mood"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="relative mt-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="border border-purple-600 text-purple-600 px-5 py-2 rounded-lg shadow-md hover:bg-purple-600 hover:text-white transition"
        >
          Export ▼
        </button>

        {isOpen && (
          <div className="absolute left-0 mt-2 w-40 bg-white border border-purple-300 rounded-lg shadow-md">
            <button
              onClick={() => {
                exportToPDF();
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-purple-600 hover:bg-purple-100"
            >
              Export PDF
            </button>
            <button
              onClick={() => {
                exportToCSV();
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-purple-600 hover:bg-purple-100"
            >
              Export CSV
            </button>
            <button
              onClick={() => {
                handlePrint();
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-purple-600 hover:bg-purple-100"
            >
              Print
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default MoodDistribution;
