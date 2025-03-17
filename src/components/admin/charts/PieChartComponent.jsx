import React, { useState, useEffect, forwardRef } from "react";
import AxiosInstance from "../../../../utils/AxiosInstance";
import { notifyError } from "../../../../utils/helpers";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const COLORS = ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"];

const PieChartComponent = forwardRef((props, ref) => {
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchData = async () => {
    await AxiosInstance.get("/anxietyPredictions/statsOccupation")
      .then((res) => {
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

  useEffect(() => {
    if (props.onDataUpdate) {
      props.onDataUpdate(data);
    }
  }, [data]);

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
      const input = ref.current;

      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        // **Header Image**
        pdf.addImage(headerImg, "PNG", 30, 10, 140, 40);

        // **Title**
        pdf.setFontSize(16);
        pdf.text("Occupational Breakdown of Test Takers", 15, 60);

        // **Chart Image**
        pdf.addImage(imgData, "PNG", 15, 65, 180, 90);

        // **Generate Insights**
        let yPosition = 160;
        pdf.setFontSize(12);
        pdf.text("Key Observations:", 15, yPosition);
        yPosition += 6;

        let totalTestTakers = 0;
        let totalSeverity = 0;
        let highestSeverityOccupation = "";
        let highestSeverity = 0;
        let lowestSeverityOccupation = "";
        let lowestSeverity = Infinity;

        data.forEach((entry) => {
          totalTestTakers += entry.count;
          totalSeverity += entry.avgSeverity * entry.count;

          // Track highest and lowest severity occupations
          if (entry.avgSeverity > highestSeverity) {
            highestSeverity = entry.avgSeverity;
            highestSeverityOccupation = entry.occupation;
          }
          if (entry.avgSeverity < lowestSeverity) {
            lowestSeverity = entry.avgSeverity;
            lowestSeverityOccupation = entry.occupation;
          }

          pdf.text(
            `• ${entry.occupation}: ${
              entry.count
            } test takers, Avg Severity: ${entry.avgSeverity.toFixed(2)}`,
            20,
            yPosition
          );
          yPosition += 6;
        });

        // **Overall Interpretation**
        const avgTotalSeverity = (totalSeverity / totalTestTakers).toFixed(2);
        yPosition += 10;
        pdf.setFont("helvetica", "bold");
        pdf.text("Overall Analysis & Interpretation:", 15, yPosition);
        pdf.setFont("helvetica", "normal");
        yPosition += 6;

        let interpretation = `The analysis reveals an average severity score of ${avgTotalSeverity}, indicating the general level of anxiety experienced across different occupations. `;

        interpretation += `Among the recorded occupations, individuals in the **${highestSeverityOccupation}** profession exhibited the highest average severity score (${highestSeverity.toFixed(
          2
        )}), suggesting that this group may be more susceptible to heightened stress or anxiety-related conditions. `;

        interpretation += `Conversely, the **${lowestSeverityOccupation}** group reported the lowest severity (${lowestSeverity.toFixed(
          2
        )}), which may indicate a relatively lower stress exposure or more effective coping mechanisms. `;

        interpretation += `\n\nThis data is critical in understanding how occupational factors influence mental well-being. Factors such as job responsibilities, work environment, and professional demands could contribute to these variations. A higher severity score may suggest increased exposure to work-related stressors, while a lower score could indicate better mental health resilience within that occupation. `;

        interpretation += `\n\nFurther investigation into the contributing factors—such as work-life balance, job security, and support systems—could provide deeper insights into how to mitigate occupational stress and improve overall well-being in high-risk professions.`;

        pdf.text(interpretation, 20, yPosition, { maxWidth: 170 });

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
    const input = ref.current;
    html2canvas(input, { scale: 1.5 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const newWindow = window.open("", "_blank");

      const headerImg = new Image();
      headerImg.src = "/logo/result.png";

      headerImg.onload = () => {
        const headerImgData = headerImg.src;

        // **Compute Insights**
        let totalTestTakers = 0;
        let totalSeverity = 0;
        let highestSeverityOccupation = "";
        let highestSeverity = 0;
        let lowestSeverityOccupation = "";
        let lowestSeverity = Infinity;

        data.forEach((entry) => {
          totalTestTakers += entry.count;
          totalSeverity += entry.avgSeverity * entry.count;

          if (entry.avgSeverity > highestSeverity) {
            highestSeverity = entry.avgSeverity;
            highestSeverityOccupation = entry.occupation;
          }
          if (entry.avgSeverity < lowestSeverity) {
            lowestSeverity = entry.avgSeverity;
            lowestSeverityOccupation = entry.occupation;
          }
        });

        const avgTotalSeverity = (totalSeverity / totalTestTakers).toFixed(2);

        // **Professional Interpretation**
        const interpretation = `
          <h3 style="margin: 10px 0;">Overall Analysis & Interpretation</h3>
          <p style="text-align: justify; font-size: 12px; max-width: 90%; margin: 0 auto;">
            The analysis reveals an average anxiety severity score of <b>${avgTotalSeverity}</b> across all occupations. 
            The highest severity was observed among <b>${highestSeverityOccupation}</b> professionals (<b>${highestSeverity.toFixed(
          2
        )}</b>), 
            indicating that individuals in this field might experience increased work-related stress. 
            In contrast, <b>${lowestSeverityOccupation}</b> professionals reported the lowest severity (<b>${lowestSeverity.toFixed(
          2
        )}</b>), 
            suggesting a relatively lower psychological burden.
          </p>
          <p style="text-align: justify; font-size: 12px; max-width: 90%; margin: 0 auto;">
            These insights highlight the significant role of occupational stress factors in mental well-being. 
            High-stress jobs may require targeted mental health support, while low-stress environments can serve as models 
            for fostering better work-life balance. Implementing appropriate interventions based on these findings could 
            help in enhancing workplace mental health strategies.
          </p>
        `;

        // **Write to the New Window**
        newWindow.document.write(`
          <html>
            <head>
              <title>Print Report</title>
              <style>
                body { font-family: Arial, sans-serif; text-align: center; margin: 0; padding: 10px; }
                img { display: block; margin: 0 auto; }
                h2 { font-size: 18px; margin: 10px 0; }
                p { margin: 5px 0; }
              </style>
            </head>
            <body>
              <img src="${headerImgData}" style="width: 300px; margin-bottom: 10px;" />
              <h2>Occupational Breakdown of Test Takers</h2>
              <img src="${imgData}" style="width: 80%; max-width: 600px;" />
              ${interpretation}
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
      <h2 className="text-xl font-semibold mb-4">Occupation Distribution</h2>

      <div ref={ref} className="p-6 w-full flex justify-center">
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
});

export default PieChartComponent;
