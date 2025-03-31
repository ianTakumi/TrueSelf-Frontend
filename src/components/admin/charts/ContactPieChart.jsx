import React, { useState, useEffect, forwardRef } from "react";
import AxiosInstance from "../../../../utils/AxiosInstance";
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

const COLORS = ["#FF69B4", "#FFB6C1", "#ADD8E6"];

const capitalizeFirstLetter = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);

const ContactPieChart = forwardRef((props, ref) => {
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchContactData();
  }, []);

  useEffect(() => {
    if (props.onDataUpdate) {
      props.onDataUpdate(data);
    }
  }, [data]);

  const fetchContactData = async () => {
    try {
      const res = await AxiosInstance.get("/contacts/status-distribution");
      if (res.status === 200) {
        const formattedData = res.data.map((item) => ({
          name: capitalizeFirstLetter(item._id),
          value: item.count,
        }));
        setData(formattedData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Function to export data as CSV
  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";

    csvContent += "Contact Status Distribution Report\n\n";

    csvContent += "Status, Count\n";

    data.forEach((row) => {
      csvContent += `${row.name}, ${row.value}\n`;
    });

    // Create and download the CSV file
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "contact_status_distribution.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to export chart as PDF
  const exportPDF = () => {
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
        pdf.text("Contact Status Distribution", 15, 60);
        pdf.addImage(imgData, "PNG", 15, 65, 180, 90);

        // Data Analysis
        let totalContacts = 0;
        let pendingCount = 0;
        let resolvedCount = 0;

        data.forEach((entry) => {
          totalContacts += entry.value;
          if (entry.name === "Pending") pendingCount = entry.value;
          if (entry.name === "Resolved") resolvedCount = entry.value;
        });

        let pendingPercentage = ((pendingCount / totalContacts) * 100).toFixed(
          2
        );
        let resolvedPercentage = (
          (resolvedCount / totalContacts) *
          100
        ).toFixed(2);

        let analysisText = `
        A total of ${totalContacts} contacts were recorded, categorized into Pending and Resolved statuses.
        The majority of cases remain Pending, accounting for ${pendingPercentage}% (${pendingCount} cases), 
        while only ${resolvedPercentage}% (${resolvedCount} cases) have been successfully resolved.
        
        This suggests potential inefficiencies in the resolution process, which may require further analysis 
        and intervention to enhance response times and improve customer satisfaction. 
        Strategies such as automated follow-ups, better workflow optimization, or additional resources 
        for case management could help balance the distribution and improve resolution rates.
        `;

        let yOffset = 160;
        pdf.setFontSize(12);
        pdf.text("Analysis & Interpretation:", 15, yOffset);
        pdf.setFontSize(10);

        let lines = pdf.splitTextToSize(analysisText, 180);
        lines.forEach((line, index) => {
          pdf.text(line, 15, yOffset + 6 + index * 6);
        });

        pdf.save("contact_status_distribution.pdf");
      };
    });
  };

  // Function to print the chart
  const handlePrint = () => {
    const input = ref.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const newWindow = window.open("", "_blank");

      // Load header image
      const headerImg = new Image();
      headerImg.src = "/logo/result.png";

      headerImg.onload = () => {
        const headerImgData = headerImg.src;

        // Generate data analysis
        let totalContacts = 0;
        let pendingCount = 0;
        let resolvedCount = 0;

        data.forEach((entry) => {
          totalContacts += entry.value;
          if (entry.name === "Pending") pendingCount = entry.value;
          if (entry.name === "Resolved") resolvedCount = entry.value;
        });

        let pendingPercentage = ((pendingCount / totalContacts) * 100).toFixed(
          2
        );
        let resolvedPercentage = (
          (resolvedCount / totalContacts) *
          100
        ).toFixed(2);

        const analysisText = `
        A total of ${totalContacts} contacts were recorded. The breakdown is as follows:
        - Pending: ${pendingCount} cases (${pendingPercentage}%)
        - Resolved: ${resolvedCount} cases (${resolvedPercentage}%)
        
        The high percentage of pending cases suggests potential bottlenecks in resolution.
        Implementing workflow optimizations, automated follow-ups, or additional resources
        may improve response times and enhance overall efficiency.
        `;

        newWindow.document.write(`
          <html>
            <head>
              <title>Print Chart</title>
              <style>
                body {
                  text-align: center;
                  font-family: Arial, sans-serif;
                  margin: 20px;
                }
                .container {
                  max-width: 800px;
                  margin: 0 auto;
                  text-align: left;
                }
                img {
                  width: 100%;
                  max-width: 600px;
                }
                h2 {
                  margin: 20px 0;
                }
                p {
                  font-size: 14px;
                  line-height: 1.6;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <img src="${headerImgData}" />
                <h2>Contact Status Distribution</h2>
                <img src="${imgData}" style="max-width: 100%; height: 350px;" />
                <h3>Data Analysis & Insights</h3>
                <p>${analysisText.replace(/\n/g, "<br>")}</p>
              </div>
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

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-4">
        Contact Status Distribution
      </h2>

      {/* Chart container */}
      <div ref={ref} className="p-6 w-full flex justify-center">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [
                `${value}%`,
                capitalizeFirstLetter(name),
              ]}
            />
            <Legend formatter={(value) => capitalizeFirstLetter(value)} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Export Buttons */}
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

export default ContactPieChart;
