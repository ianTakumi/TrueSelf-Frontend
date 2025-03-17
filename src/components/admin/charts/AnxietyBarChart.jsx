import React, { useState, useEffect, forwardRef } from "react";
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

const AnxietyBarChart = forwardRef((props, ref) => {
  const [anxietyData, setAnxietyData] = useState([]);
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

        if (props.onDataUpdate) {
          props.onDataUpdate(anxietyData);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAnxietyData();
  }, []);

  useEffect(() => {
    if (props.onDataUpdate) {
      props.onDataUpdate(anxietyData);
    }
  }, [anxietyData]);

  const exportToCSV = () => {
    const currentYear = new Date().getFullYear();

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `Anxiety Data per month (Year ${currentYear})\n\n`;
    csvContent += "Month,Mild Count,Severe Count\n";

    anxietyData.forEach((row) => {
      const { month, mild, severe } = row;
      csvContent += `${month},${mild},${severe}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `anxiety_data_${currentYear}.csv`);
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

        // Add header image
        pdf.addImage(headerImg, "PNG", 30, 10, 140, 40);

        // Title
        pdf.setFontSize(16);
        pdf.text("Anxiety Data per Month", 15, 60);

        // Add chart image
        pdf.addImage(imgData, "PNG", 15, 70, 180, 100);

        let yPosition = 180;

        let explanation = `This chart visualizes the monthly distribution of anxiety cases. `;
        explanation += `It categorizes cases into mild and severe levels based on contributing factors such as lifestyle, health, and stress levels.\n\n`;

        pdf.setFontSize(12);
        pdf.text(explanation, 15, yPosition, { maxWidth: 180 });
        yPosition += 15;

        // **Dynamic Data Insights**
        let insights = "Key observations from the data:\n";
        anxietyData.forEach((entry) => {
          insights += `- In ${entry.month}, there were ${entry.mild} mild cases and ${entry.severe} severe cases.\n`;
        });

        const totalMild = anxietyData.reduce(
          (sum, entry) => sum + entry.mild,
          0
        );
        const totalSevere = anxietyData.reduce(
          (sum, entry) => sum + entry.severe,
          0
        );

        insights += `\nOverall, there were ${totalMild} mild cases and ${totalSevere} severe cases recorded.\n\n`;

        pdf.text(insights, 15, yPosition, { maxWidth: 180 });
        yPosition += 25;

        // **Dynamic Interpretation**
        let interpretation = "Data Interpretation:\n";
        if (totalSevere > totalMild) {
          interpretation +=
            "The data indicates a higher occurrence of severe anxiety cases. ";
        } else {
          interpretation +=
            "The mild cases outnumber the severe ones, suggesting a manageable level of anxiety. ";
        }
        interpretation +=
          "Notably, fluctuations in anxiety levels across months could be linked to academic stress, work deadlines, or seasonal effects. Understanding these trends can aid in implementing targeted mental health support strategies.";

        pdf.text(interpretation, 15, yPosition, { maxWidth: 180 });

        // Save the PDF
        pdf.save("anxiety_data_per_month.pdf");
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

      headerImg.onload = () => {
        const headerImgData = headerImg.src;

        // **Dynamic Data Insights**
        let insights =
          "<h4>Key Observations:</h4><ul style='text-align: left; padding-left: 20px; font-size: 12px;'>";
        anxietyData.forEach((entry) => {
          insights += `<li>In ${entry.month}, there were <b>${entry.mild}</b> mild cases and <b>${entry.severe}</b> severe cases.</li>`;
        });
        insights += "</ul>";

        const totalMild = anxietyData.reduce(
          (sum, entry) => sum + entry.mild,
          0
        );
        const totalSevere = anxietyData.reduce(
          (sum, entry) => sum + entry.severe,
          0
        );

        insights += `<p style="font-size: 12px;"><strong>Overall: ${totalMild} mild cases, ${totalSevere} severe cases recorded.</strong></p>`;

        // **Dynamic Interpretation**
        let interpretation =
          "<h4>Interpretation:</h4><p style='font-size: 12px;'>";
        if (totalSevere > totalMild) {
          interpretation +=
            "The data shows a higher number of severe anxiety cases. ";
        } else {
          interpretation +=
            "Mild cases outnumber the severe ones, indicating a manageable level of anxiety. ";
        }
        interpretation +=
          "Fluctuations may be linked to academic stress, work deadlines, or seasonal effects. Understanding these trends can help in implementing better mental health support strategies.</p>";

        // **Generate the print document**
        newWindow.document.write(`
          <html>
            <head>
              <title>Print Chart</title>
            </head>
            <body style="text-align: center; font-family: Arial, sans-serif; padding: 10px; max-width: 800px; margin: auto;">
              <img src="${headerImgData}" style="width: 400px; margin-bottom: 10px;" />
              <h3 style="font-size: 16px;">Contact Status Distribution</h3>
              <img src="${imgData}" style="width: 90%; max-width: 500px; margin-bottom: 10px;" />
              ${insights}
              ${interpretation}
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
      <div ref={ref} className=" p-6  w-full flex justify-center">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={anxietyData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
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
});

export default AnxietyBarChart;
