import React, { useState, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import AxiosInstance from "../../../../utils/AxiosInstance";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const AnxietyBarChart = () => {
  const [anxietyData, setAnxietyData] = useState([]);
  const chartRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchAnxietyData = async () => {
    try {
      const res = await AxiosInstance.get("/anxietyPredictions/perMonth");
      if (res.status === 200 && res.data.success) {
        const formattedData = res.data.data.map((item) => ({
          month: monthNames[item._id.month - 1],
          mild: item.mildCount,
          severe: item.severeCount,
        }));
        setAnxietyData(formattedData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAnxietyData();
  }, []);

  const exportToCSV = () => {
    const currentYear = new Date().getFullYear();

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `Anxiety Data per month (Year ${currentYear})\n\n`;
    csvContent += "Month,Mild Count,Severe Count\n";

    anxietyData.forEach((row) => {
      const { month, mild, severe } = row; // Directly use the properties from anxietyData
      csvContent += `${month},${mild},${severe}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `anxiety_data_${currentYear}.csv`);
    document.body.appendChild(link);

    link.click(); // Trigger the download
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
        pdf.text("Anxiety Data per month", 15, 60);

        pdf.addImage(imgData, "PNG", 15, 60, 180, 100);

        pdf.save("anxiety_data_per_month.pdf");
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
        newWindow.document.write(`<html>
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

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-4">
        Monthly Anxiety Test Results
      </h2>
      <div ref={chartRef} className=" p-6  w-full flex justify-center">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={anxietyData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            {/* Gradient Definitions */}
            <defs>
              <linearGradient id="mildGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FED0C5" />
                <stop offset="100%" stopColor="#8B47B5" />
              </linearGradient>
              <linearGradient id="severeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F8B8BA" />
                <stop offset="100%" stopColor="#B13D5D" />
              </linearGradient>
            </defs>

            {/* Chart Components */}
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="mild"
              fill="url(#mildGradient)"
              name="Mild Anxiety"
              animationDuration={1500}
            />
            <Bar
              dataKey="severe"
              fill="url(#severeGradient)"
              name="Severe Anxiety"
              animationDuration={1500}
            />
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

export default AnxietyBarChart;
