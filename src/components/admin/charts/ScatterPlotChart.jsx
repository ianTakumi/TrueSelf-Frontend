import React, { useState, useEffect, useRef, forwardRef } from "react";
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

const ScatterPlotChart = forwardRef((props, ref) => {
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [analysis, setAnalysis] = useState({});

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

        if (response.status === 200 && response.data.analysis) {
          setAnalysis(response.data.analysis);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAnxietyData();
  }, []);

  useEffect(() => {
    if (props.onDataUpdate) {
      props.onDataUpdate(data);
    }

    if (props.onAnalysisUpdate) {
      props.onAnalysisUpdate(analysis);
    }
  }, [data]);

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
      const input = ref.current;

      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        // Add header image
        pdf.addImage(headerImg, "PNG", 30, 10, 140, 40);

        // Add title
        pdf.setFontSize(16);
        pdf.text(
          "Scatter Plot Analysis: Diet Quality vs. Stress Level",
          15,
          60
        );

        // Add scatter plot image
        pdf.addImage(imgData, "PNG", 15, 70, 180, 100);

        // Key Observations & Analysis
        pdf.setFontSize(14);
        pdf.text("Key Observations & Analysis", 15, 180);

        pdf.setFontSize(12);
        pdf.text(`Total Entries: ${analysis.totalEntries}`, 15, 190);
        pdf.text(`Average Diet Quality: ${analysis.avgDietQuality}`, 15, 200);
        pdf.text(`Average Stress Level: ${analysis.avgStressLevel}`, 15, 210);
        pdf.text(`Correlation: ${analysis.correlation}`, 15, 220);

        // Generate dynamic insights
        const correlation = parseFloat(analysis.correlation);
        let insights = [`General Insight: ${analysis.insights}`];

        if (correlation < -0.5) {
          insights.push(
            "There is a strong inverse relationship, suggesting that improving diet quality significantly reduces stress levels."
          );
        } else if (correlation < -0.1) {
          insights.push(
            "A weak inverse relationship exists, meaning diet quality may help reduce stress, but other factors likely play a larger role."
          );
        } else if (correlation > 0.1) {
          insights.push(
            "A weak positive relationship suggests that diet quality and stress levels might increase together, possibly due to other influencing factors."
          );
        } else {
          insights.push(
            "No significant correlation was found, indicating stress levels and diet quality are likely influenced by separate factors."
          );
        }

        // Identify clusters & trends
        const stressHigh = data.filter((p) => p.y > 7).length;
        const dietLow = data.filter((p) => p.x < 4).length;

        if (stressHigh > analysis.totalEntries * 0.3) {
          insights.push(
            "A significant portion of individuals have high stress levels, suggesting external stressors beyond diet may be at play."
          );
        }

        if (dietLow > analysis.totalEntries * 0.3) {
          insights.push(
            "Many individuals have poor diet quality, highlighting a need for better nutritional education and access to healthy food."
          );
        }

        insights.push(
          "Recommendations: Consider additional factors like sleep, exercise, and mental health interventions for a holistic approach to stress management."
        );

        // Add insights to PDF
        pdf.setFontSize(12);
        pdf.text("Insights & Interpretation:", 15, 230);

        const insightLines = pdf.splitTextToSize(insights, 180);
        pdf.text(insightLines, 15, 240);

        // Save PDF with timestamp
        const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "_");
        pdf.save(`Diet_Quality_vs_Stress_Level_${timestamp}.pdf`);
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

        // Generate insights dynamically
        const correlation = parseFloat(analysis.correlation);
        let insights = [
          `<strong>General Insight:</strong> ${analysis.insights}`,
        ];

        if (correlation < -0.5) {
          insights.push(
            "Strong inverse relationship: Higher diet quality significantly lowers stress."
          );
        } else if (correlation < -0.1) {
          insights.push(
            "Weak inverse relationship: Diet quality may help reduce stress, but other factors are significant."
          );
        } else if (correlation > 0.1) {
          insights.push(
            "Weak positive relationship: Other variables might be influencing both diet and stress."
          );
        } else {
          insights.push(
            "No strong correlation found; other factors likely influence stress and diet independently."
          );
        }

        insights.push(
          "Consider sleep, exercise, and mental health support for a holistic approach to stress reduction."
        );
        const insightsHTML = insights
          .map((insight) => `<p>${insight}</p>`)
          .join("");

        newWindow.document.write(`
          <html>
            <head>
              <title>Print Chart</title>
              <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
                h1 { font-size: 18px; margin-bottom: 10px; }
                h2 { font-size: 16px; margin-bottom: 8px; }
                p { font-size: 14px; margin: 5px 0; line-height: 1.4; }
                img { max-width: 500px; height: auto; margin-bottom: 10px; }
                .content { width: 100%; max-width: 700px; margin: auto; }
              </style>
            </head>
            <body>
              <div class="content">
                <img src="${headerImgData}" style="width: 500px;" />
                <h1>Scatter Plot Analysis: Diet Quality vs. Stress Level</h1>
                <img src="${imgData}" style="width: 100%;" />
                <h2>Key Observations & Analysis</h2>
                <p><strong>Total Entries:</strong> ${analysis.totalEntries}</p>
                <p><strong>Avg. Diet Quality:</strong> ${analysis.avgDietQuality}</p>
                <p><strong>Avg. Stress Level:</strong> ${analysis.avgStressLevel}</p>
                <p><strong>Correlation:</strong> ${analysis.correlation}</p>
                <h2>Insights & Interpretation</h2>
                ${insightsHTML}
              </div>
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

      <div ref={ref} className=" p-6  w-full flex justify-center">
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
});

export default ScatterPlotChart;
