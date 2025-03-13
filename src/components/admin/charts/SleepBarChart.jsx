import React, { useEffect, useState, useRef } from "react";
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

const SleepBarChart = () => {
  const [data, setData] = useState([]);
  const chartRef = useRef(null);
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

    headerImg.onload = () => {
      const input = chartRef.current;

      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        pdf.addImage(headerImg, "PNG", 30, 10, 140, 40);

        pdf.setFontSize(16);
        pdf.text("Anxiety Severity Analysis by Sleep Duration", 15, 60);

        pdf.addImage(imgData, "PNG", 15, 60, 180, 100);

        const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, ""); // Generates YYYYMMDDHHMMSS format
        pdf.save(`Anxiety_Severity_Sleep_Duration_${timestamp}.pdf`);
      });
    };
  };

  const handlePrint = () => {
    const input = chartRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const newWindow = window.open("", "_blank");

      const headerImg = new Image();
      headerImg.src = "/logo/result.png";
      headerImg.onload = () => {
        const headerImgData = headerImg.src;
        newWindow.document.write(`  <html>
            <head>
              <title>Print Chart</title>
            </head>
            <body style="text-align: center;">
              <img src="${headerImgData}" style="width: 600px; margin-bottom: 20px;" />
              <h2>Contact Status Distribution</h2>
              <img src="${imgData}" style="width: 100%;" />
              <script>
                window.onload = function() { window.print(); window.close(); };
              </script>
            </body>
          </html>`);

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

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">
        Anxiety Severity by Sleep Hours
      </h2>
      <div ref={chartRef} className=" p-6  w-full flex justify-center">
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
};

export default SleepBarChart;
