import React, { useState, useEffect, forwardRef } from "react";
import AxiosInstance from "../../../../utils/AxiosInstance";
import { notifyError } from "../../../../utils/helpers";
import { CircularProgress } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const MoodPerMonthLineChart = forwardRef((props, ref) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await AxiosInstance.get(`/moodEntries/moodTrends`);
      if (res.status === 200) {
        const formattedData = res.data.data.map((entry) => ({
          month: `${entry._id.year}-${entry._id.month
            .toString()
            .padStart(2, "0")}`,
          ...entry.moods.reduce((acc, mood) => {
            acc[mood.mood] = mood.count;
            return acc;
          }, {}),
        }));
        setData(formattedData);
      }
    } catch (err) {
      notifyError(err.response?.data?.message || "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (props.onDataUpdate) {
      props.onDataUpdate(data);
    }
  }, [data]);

  if (loading) {
    return (
      <div className="flex justify-center flex-col items-center p-10">
        <CircularProgress />
        <h1 className="font-bold mt-2">Loading...</h1>
      </div>
    );
  }

  const generateAnalysis = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      return "No mood data available for analysis.";
    }

    let analysis =
      "The following report provides an in-depth analysis of mood trends over the months of 2025.\n\n";

    let previousMonthData = null;

    data.forEach((monthData, index) => {
      if (!monthData || !monthData._id || !monthData.moods) {
        return; // Skip invalid entries
      }

      const { year, month } = monthData._id;
      const monthName = new Date(year, month - 1).toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });

      const moodSummary = monthData.moods
        .map((m) => `${m.mood}: ${m.count} entries`)
        .join(", ");

      analysis += `📅 Month: ${monthName}\n`;
      analysis += `➡️ Mood distribution: ${moodSummary || "No data"}.\n`;

      if (previousMonthData) {
        const prevMonthMoods = new Map(
          previousMonthData.moods.map((m) => [m.mood, m.count])
        );
        const changes = [];

        monthData.moods.forEach(({ mood, count }) => {
          const prevCount = prevMonthMoods.get(mood) || 0;
          const difference = count - prevCount;
          if (difference !== 0) {
            const trend = difference > 0 ? "increase" : "decrease";
            changes.push(`${mood} (${trend} by ${Math.abs(difference)})`);
          }
        });

        if (changes.length > 0) {
          analysis += `📊 Mood changes compared to last month: ${changes.join(
            ", "
          )}.\n`;
        } else {
          analysis += `⚖️ No significant mood shifts compared to the previous month.\n`;
        }
      }

      analysis += `\n`;
      previousMonthData = monthData;
    });

    analysis += `📌 Summary:\n`;
    analysis += `- The report identifies patterns in user mood fluctuations across the months.\n`;
    analysis += `- Moods with significant increases or decreases are noted.\n`;
    analysis += `- These insights can help in understanding emotional trends and potential influencing factors.\n`;

    return analysis;
  };

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "User Mood Trends Per Month\n\n";
    csvContent += "Month,Angry,Anxious,Happy,Neutral,Sad\n";

    data.forEach((row) => {
      csvContent += `${row.month},${row.Angry || 0},${row.Anxious || 0},${
        row.Happy || 0
      },${row.Neutral || 0},${row.Sad || 0}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "user_mood_trends.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    if (data.length === 0) {
      notifyError("No data to export.");
      return;
    }

    const input = ref.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;
      let yPosition = 70;

      const headerImg = new Image();
      headerImg.src = "/logo/result.png";

      headerImg.onload = () => {
        pdf.addImage(headerImg, "PNG", 30, 10, 140, 40);
        pdf.setFontSize(16);
        pdf.text("User Mood Trends Per Month Report", margin, 60);

        // Add Graph Representation
        pdf.addImage(imgData, "PNG", margin, yPosition, contentWidth, 80);
        yPosition += 90;

        // Generate Analysis
        pdf.setFontSize(14);
        pdf.text("Analysis and Interpretation", margin, yPosition);
        yPosition += 10;
        pdf.setFontSize(12);

        // Compute dominant and least dominant emotions
        const moodCounts = {};
        data.forEach((month) => {
          Object.entries(month).forEach(([mood, count]) => {
            if (mood !== "month") {
              moodCounts[mood] = (moodCounts[mood] || 0) + count;
            }
          });
        });

        const sortedMoods = Object.entries(moodCounts).sort(
          (a, b) => b[1] - a[1]
        );
        const dominantEmotion =
          sortedMoods.length > 0 ? sortedMoods[0][0] : "N/A";
        const leastDominantEmotion =
          sortedMoods.length > 1
            ? sortedMoods[sortedMoods.length - 1][0]
            : "N/A";

        const potentialCauses =
          dominantEmotion === "Anxious"
            ? "high stress levels, uncertainty, or external pressures."
            : dominantEmotion === "Happy"
            ? "positive social interactions, achievements, or fulfilling activities."
            : "various external and internal factors.";

        const possibleInterpretation =
          leastDominantEmotion === "Sad"
            ? "a generally positive emotional state."
            : "a lack of significant emotional fluctuations.";

        pdf.setFontSize(12);

        const overallAnalysis = `Based on the collected data, we observe varying mood trends across different months. 
The most prominent emotion appears to be ${dominantEmotion}, indicating ${potentialCauses}. 
Conversely, ${leastDominantEmotion} is the least frequent mood, which may suggest ${possibleInterpretation}. 

Factors such as seasonal changes, external stressors, and lifestyle habits may contribute to these fluctuations. 
Further analysis and cross-referencing with external factors like work schedules or major life events could provide deeper insights. 
Recommendations include maintaining a balanced lifestyle, monitoring stress levels, and seeking professional guidance if necessary.`;

        const overallSplitText = pdf.splitTextToSize(
          overallAnalysis,
          contentWidth
        );
        yPosition += 10;

        overallSplitText.forEach((line) => {
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(line, margin, yPosition);
          yPosition += 6;
        });

        pdf.save("Mood_Trends_Report.pdf");
      };
    });
  };

  const handlePrint = () => {
    if (data.length === 0) {
      notifyError("No data available to print.");
      return;
    }

    const input = ref.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const newWindow = window.open("", "_blank");

      const moodCounts = {};
      data.forEach((month) => {
        Object.entries(month).forEach(([mood, count]) => {
          if (mood !== "month") {
            moodCounts[mood] = (moodCounts[mood] || 0) + count;
          }
        });
      });

      const sortedMoods = Object.entries(moodCounts).sort(
        (a, b) => b[1] - a[1]
      );
      const dominantEmotion =
        sortedMoods.length > 0 ? sortedMoods[0][0] : "N/A";
      const leastDominantEmotion =
        sortedMoods.length > 1 ? sortedMoods[sortedMoods.length - 1][0] : "N/A";

      const potentialCauses =
        dominantEmotion === "Anxious"
          ? "high stress levels, uncertainty, or external pressures."
          : dominantEmotion === "Happy"
          ? "positive social interactions, achievements, or fulfilling activities."
          : "various external and internal factors.";

      const possibleInterpretation =
        leastDominantEmotion === "Sad"
          ? "a generally positive emotional state."
          : "a lack of significant emotional fluctuations.";

      const overallAnalysis = `
        <p>Based on the collected data, we observe varying mood trends across different months.</p>
        <p>The most prominent emotion appears to be <strong>${dominantEmotion}</strong>, indicating ${potentialCauses}.</p>
        <p>Conversely, <strong>${leastDominantEmotion}</strong> is the least frequent mood, which may suggest ${possibleInterpretation}.</p>
        <p>Factors such as seasonal changes, external stressors, and lifestyle habits may contribute to these fluctuations.</p>
        <p>Further analysis and cross-referencing with external factors like work schedules or major life events could provide deeper insights.</p>
        <p>Recommendations include maintaining a balanced lifestyle, monitoring stress levels, and seeking professional guidance if necessary.</p>
      `;

      newWindow.document.write(`
        <html>
          <head>
            <title>Print Report</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
              .report-container { width: 80%; margin: auto; text-align: left; }
              .analysis { margin-top: 10px; font-size: 14px; }
            </style>
          </head>
          <body>
            <img src="/logo/result.png" width="500" height="100">
            <h2>User Mood Trends Per Month Report</h2>
            <img src="${imgData}" style="width: 80%; margin-top: 20px;">
            <div class="report-container">
              <h3>Analysis and Interpretation</h3>
              <div class="analysis">${overallAnalysis}</div>
            </div>
            <script>window.print();</script>
          </body>
        </html>
      `);
      newWindow.document.close();
    });
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-4">User Mood Trends Per Month</h2>

      <div ref={ref} className="p-6 w-full flex justify-center">
        <ResponsiveContainer width="100%" height={380}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            {Object.keys(data[0] || {})
              .filter((key) => key !== "month")
              .map((mood, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={mood}
                  stroke={`#${Math.floor(Math.random() * 16777215).toString(
                    16
                  )}`}
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div div className="relative ">
        {/* Main Export Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="border border-purple-600 text-purple-600 px-5 py-2 rounded-lg shadow-md hover:bg-purple-600 hover:text-white transition"
        >
          Export ▼
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute left-0 mt-2 w-40 bg-white border border-purple-300 rounded-lg shadow-md">
            <button
              onClick={() => {
                exportPDF();
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-purple-600 hover:bg-purple-100"
            >
              Export PDF
            </button>
            <button
              onClick={() => {
                exportCSV();
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

export default MoodPerMonthLineChart;
