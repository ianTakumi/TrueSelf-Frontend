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

const JournalPieChart = forwardRef((props, ref) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    await AxiosInstance.get(`/journalEntries/perMonthPieAdmin`)
      .then((res) => {
        if (res.status === 200) {
          const formattedData = res.data.data.map((entry) => ({
            ...entry,
            percentage: parseFloat(entry.percentage),
          }));
          console.log("Formatted Data:", formattedData);
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

  useEffect(() => {
    if (props.onDataUpdate) {
      props.onDataUpdate(data);
    }
  }, [data]);

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

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "User Journal Entries Distribution Report\n\n";

    csvContent += "Month, Percentage\n";
    data.forEach((row) => {
      csvContent += `${row.month}, ${row.percentage}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "user_journal_entries_distribution.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    if (data.length === 0) {
      notifyError("No data available to export.");
      return;
    }

    const input = ref.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      // Load header image
      const headerImg = new Image();
      headerImg.src = "/logo/result.png";

      headerImg.onload = () => {
        pdf.addImage(headerImg, "PNG", 30, 10, 140, 40);

        // Title
        pdf.setFontSize(16);
        pdf.text("User Journal Entries Distribution Report", 15, 60);
        pdf.addImage(imgData, "PNG", 15, 65, 180, 90);

        // Table Header
        pdf.setFontSize(12);
        pdf.text("Month", 15, 170);
        pdf.text("Percentage (%)", 100, 170);
        let yPosition = 180;

        // Table Data Variables
        let totalPercentage = 0;
        let highestMonth = "";
        let lowestMonth = "";
        let highestValue = -Infinity;
        let lowestValue = Infinity;
        let mostIncreaseMonth = "";
        let mostDecreaseMonth = "";
        let largestIncrease = -Infinity;
        let largestDecrease = Infinity;
        let trendChanges = [];

        data.forEach((entry, index) => {
          pdf.text(entry.month, 15, yPosition);
          pdf.text(`${entry.percentage.toFixed(2)}%`, 100, yPosition);
          yPosition += 10;

          totalPercentage += entry.percentage;

          // Identify highest and lowest journal entry months
          if (entry.percentage > highestValue) {
            highestValue = entry.percentage;
            highestMonth = entry.month;
          }
          if (entry.percentage < lowestValue) {
            lowestValue = entry.percentage;
            lowestMonth = entry.month;
          }

          // Identify the most significant increase/decrease
          if (index > 0) {
            let prevPercentage = data[index - 1].percentage;
            let change = entry.percentage - prevPercentage;

            trendChanges.push({
              month: entry.month,
              change: change.toFixed(2),
            });

            if (change > largestIncrease) {
              largestIncrease = change;
              mostIncreaseMonth = entry.month;
            }
            if (change < largestDecrease) {
              largestDecrease = change;
              mostDecreaseMonth = entry.month;
            }
          }
        });

        const averagePercentage = totalPercentage / data.length;

        // Determine overall trend
        let overallTrend = "fluctuating";
        if (data.length > 1) {
          const firstEntry = data[0].percentage;
          const lastEntry = data[data.length - 1].percentage;

          if (lastEntry > firstEntry) {
            overallTrend = "increasing";
          } else if (lastEntry < firstEntry) {
            overallTrend = "decreasing";
          }
        }

        // Analysis Section
        pdf.setFontSize(14);
        pdf.text("Analysis and Interpretation", 15, yPosition + 10);
        pdf.setFontSize(12);

        pdf.text(
          `- The highest number of journal entries was recorded in ${highestMonth} (${highestValue.toFixed(
            2
          )}%).`,
          15,
          yPosition + 20
        );
        pdf.text(
          `- The lowest number of journal entries was recorded in ${lowestMonth} (${lowestValue.toFixed(
            2
          )}%).`,
          15,
          yPosition + 30
        );
        pdf.text(
          `- The average journal entry percentage over the period is ${averagePercentage.toFixed(
            2
          )}%.`,
          15,
          yPosition + 40
        );

        pdf.text(
          `- The most significant increase occurred in ${mostIncreaseMonth}, with a rise of ${largestIncrease.toFixed(
            2
          )}%.`,
          15,
          yPosition + 50
        );
        pdf.text(
          `- The most significant decrease occurred in ${mostDecreaseMonth}, with a drop of ${Math.abs(
            largestDecrease.toFixed(2)
          )}%.`,
          15,
          yPosition + 60
        );

        pdf.text(
          `- The overall trend in journal entries appears to be ${overallTrend} over the analyzed period.`,
          15,
          yPosition + 70
        );

        // Add trend changes month-over-month
        let trendYPosition = yPosition + 80;
        pdf.text("Month-over-Month Changes:", 15, trendYPosition);
        pdf.setFontSize(11);

        trendChanges.forEach((change, index) => {
          pdf.text(
            `- ${change.month}: ${change.change > 0 ? "+" : ""}${
              change.change
            }%`,
            15,
            trendYPosition + (index + 1) * 10
          );
        });

        // Save PDF
        pdf.save("user_journal_entries_distribution.pdf");
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
      const pdf = new jsPDF("p", "mm", "a4");

      // Load header image
      const headerImg = new Image();
      headerImg.src = "/logo/result.png";

      headerImg.onload = () => {
        pdf.addImage(headerImg, "PNG", 30, 10, 140, 40);

        // Title
        pdf.setFontSize(16);
        pdf.text("User Journal Entries Distribution Report", 15, 60);
        pdf.addImage(imgData, "PNG", 15, 65, 180, 90);

        // Table Header
        pdf.setFontSize(12);
        pdf.text("Month", 15, 170);
        pdf.text("Percentage (%)", 100, 170);
        let yPosition = 180;

        // Table Data Variables
        let totalPercentage = 0;
        let highestMonth = "";
        let lowestMonth = "";
        let highestValue = -Infinity;
        let lowestValue = Infinity;
        let mostIncreaseMonth = "";
        let mostDecreaseMonth = "";
        let largestIncrease = -Infinity;
        let largestDecrease = Infinity;
        let trendChanges = [];

        data.forEach((entry, index) => {
          pdf.text(entry.month, 15, yPosition);
          pdf.text(`${entry.percentage.toFixed(2)}%`, 100, yPosition);
          yPosition += 10;

          totalPercentage += entry.percentage;

          // Identify highest and lowest journal entry months
          if (entry.percentage > highestValue) {
            highestValue = entry.percentage;
            highestMonth = entry.month;
          }
          if (entry.percentage < lowestValue) {
            lowestValue = entry.percentage;
            lowestMonth = entry.month;
          }

          // Identify the most significant increase/decrease
          if (index > 0) {
            let prevPercentage = data[index - 1].percentage;
            let change = entry.percentage - prevPercentage;

            trendChanges.push({
              month: entry.month,
              change: change.toFixed(2),
            });

            if (change > largestIncrease) {
              largestIncrease = change;
              mostIncreaseMonth = entry.month;
            }
            if (change < largestDecrease) {
              largestDecrease = change;
              mostDecreaseMonth = entry.month;
            }
          }
        });

        const averagePercentage = totalPercentage / data.length;

        // Determine overall trend
        let overallTrend = "fluctuating";
        if (data.length > 1) {
          const firstEntry = data[0].percentage;
          const lastEntry = data[data.length - 1].percentage;

          if (lastEntry > firstEntry) {
            overallTrend = "increasing";
          } else if (lastEntry < firstEntry) {
            overallTrend = "decreasing";
          }
        }

        // Analysis Section
        pdf.setFontSize(14);
        pdf.text("Analysis and Interpretation", 15, yPosition + 10);
        pdf.setFontSize(12);

        pdf.text(
          `- The highest number of journal entries was recorded in ${highestMonth} (${highestValue.toFixed(
            2
          )}%).`,
          15,
          yPosition + 20
        );
        pdf.text(
          `- The lowest number of journal entries was recorded in ${lowestMonth} (${lowestValue.toFixed(
            2
          )}%).`,
          15,
          yPosition + 30
        );
        pdf.text(
          `- The average journal entry percentage over the period is ${averagePercentage.toFixed(
            2
          )}%.`,
          15,
          yPosition + 40
        );

        pdf.text(
          `- The most significant increase occurred in ${mostIncreaseMonth}, with a rise of ${largestIncrease.toFixed(
            2
          )}%.`,
          15,
          yPosition + 50
        );
        pdf.text(
          `- The most significant decrease occurred in ${mostDecreaseMonth}, with a drop of ${Math.abs(
            largestDecrease.toFixed(2)
          )}%.`,
          15,
          yPosition + 60
        );

        pdf.text(
          `- The overall trend in journal entries appears to be ${overallTrend} over the analyzed period.`,
          15,
          yPosition + 70
        );

        // Add trend changes month-over-month
        let trendYPosition = yPosition + 80;
        pdf.text("Month-over-Month Changes:", 15, trendYPosition);
        pdf.setFontSize(11);

        trendChanges.forEach((change, index) => {
          pdf.text(
            `- ${change.month}: ${change.change > 0 ? "+" : ""}${
              change.change
            }%`,
            15,
            trendYPosition + (index + 1) * 10
          );
        });

        // Print the PDF instead of saving it
        pdf.autoPrint();
        window.open(pdf.output("bloburl"), "_blank");
      };
    });
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-4">
        User Journal Entries Distribution
      </h2>

      <div ref={ref} className="p-6 w-full flex justify-center">
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

      <div div className="relative mt-6">
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

export default JournalPieChart;
