import { useEffect, useState, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import AxiosInstance from "../../../../utils/AxiosInstance";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const MonthlyEngagementChart = () => {
  const [data, setData] = useState([]);
  const chartRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const fetchMonthlyEngagements = async () => {
    await AxiosInstance.get("/contacts/monthly-engagements").then((res) => {
      if (res.status === 200) {
        const formattedData = res.data.map((item) => ({
          name: new Date(item.year, item.month - 1).toLocaleString("default", {
            month: "short",
          }),
          total: item.total,
        }));
        setData(formattedData);
      }
    });
  };

  useEffect(() => {
    fetchMonthlyEngagements();
  }, []);

  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";

    // Add report title
    csvContent += "Monthly Contact Engagement Report (Year 2025)\n\n";

    // Add CSV headers
    csvContent += "Month,Total\n";

    // Data array (make sure `data` is defined before this function runs)
    data.forEach((row) => {
      csvContent += `${row.month},${row.total}\n`;
    });

    // Convert to downloadable CSV file
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "contact_engagement_2025.csv");

    // Append link, trigger click, then remove the link
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

        // Add header image first
        pdf.addImage(headerImg, "PNG", 30, 10, 140, 40);

        // Add title
        pdf.setFontSize(16);
        pdf.text("Contact Status Distribution", 15, 60);

        // Add chart image below title
        pdf.addImage(imgData, "PNG", 15, 60, 180, 100);

        // Save the PDF
        pdf.save("Contacts_Engagement.pdf");
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
      <h2 className="text-lg font-semibold mb-4">Monthly Contact Engagement</h2>
      <div ref={chartRef} className=" p-6  w-full flex justify-center">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis tickFormatter={(value) => `${value}`} stroke="#666" />
            <Tooltip
              contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px" }}
              labelFormatter={(label) => `Engagements in ${label}`}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="url(#colorEngagement)"
              strokeWidth={3}
              dot={{ stroke: "#8884d8", strokeWidth: 3, r: 5 }}
              activeDot={{ r: 8 }}
              isAnimationActive={true}
            />
            <defs>
              <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8884d8" stopOpacity={1} />
                <stop offset="100%" stopColor="#8884d8" stopOpacity={0.3} />
              </linearGradient>
            </defs>
          </LineChart>
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

export default MonthlyEngagementChart;
