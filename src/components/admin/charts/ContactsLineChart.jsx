import { useEffect, useState, forwardRef } from "react";
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

const MonthlyEngagementChart = forwardRef((props, ref) => {
  const [data, setData] = useState([]);
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

  useEffect(() => {
    if (props.onDataUpdate) {
      props.onDataUpdate(data);
    }
  }, [data]);

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
      const input = ref.current;

      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        // Add header image (centered)
        const headerWidth = 140;
        const headerX = (pdf.internal.pageSize.width - headerWidth) / 2;
        pdf.addImage(headerImg, "PNG", headerX, 10, headerWidth, 40);

        // Title (centered)
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text(
          "Monthly Contact Status Analysis",
          pdf.internal.pageSize.width / 2,
          60,
          { align: "center" }
        );

        // Add chart image (centered & resized for proper fit)
        const chartWidth = 160;
        const chartHeight = 90;
        const chartX = (pdf.internal.pageSize.width - chartWidth) / 2;
        pdf.addImage(imgData, "PNG", chartX, 70, chartWidth, chartHeight);

        // Extracting data for analysis
        let totalContacts = 0;
        let maxMonth = "";
        let maxContacts = 0;
        let minMonth = "";
        let minContacts = Number.MAX_VALUE;

        data.forEach((entry) => {
          totalContacts += entry.total;
          if (entry.total > maxContacts) {
            maxContacts = entry.total;
            maxMonth = entry.name;
          }
          if (entry.total < minContacts) {
            minContacts = entry.total;
            minMonth = entry.name;
          }
        });

        // Calculate monthly trends
        const averageContacts = (totalContacts / data.length).toFixed(2);

        const marginX = 15;
        let cursorY = 170; // Starting point for text sections

        // Key Observations Section
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Key Observations", marginX, cursorY);

        pdf.setFontSize(12);
        pdf.setFont("helvetica", "normal");
        const keyObservations = `
  - The total number of recorded contacts is ${totalContacts}.
  - The highest engagement was observed in ${maxMonth} (${maxContacts} contacts).
  - The lowest engagement was in ${minMonth} (${minContacts} contacts).
  - The average number of contacts per month is ${averageContacts}.
        `;
        pdf.text(
          pdf.splitTextToSize(
            keyObservations,
            pdf.internal.pageSize.width - 2 * marginX
          ),
          marginX,
          cursorY + 8
        );

        cursorY += 35; // Move down for the next section

        // Overall Analysis and Interpretation Section
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Overall Analysis and Interpretation", marginX, cursorY);

        pdf.setFontSize(12);
        pdf.setFont("helvetica", "normal");
        const overallAnalysis = `
  The data indicates variations in contact engagement across different months, suggesting potential seasonal 
  trends or operational influences. The peak in ${maxMonth} may be linked to specific campaigns, product launches, 
  or external factors. Similarly, the drop in ${minMonth} highlights a period of lower engagement, which warrants 
  further investigation.
  
  The average monthly contact volume of ${averageContacts} serves as a benchmark for future performance assessments. 
  A consistent increase in engagement would indicate successful outreach strategies, while significant dips might 
  suggest the need for improved customer interaction efforts. Identifying factors that influence these trends can 
  enhance planning and strategy development.
        `;
        pdf.text(
          pdf.splitTextToSize(
            overallAnalysis,
            pdf.internal.pageSize.width - 2 * marginX
          ),
          marginX,
          cursorY + 8
        );

        // Save the PDF
        pdf.save("Contacts_Engagement_Report.pdf");
      });
    };
  };

  const handlePrint = () => {
    const input = ref.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const newWindow = window.open("", "_blank");

      if (!newWindow) {
        alert("Popup blocked! Please allow popups for this site.");
        return;
      }

      const headerImg = new Image();
      headerImg.src = "/logo/result.png";

      headerImg.onload = () => {
        const headerImgData = headerImg.src;

        // Extracting data for analysis
        let totalContacts = 0;
        let maxMonth = "";
        let maxContacts = 0;
        let minMonth = "";
        let minContacts = Number.MAX_VALUE;

        data.forEach((entry) => {
          totalContacts += entry.total;
          if (entry.total > maxContacts) {
            maxContacts = entry.total;
            maxMonth = entry.name;
          }
          if (entry.total < minContacts) {
            minContacts = entry.total;
            minMonth = entry.name;
          }
        });

        // Calculate monthly trends
        const averageContacts = (totalContacts / data.length).toFixed(2);

        // Key Observations
        const keyObservations = `
          <h3>Key Observations</h3>
          <ul style="text-align: left; max-width: 80%; margin: auto;">
            <li>Total number of recorded contacts: <b>${totalContacts}</b></li>
            <li>Highest engagement: <b>${maxMonth}</b> (${maxContacts} contacts)</li>
            <li>Lowest engagement: <b>${minMonth}</b> (${minContacts} contacts)</li>
            <li>Average contacts per month: <b>${averageContacts}</b></li>
          </ul>
        `;

        // Overall Analysis and Interpretation
        const overallAnalysis = `
          <h3>Overall Analysis and Interpretation</h3>
          <p style="text-align: justify; max-width: 80%; margin: auto;">
            The data suggests variations in contact engagement across different months, indicating potential seasonal 
            trends or operational influences. The peak in <b>${maxMonth}</b> may be attributed to campaigns, 
            product launches, or external factors. Conversely, the dip in <b>${minMonth}</b> signals a period of 
            lower engagement, which requires further investigation.
          </p>
          <p style="text-align: justify; max-width: 80%; margin: auto;">
            An average monthly contact volume of <b>${averageContacts}</b> sets a benchmark for future performance 
            assessments. Consistent increases in engagement indicate successful outreach strategies, while declines may 
            necessitate improvements in customer interaction efforts. Identifying the key drivers of these trends can 
            enhance planning and strategic decision-making.
          </p>
        `;

        newWindow.document.write(`
          <html>
            <head>
              <title>Print Chart</title>
              <style>
                body { font-family: Arial, sans-serif; text-align: center; margin: 20px; }
                img { max-width: 100%; }
                h2, h3 { color: #333; }
                ul { list-style-type: none; padding: 0; }
                li { padding: 5px 0; }
                p { line-height: 1.6; }
              </style>
            </head>
            <body>
              <img src="${headerImgData}" style="width: 600px; margin-bottom: 20px;" />
              <h2>Contact Status Distribution</h2>
              <img src="${imgData}" style="width: 100%;" />
              ${keyObservations}
              ${overallAnalysis}
              <script>
                window.onload = function() { 
                  setTimeout(() => {
                    window.print(); 
                    window.close();
                  }, 500);
                };
              </script>
            </body>
          </html>
        `);

        newWindow.document.close();
      };

      headerImg.onerror = () => {
        console.error("Header image failed to load.");
        newWindow.document.write(`
          <html>
            <head><title>Print Chart</title></head>
            <body style="text-align: center;">
              <h2>Contact Status Distribution</h2>
              <img src="${imgData}" style="width: 100%;" />
              ${keyObservations}
              ${overallAnalysis}
              <script>
                window.onload = function() { 
                  setTimeout(() => {
                    window.print(); 
                    window.close();
                  }, 500);
                };
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
      <h2 className="text-lg font-semibold mb-4">Monthly Contact Engagement</h2>
      <div ref={ref} className=" p-6  w-full flex justify-center">
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
});

export default MonthlyEngagementChart;
