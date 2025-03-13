import React, { useState, useEffect, useRef } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label,
} from "recharts";
import AxiosInstance from "../../../../utils/AxiosInstance";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ScatterPlotChart = () => {
  const [data, setData] = useState([]);
  const chartRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchAnxietyData = async () => {
      try {
        const response = await AxiosInstance.get(
          "anxietyPredictions/statsDietQuality"
        );

        if (
          response.status === 200 &&
          Array.isArray(response.data.scatterData)
        ) {
          setData(response.data.scatterData);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAnxietyData();
  }, []);

  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";

    // Add report title
    csvContent += "Scatter Plot Analysis: Diet Quality vs. Stress Level\n\n";

    // Add column headers
    csvContent += "X,Y\n";

    // Loop through the data and append to CSV
    data.forEach((point) => {
      csvContent += `${point.x},${point.y}\n`;
    });

    // Create a downloadable link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "scatter_plot_data.csv");
    document.body.appendChild(link);

    // Trigger the download
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

        //  Add title
        pdf.setFontSize(16);
        pdf.text(
          "Scatter Plot Analysis: Diet Quality vs. Stress Level",
          15,
          60
        );

        // Add scatter plot image
        pdf.addImage(imgData, "PNG", 15, 70, 180, 100);

        // Save PDF
        const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "_");
        pdf.save(`Diet_Quality_vs_Stress_Level_${timestamp}.pdf`);
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

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-4">
        Diet Quality vs. Stress Level
      </h2>

      <div ref={chartRef} className=" p-6  w-full flex justify-center">
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />

            {/* X-Axis with Label */}
            <XAxis type="number" dataKey="x" name="Diet Quality">
              <Label
                value="Diet Quality (Scale 1-10)"
                offset={-10}
                position="insideBottom"
              />
            </XAxis>

            {/* Y-Axis with Label */}
            <YAxis type="number" dataKey="y" name="Stress Level">
              <Label
                value="Stress Level (Scale 1-10)"
                angle={-90}
                position="insideLeft"
              />
            </YAxis>

            <Tooltip cursor={{ strokeDasharray: "3 3" }} />

            {/* Legend positioned at top right */}
            <Legend
              align="right"
              verticalAlign="top"
              wrapperStyle={{ right: 10, top: 10 }}
            />

            {/* Scatter Plot Data */}
            <Scatter name="Data Points" data={data} fill="#FF4500" />
          </ScatterChart>
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

export default ScatterPlotChart;
