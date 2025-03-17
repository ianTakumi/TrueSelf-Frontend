import React, { useEffect, useState, forwardRef } from "react";
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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const SleepBarChart = forwardRef((props, ref) => {
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";

    // Add report title
    csvContent += "Sleep Hours vs Anxiety Severity Report\n\n";

    // Add CSV headers
    csvContent += "Sleep Range,Average Severity,Count\n";
    data.forEach((row) => {
      csvContent += `${row.sleepRange},${row.avgSeverity},${row.count}\n`;
    });

    // Create a downloadable link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);

    // Add timestamp to filename
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "");
    link.setAttribute("download", `Sleep_Anxiety_Report_${timestamp}.csv`);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const headerImg = new Image();
    headerImg.src = "/logo/result.png";

    const observations = [];
    let highestSeverity = null;
    let lowestSeverity = null;
    let mostUsers = null;

    if (!data || data.length === 0) {
      observations.push("No data available for analysis.");
    } else {
      highestSeverity = data.reduce((max, item) =>
        parseFloat(item.avgSeverity) > parseFloat(max.avgSeverity) ? item : max
      );

      lowestSeverity = data.reduce((min, item) =>
        parseFloat(item.avgSeverity) < parseFloat(min.avgSeverity) ? item : min
      );

      mostUsers = data.reduce((max, item) =>
        item.count > max.count ? item : max
      );

      observations.push(
        `• The highest average anxiety severity (${highestSeverity.avgSeverity}) was observed in individuals with ${highestSeverity.sleepRange} hours of sleep.`,
        `• The lowest average anxiety severity (${lowestSeverity.avgSeverity}) was recorded in the ${lowestSeverity.sleepRange} sleep range.`,
        `• The most users (${mostUsers.count}) fall within the ${mostUsers.sleepRange} sleep range.`,
        `• Individuals sleeping between 6-8 hours had an average severity of ${
          data.find((item) => item.sleepRange === "6-8")?.avgSeverity || "N/A"
        }, suggesting moderate anxiety levels.`,
        `• Longer sleep duration (9+ hours) does not necessarily mean lower anxiety, as their severity score is ${
          data.find((item) => item.sleepRange === "9+")?.avgSeverity || "N/A"
        }.`
      );
    }

    const analysis = `
  Based on the data, sleep duration appears to impact anxiety severity. 
  Individuals with extremely short sleep durations (1-2 hours) show signs of mild anxiety, while those with 6-8 hours of sleep exhibit moderate anxiety.
  Interestingly, those sleeping for 9+ hours still report significant anxiety levels, suggesting other influencing factors such as stress, lifestyle, or pre-existing mental health conditions.
    `;

    headerImg.onload = () => {
      const input = ref.current;

      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        pdf.addImage(headerImg, "PNG", 30, 10, 140, 40);

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(16);
        pdf.text("Anxiety Severity Analysis by Sleep Duration", 15, 60);

        pdf.addImage(imgData, "PNG", 15, 70, 180, 90);

        pdf.setFontSize(14);
        pdf.text("Key Observations:", 15, 170);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(12);
        let yPosition = 180;
        observations.forEach((obs) => {
          const wrappedText = pdf.splitTextToSize(obs, 180); // Ensures text wraps within the margin
          pdf.text(wrappedText, 15, yPosition);
          yPosition += wrappedText.length * 6; // Adjusts spacing based on wrapped text
        });

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.text("Overall Analysis & Interpretation:", 15, yPosition + 10);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(12);
        const analysisLines = pdf.splitTextToSize(analysis, 180);
        pdf.text(analysisLines, 15, yPosition + 20);

        const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "");
        pdf.save(`Anxiety_Severity_Sleep_Duration_${timestamp}.pdf`);
      });
    };
  };

  const handlePrint = () => {
    const input = ref.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const newWindow = window.open("", "_blank");

      const headerImg = new Image();
      headerImg.src = "/logo/result.png";

      // Dynamic Analysis Based on Data
      let observations = [];
      let highestSeverity = null;
      let lowestSeverity = null;
      let mostUsers = null;

      if (!data || data.length === 0) {
        observations.push("• No data available for analysis.");
      } else {
        highestSeverity = data.reduce((max, item) =>
          parseFloat(item.avgSeverity) > parseFloat(max.avgSeverity)
            ? item
            : max
        );

        lowestSeverity = data.reduce((min, item) =>
          parseFloat(item.avgSeverity) < parseFloat(min.avgSeverity)
            ? item
            : min
        );

        mostUsers = data.reduce((max, item) =>
          item.count > max.count ? item : max
        );

        observations.push(
          `• The highest average anxiety severity (${highestSeverity.avgSeverity}) was observed in individuals with ${highestSeverity.sleepRange} hours of sleep.`,
          `• The lowest average anxiety severity (${lowestSeverity.avgSeverity}) was recorded in the ${lowestSeverity.sleepRange} sleep range.`,
          `• The most users (${mostUsers.count}) fall within the ${mostUsers.sleepRange} sleep range.`,
          `• Individuals sleeping between 6-8 hours had an average severity of ${
            data.find((item) => item.sleepRange === "6-8")?.avgSeverity || "N/A"
          }, suggesting moderate anxiety levels.`,
          `• Longer sleep duration (9+ hours) does not necessarily mean lower anxiety, as their severity score is ${
            data.find((item) => item.sleepRange === "9+")?.avgSeverity || "N/A"
          }.`
        );
      }

      const analysis = `
        <p style="text-align: justify; width: 80%; margin: auto;">
          <strong>Overall Analysis & Interpretation:</strong><br>
          Based on the data, sleep duration appears to impact anxiety severity. 
          Individuals with extremely short sleep durations (${highestSeverity.sleepRange} hours) show signs of high anxiety, while those with ${lowestSeverity.sleepRange} hours of sleep exhibit lower anxiety levels.
          Interestingly, those sleeping for 9+ hours still report significant anxiety levels, suggesting other influencing factors such as stress, lifestyle, or pre-existing mental health conditions.
        </p>
      `;

      headerImg.onload = () => {
        const headerImgData = headerImg.src;
        newWindow.document.write(`
          <html>
            <head>
              <title>Print Chart</title>
            </head>
            <body style="text-align: center;">
              <img src="${headerImgData}" style="width: 470px; margin-bottom: 20px;" />
              <h2>Contact Status Distribution</h2>
              <img src="${imgData}" style="width: 100%;" />
              <h3>Key Observations:</h3>
              <p style="text-align: justify; width: 80%; margin: auto;">
                ${observations.join("<br>")}
              </p>
              ${analysis}
              <script>
                window.onload = function() { window.print(); window.close(); };
              </script>
            </body>
          </html>
        `);

        newWindow.document.close();
      };
    });
  };

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

  useEffect(() => {
    if (props.onDataUpdate) {
      props.onDataUpdate(data);
    }
  }, [data]);

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">
        Anxiety Severity by Sleep Hours
      </h2>
      <div ref={ref} className=" p-6  w-full flex justify-center">
        <ResponsiveContainer width="100%" height={300}>
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

      <div className="relative mt-6">
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

export default SleepBarChart;
