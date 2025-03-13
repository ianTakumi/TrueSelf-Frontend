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

  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";

    // Add Report Title
    csvContent += `Occupation Distribution Report\n\n`;

    // Add Column Headers
    csvContent += "Occupation,Count,Average Severity\n";

    // Loop through the data and append each row
    data.forEach(({ occupation, count, avgSeverity }) => {
      csvContent += `${occupation},${count},${avgSeverity.toFixed(2)}\n`;
    });

    // Encode and trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);

    // Add timestamp to filename
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "");
    link.setAttribute("download", `Occupation_Distribution_${timestamp}.csv`);

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
        pdf.text("Occupational Breakdown of Test Takers", 15, 60);

        pdf.addImage(imgData, "PNG", 15, 60, 180, 100);

        const currentDateTime = new Date()
          .toISOString()
          .replace(/T/, "_")
          .replace(/\..+/, "")
          .replace(/:/g, "-");

        pdf.save(`Occupation_Distribution_${currentDateTime}.pdf`);
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
        newWindow.document.write(` <html>
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
      <h2 className="text-xl font-semibold mb-4">Occupation Distribution</h2>

      <div ref={chartRef} className="p-6 w-full flex justify-center">
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
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
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

export default PieChartComponent;
