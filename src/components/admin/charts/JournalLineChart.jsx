import React, { useState, useEffect, forwardRef } from "react";
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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const JournalLineChart = forwardRef((props, ref) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    await AxiosInstance.get(`/journalEntries/perMonthAdmin`)
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.data);
          console.log(res.data.data);
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

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";

    csvContent += "User Journal Entries Per Month\n\n";

    csvContent += "Month, Count\n";

    data.forEach((row) => {
      csvContent += `${row.month}, ${row.count}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "journal_entries_per_month.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    const input = ref.current;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      // Load header image
      const headerImg = new Image();
      headerImg.src = "/logo/result.png";

      headerImg.onload = () => {
        const pageWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const margin = 15;
        let yPosition = 10;

        // Add Header Image (scaled to fit)
        const headerWidth = 120;
        const headerHeight = 30;
        pdf.addImage(
          headerImg,
          "PNG",
          (pageWidth - headerWidth) / 2,
          yPosition,
          headerWidth,
          headerHeight
        );
        yPosition += headerHeight + 5;

        // Add Title
        pdf.setFontSize(14);
        pdf.text("User Journal Entries Per Month Report", margin, yPosition);
        yPosition += 10;

        // Scale Down Graph (ensure it fits)
        const graphWidth = 160;
        const graphHeight = 70; // Adjusted height to fit
        pdf.addImage(
          imgData,
          "PNG",
          (pageWidth - graphWidth) / 2,
          yPosition,
          graphWidth,
          graphHeight
        );
        yPosition += graphHeight + 10;

        // Add Analysis
        pdf.setFontSize(10);
        const analysisText = generateAnalysis(data);
        const maxTextHeight = pageHeight - yPosition - 20; // Ensure text fits within page

        // Auto-wrap text within the remaining space
        const splitText = pdf.splitTextToSize(
          analysisText,
          pageWidth - 2 * margin
        );
        const textHeight = splitText.length * 4; // Estimate line height

        if (textHeight > maxTextHeight) {
          // Trim text if it overflows
          splitText.length = Math.floor(maxTextHeight / 4);
          splitText.push("... (truncated)");
        }

        pdf.text(splitText, margin, yPosition);

        pdf.save("Journal_Entries_Report.pdf");
      };
    });
  };

  const handlePrint = () => {
    const input = ref.current;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const newWindow = window.open("", "_blank");

      // Load header image
      const headerImg = new Image();
      headerImg.src = "/logo/result.png";

      headerImg.onload = () => {
        const analysisText = generateAnalysis(data).replace(/\n/g, "<br>");

        newWindow.document.write(`
          <html>
            <head>
              <title>Print Report</title>
              <style>
                @media print {
                  body {
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                    text-align: center;
                  }
                  .report-container {
                    width: 95%;
                    margin: auto;
                    text-align: left;
                    font-size: 12px;
                  }
                  h2 {
                    font-size: 18px;
                    margin: 10px 0;
                  }
                  h3 {
                    font-size: 14px;
                    margin-bottom: 5px;
                  }
                  .analysis {
                    font-size: 12px;
                    line-height: 1.4;
                    margin: 10px 0;
                  }
                  img {
                    max-width: 100%;
                    height: auto;
                  }
                  .chart {
                    width: 70%;
                    max-width: 500px;
                    margin: auto;
                    display: block;
                  }
                }
              </style>
            </head>
            <body>
              <img src="/logo/result.png" width="400" height="80">
              <h2>User Journal Entries Per Month Report</h2>
              <img class="chart" src="${imgData}">
              <div class="report-container">
                <h3>Analysis and Interpretation</h3>
                <p class="analysis">${analysisText}</p>
              </div>
              <script>
                window.onload = () => {
                  window.print();
                };
              </script>
            </body>
          </html>
        `);
        newWindow.document.close();
      };
    });
  };

  // Function to generate insights based on data
  const generateAnalysis = (data) => {
    let totalEntries = data.reduce((sum, item) => sum + item.count, 0);
    let highestMonth = data.reduce((prev, current) =>
      prev.count > current.count ? prev : current
    );
    let lowestMonth = data.reduce((prev, current) =>
      prev.count < current.count ? prev : current
    );
    let averageEntries = (totalEntries / data.length).toFixed(2);

    return `
      Overview:
      This report provides a comprehensive analysis of user journal entries recorded per month. The data reflects the frequency of journaling activity and highlights notable trends across different periods.
  
      Key Findings:
      - A total of ${totalEntries} journal entries were recorded over the observed months.
      - The highest number of entries was documented in ${highestMonth.month} with ${highestMonth.count} submissions.
      - The lowest journaling activity was recorded in ${lowestMonth.month}, with only ${lowestMonth.count} entries.
      - On average, users submitted approximately ${averageEntries} entries per month.
  
      Interpretation:
      The observed trends suggest variations in journaling frequency, which may be influenced by seasonal factors, academic or work-related commitments, and personal motivation. The significant increase in entries during ${highestMonth.month} could indicate periods of heightened engagement, possibly due to major events or increased reflective practices. Conversely, the decline in ${lowestMonth.month} may highlight periods of reduced activity, potentially caused by external distractions or lower engagement.
  
      Recommendations:
      To promote consistent journaling habits, it may be beneficial to introduce reminders, structured reflection prompts, or engagement incentives. Further research could explore the underlying factors contributing to fluctuations in journaling behavior to develop strategies for maintaining steady participation levels.
    `;
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-4">
        User Journal Entries Per Month
      </h2>

      <div ref={ref} className="p-6 w-full flex justify-center">
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

export default JournalLineChart;
