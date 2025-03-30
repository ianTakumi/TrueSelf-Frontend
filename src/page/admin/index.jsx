import React, { useState, useEffect, useRef } from "react";
// import Map from "../../components/admin/Map";
import AxiosInstance from "../../../utils/AxiosInstance";
import AnxietyBarChart from "../../components/admin/charts/AnxietyBarChart";
import ContactEngagementChart from "../../components/admin/charts/ContactsLineChart";
import StackBarChart from "../../components/admin/charts/StackBarChart";
import SleepBarChart from "../../components/admin/charts/SleepBarChart";
import { AccountCircle } from "@mui/icons-material";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import { Link } from "react-router-dom";
import PieChartComponent from "../../components/admin/charts/PieChartComponent";
import ScatterPlotChart from "../../components/admin/charts/ScatterPlotChart";
import ContactPieChart from "../../components/admin/charts/ContactPieChart";
import { Button } from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import MoodDistribution from "../../components/admin/charts/MoodDistribution";
import MoodPerMonthLineChart from "../../components/admin/charts/MoodPerMonthLineChart";
import JournalLineChart from "../../components/admin/charts/JournalLineChart";
import JournalPieChart from "../../components/admin/charts/JournalPieChart";

const index = () => {
  const [userCount, setUserCount] = useState(0);
  const [spaceCount, setSpaceCount] = useState(0);
  const [anxietyTestCount, setAnxietyTestCount] = useState(0);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const anxietyChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const sleepChartRef = useRef(null);
  const scatterChartRef = useRef(null);
  const contactEngagementRef = useRef(null);
  const contactPieRef = useRef(null);
  const moodDistributionChartRef = useRef(null);

  const [receivedAnxietyChartData, setReceivedAnxietyChartData] = useState([]);
  const [receivedOccupationPieChartData, setReceivedOccupationPieChartData] =
    useState([]);
  const [receivedSleepChartData, setReceivedSleepChartData] = useState([]);
  const [receivedScatterPlotData, setReceivedScatterPlotData] = useState([]);
  const [receivedContactEngagementData, setReceivedContactEngagementData] =
    useState([]);
  const [receivedContactPieData, setReceivedContactPieData] = useState([]);
  const [receivedAnalysisScatterData, setReceivedAnalysisScatterData] =
    useState({});
  const [receivedMoodDistributionData, setReceivedMoodDistributionData] =
    useState([]);

  const handleAnxietyChartDataUpdate = (newData) => {
    setReceivedAnxietyChartData(newData);
  };

  const handleOccupationPieChartDataUpdate = (newData) => {
    setReceivedOccupationPieChartData(newData);
  };

  const handleSleepChartDataUpdate = (newData) => {
    setReceivedSleepChartData(newData);
  };

  const handleScatterPlotDataUpdate = (newData) => {
    setReceivedScatterPlotData(newData);
  };

  const handleContactEngagementDataUpdate = (newData) => {
    setReceivedContactEngagementData(newData);
  };

  const handleContactPieDataUpdate = (newData) => {
    setReceivedContactPieData(newData);
  };

  const handleAnalysisScatterDataUpdate = (newData) => {
    setReceivedAnalysisScatterData(newData);
  };

  const handleMoodDistributionDataUpdate = (newData) => {
    setReceivedMoodDistributionData(newData);
  };

  const downloadReports = async () => {
    const doc = new jsPDF("p", "mm", "a4");
    const headerImg = new Image();
    headerImg.src = "/logo/result.png";

    await new Promise((resolve) => {
      headerImg.onload = resolve;
    });

    const charts = [
      { ref: anxietyChartRef, title: "Monthly Anxiety Test Results" },
      { ref: pieChartRef, title: "Occupational Breakdown of Test Takers" },
      { ref: sleepChartRef, title: "Anxiety Severity by Sleep Hours" },
      {
        ref: scatterChartRef,
        title: "Diet Quality vs Stress Level Scatter Chart",
      },
      { ref: contactEngagementRef, title: "Monthly Contact Engagement" },
      { ref: contactPieRef, title: "Contact Status Distribution" },
    ];

    // Get page width
    const pageWidth = doc.internal.pageSize.getWidth();

    // Add header image and university title on the first page
    doc.addImage(headerImg, "PNG", (pageWidth - 140) / 2, 10, 140, 40); // Centered header image
    doc.setFontSize(16);
    doc.text("Analysis Report", pageWidth / 2, 60, { align: "center" });

    for (let i = 0; i < charts.length; i++) {
      const { ref, title } = charts[i];

      if (ref?.current) {
        const canvas = await html2canvas(ref.current, {
          scale: 2,
          useCORS: true,
        });
        const imgData = canvas.toDataURL("image/png");

        if (i > 0) doc.addPage();

        const textWidth = doc.getTextWidth(title);
        const titleX = (pageWidth - textWidth) / 2;

        let titleY = 20;
        let imageY = 30;
        if (title === "Monthly Anxiety Test Results") {
          titleY = 80;
          imageY = titleY + 10;
        }

        doc.setFontSize(14);
        doc.text(title, titleX, titleY);
        doc.addImage(imgData, "PNG", (pageWidth - 180) / 2, imageY, 180, 100); // Centered image

        // Add description for "Monthly Contact Engagement" chart
        if (title === "Monthly Anxiety Test Results") {
          let yPos = imageY + 110; // Start position

          let explanation = `This chart visualizes the monthly distribution of anxiety cases. 
      It categorizes cases into mild and severe levels based on contributing factors such as lifestyle, health, and stress levels.`;

          doc.setFontSize(12);
          const wrappedExplanation = doc.splitTextToSize(explanation, 180);
          doc.text(wrappedExplanation, 20, yPos);
          yPos += doc.getTextDimensions(wrappedExplanation).h + 10; // Move to next section

          if (Array.isArray(receivedAnxietyChartData)) {
            let insights = "Key observations from the data:\n";
            receivedAnxietyChartData.forEach((data) => {
              insights += `- In ${data.month}, there were ${data.mild} mild cases and ${data.severe} severe cases.\n`;
            });

            const totalMild = receivedAnxietyChartData.reduce(
              (sum, data) => sum + data.mild,
              0
            );
            const totalSevere = receivedAnxietyChartData.reduce(
              (sum, data) => sum + data.severe,
              0
            );

            insights += `\nOverall, there were ${totalMild} mild cases and ${totalSevere} severe cases recorded.\n`;

            const wrappedInsights = doc.splitTextToSize(insights, 180);
            doc.text(wrappedInsights, 20, yPos);
            yPos += doc.getTextDimensions(wrappedInsights).h + 5; // Adjust spacing dynamically

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

            const wrappedInterpretation = doc.splitTextToSize(
              interpretation,
              180
            );
            doc.text(wrappedInterpretation, 20, yPos);
          }
        } else if (title === "Occupational Breakdown of Test Takers") {
          let yPosition = 140;
          doc.setFontSize(12);
          doc.text("Key Observations:", 15, yPosition);
          yPosition += 6;

          let totalTestTakers = 0;
          let totalSeverity = 0;
          let highestSeverityOccupation = "";
          let highestSeverity = 0;
          let lowestSeverityOccupation = "";
          let lowestSeverity = Infinity;

          receivedOccupationPieChartData.forEach((entry) => {
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

            doc.text(
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
          doc.setFont("helvetica", "bold");
          doc.text("Overall Analysis & Interpretation:", 15, yPosition);
          doc.setFont("helvetica", "normal");
          yPosition += 10;

          let interpretation = `The analysis reveals an average severity score of ${avgTotalSeverity}, indicating the general level of anxiety experienced across different occupations. `;

          interpretation += `Among the recorded occupations, individuals in the **${highestSeverityOccupation}** profession exhibited the highest average severity score (${highestSeverity.toFixed(
            2
          )}), suggesting that this group may be more susceptible to heightened stress or anxiety-related conditions. `;

          interpretation += `Conversely, the **${lowestSeverityOccupation}** group reported the lowest severity (${lowestSeverity.toFixed(
            2
          )}), which may indicate a relatively lower stress exposure or more effective coping mechanisms. `;

          interpretation += `\n\nThis data is critical in understanding how occupational factors influence mental well-being. Factors such as job responsibilities, work environment, and professional demands could contribute to these variations. A higher severity score may suggest increased exposure to work-related stressors, while a lower score could indicate better mental health resilience within that occupation. `;

          interpretation += `\n\nFurther investigation into the contributing factors—such as work-life balance, job security, and support systems—could provide deeper insights into how to mitigate occupational stress and improve overall well-being in high-risk professions.`;

          doc.text(interpretation, 20, yPosition, { maxWidth: 170 });
        } else if (title === "Anxiety Severity by Sleep Hours") {
          const observations = [];
          let highestSeverity = null;
          let lowestSeverity = null;
          let mostUsers = null;

          if (!receivedSleepChartData || receivedSleepChartData.length === 0) {
            observations.push("No data available for this chart.");
          } else {
            highestSeverity = receivedSleepChartData.reduce((max, item) =>
              parseFloat(item.avgSeverity) > parseFloat(max.avgSeverity)
                ? item
                : max
            );

            lowestSeverity = receivedSleepChartData.reduce((min, item) =>
              parseFloat(item.avgSeverity) < parseFloat(min.avgSeverity)
                ? item
                : min
            );

            mostUsers = receivedSleepChartData.reduce((max, item) =>
              item.count > max.count ? item : max
            );

            observations.push(
              `• The highest average anxiety severity (${highestSeverity.avgSeverity}) was observed in individuals with ${highestSeverity.sleepRange} hours of sleep.`,
              `• The lowest average anxiety severity (${lowestSeverity.avgSeverity}) was recorded in the ${lowestSeverity.sleepRange} sleep range.`,
              `• The most users (${mostUsers.count}) fall within the ${mostUsers.sleepRange} sleep range.`,
              `• Individuals sleeping between 6-8 hours had an average severity of ${
                receivedSleepChartData.find((item) => item.sleepRange === "6-8")
                  ?.avgSeverity || "N/A"
              }, suggesting moderate anxiety levels.`,
              `• Longer sleep duration (9+ hours) does not necessarily mean lower anxiety, as their severity score is ${
                receivedSleepChartData.find((item) => item.sleepRange === "9+")
                  ?.avgSeverity || "N/A"
              }.`
            );
          }
          const analysis = `
          Based on the data, sleep duration appears to impact anxiety severity. 
          Individuals with extremely short sleep durations (1-2 hours) show signs of mild anxiety, while those with 6-8 hours of sleep exhibit moderate anxiety.
          Interestingly, those sleeping for 9+ hours still report significant anxiety levels, suggesting other influencing factors such as stress, lifestyle, or pre-existing mental health conditions.
            `;

          doc.setFontSize(14);
          doc.text("Key Observations:", 15, 170);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(12);
          let yPosition = 180;
          observations.forEach((obs) => {
            const wrappedText = doc.splitTextToSize(obs, 180); // Ensures text wraps within the margin
            doc.text(wrappedText, 15, yPosition);
            yPosition += wrappedText.length * 6; // Adjusts spacing based on wrapped text
          });

          doc.setFont("helvetica", "bold");
          doc.setFontSize(14);
          doc.text("Overall Analysis & Interpretation:", 15, yPosition + 10);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(12);
          const analysisLines = doc.splitTextToSize(analysis, 180);
          doc.text(analysisLines, 15, yPosition + 20);
        } else if (title === "Diet Quality vs Stress Level Scatter Chart") {
          // Key Observations & Analysis
          doc.setFontSize(14);
          doc.text("Key Observations & Analysis", 15, 150);

          doc.setFontSize(12);
          doc.text(
            `Total Entries: ${receivedAnalysisScatterData.totalEntries}`,
            15,
            160
          );
          doc.text(
            `Average Diet Quality: ${receivedAnalysisScatterData.avgDietQuality}`,
            15,
            170
          );
          doc.text(
            `Average Stress Level: ${receivedAnalysisScatterData.avgStressLevel}`,
            15,
            180
          );
          doc.text(
            `Correlation: ${receivedAnalysisScatterData.correlation}`,
            15,
            190
          );

          // Generate dynamic insights
          const correlation = parseFloat(
            receivedAnalysisScatterData.correlation
          );
          let insights = [
            `General Insight: ${receivedAnalysisScatterData.insights}`,
          ];

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
          const stressHigh = receivedScatterPlotData.filter(
            (p) => p.y > 7
          ).length;
          const dietLow = receivedScatterPlotData.filter((p) => p.x < 4).length;

          if (stressHigh > receivedAnalysisScatterData.totalEntries * 0.3) {
            insights.push(
              "A significant portion of individuals have high stress levels, suggesting external stressors beyond diet may be at play."
            );
          }
          if (dietLow > receivedAnalysisScatterData.totalEntries * 0.3) {
            insights.push(
              "Many individuals have poor diet quality, highlighting a need for better nutritional education and access to healthy food."
            );
          }

          insights.push(
            "Recommendations: Consider additional factors like sleep, exercise, and mental health interventions for a holistic approach to stress management."
          );

          // Add insights to PDF
          doc.setFontSize(12);
          doc.text("Insights & Interpretation:", 15, 200);

          const insightLines = doc.splitTextToSize(insights, 180);
          doc.text(insightLines, 15, 210);
        } else if (title === "Monthly Contact Engagement") {
          let totalContacts = 0;
          let maxMonth = "";
          let maxContacts = 0;
          let minMonth = "";
          let minContacts = Number.MAX_VALUE;

          receivedContactEngagementData.forEach((entry) => {
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
          const averageContacts = (
            totalContacts / receivedContactEngagementData.length
          ).toFixed(2);
          const marginX = 15;
          let cursorY = 170;

          // Key Observations Section
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.text("Key Observations", marginX, cursorY);
          doc.setFontSize(12);
          doc.setFont("helvetica", "normal");
          const keyObservations = `
    - The total number of recorded contacts is ${totalContacts}.
    - The highest engagement was observed in ${maxMonth} (${maxContacts} contacts).
    - The lowest engagement was in ${minMonth} (${minContacts} contacts).
    - The average number of contacts per month is ${averageContacts}.
          `;
          doc.text(
            doc.splitTextToSize(
              keyObservations,
              doc.internal.pageSize.width - 2 * marginX
            ),
            marginX,
            cursorY + 8
          );

          cursorY += 35;
          // Overall Analysis and Interpretation Section
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.text("Overall Analysis and Interpretation", marginX, cursorY);

          doc.setFontSize(12);
          doc.setFont("helvetica", "normal");
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

          doc.text(
            doc.splitTextToSize(
              overallAnalysis,
              doc.internal.pageSize.width - 2 * marginX
            ),
            marginX,
            cursorY + 8
          );
        } else if (title === "Contact Status Distribution") {
          // Data Analysis
          let totalContacts = 0;
          let pendingCount = 0;
          let resolvedCount = 0;

          receivedContactPieData.forEach((entry) => {
            totalContacts += entry.value;
            if (entry.name === "Pending") pendingCount = entry.value;
            if (entry.name === "Resolved") resolvedCount = entry.value;
          });

          let pendingPercentage = (
            (pendingCount / totalContacts) *
            100
          ).toFixed(2);
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
          doc.setFontSize(12);
          doc.text("Analysis & Interpretation:", 15, yOffset);
          doc.setFontSize(10);

          let lines = doc.splitTextToSize(analysisText, 180);
          lines.forEach((line, index) => {
            doc.text(line, 15, yOffset + 6 + index * 6);
          });
        }
      }
    }

    // Save file with timestamp
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "_");
    doc.save(`Reports_${timestamp}.pdf`);
  };

  const fetchUserCount = async () => {
    try {
      await AxiosInstance.get("/users/count").then((response) => {
        if (response.status === 200) {
          setUserCount(response.data.count);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSpaceCount = async () => {
    try {
      await AxiosInstance.get("/spaces/count").then((response) => {
        if (response.status === 200) {
          setSpaceCount(response.data.count);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAnxietyTestCount = async () => {
    try {
      await AxiosInstance.get("/anxietyPredictions/count").then((response) => {
        if (response.status === 200) {
          setAnxietyTestCount(response.data.count);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserCount();
    fetchSpaceCount();
    fetchAnxietyTestCount();
  }, []);

  return (
    <div>
      <div>
        <div className="flex gap-4 mt-4">
          {/* Users Card */}
          <div className="flex-1 min-w-[200px] p-6 text-center bg-gradient-to-r from-[#FED0C5] to-[#8B47B5] rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105">
            <div className="relative">
              <AccountCircle className="text-5xl text-white mb-4" />
            </div>
            <h6 className="text-xl font-semibold text-white">Users</h6>

            {/* Flex container for number and button */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="text-3xl font-bold text-gray-900 bg-white px-4 py-2 rounded-lg shadow min-w-[70px] text-center">
                {userCount}
              </span>
              <Link to="/admin/users">
                <button className="px-4 py-2 bg-white text-[#8B47B5] font-semibold rounded-lg shadow min-w-[120px] text-center hover:bg-[#FFD700] transition-colors">
                  View Users
                </button>
              </Link>
            </div>
          </div>

          {/* Spaces Card */}
          <div className="flex-1 min-w-[200px] p-6 text-center bg-gradient-to-r from-[#5D69BE] to-[#C89FEB] rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105">
            <div className="relative">
              <PeopleIcon className="text-5xl text-white mb-4" />
            </div>
            <h6 className="text-xl font-semibold text-white">Spaces</h6>

            {/* Flex container for space count and button */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="text-3xl font-bold text-gray-900 bg-white px-4 py-2 rounded-lg shadow min-w-[80px] text-center">
                {spaceCount}
              </span>
              <Link to={"/admin/communities"}>
                <button className="px-4 py-2 bg-white text-[#5D69BE] font-semibold rounded-lg shadow min-w-[140px] text-center hover:bg-[#FFD700] transition-colors">
                  Explore Spaces
                </button>
              </Link>
            </div>
          </div>

          {/* AI Prediction Test Card */}
          <div className="flex-1 min-w-[200px] p-6 text-center bg-gradient-to-r from-[#014871] to-[#D7EDE2] rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105">
            <div className="relative">
              <EventIcon className="text-5xl text-white mb-4" />
            </div>
            <h6 className="text-xl font-semibold text-white">
              AI Prediction Test
            </h6>

            {/* Flex container for number and button */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="text-3xl font-bold text-gray-900 bg-white px-4 py-2 rounded-lg shadow min-w-[80px] text-center">
                {anxietyTestCount}
              </span>
              <Link to="/admin/predictions">
                <button className="px-4 py-2 bg-white text-[#014871] font-semibold rounded-lg shadow min-w-[140px] text-center hover:bg-[#FFD700] transition-colors">
                  View Results
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Charts container */}
      <div className="mt-10 space-y-6">
        {/* Section Header */}
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Anxiety Prediction Section
        </h2>
        <div className="flex justify-end mt-10">
          <Button
            variant="outlined"
            color="secondary"
            onClick={downloadReports}
          >
            Download Reports
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <AnxietyBarChart
              ref={anxietyChartRef}
              onDataUpdate={handleAnxietyChartDataUpdate}
            />
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <PieChartComponent
              ref={pieChartRef}
              onDataUpdate={handleOccupationPieChartDataUpdate}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <SleepBarChart
              ref={sleepChartRef}
              onDataUpdate={handleSleepChartDataUpdate}
            />
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <ScatterPlotChart
              ref={scatterChartRef}
              onDataUpdate={handleScatterPlotDataUpdate}
              onAnalysisUpdate={handleAnalysisScatterDataUpdate}
            />
          </div>
        </div>
      </div>

      <div className="mt-10 mb-24 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Contacts Section
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <ContactEngagementChart
              ref={contactEngagementRef}
              onDataUpdate={handleContactEngagementDataUpdate}
            />
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <ContactPieChart
              ref={contactPieRef}
              onDataUpdate={handleContactPieDataUpdate}
            />
          </div>
        </div>
      </div>

      <div className="mt-10 mb-24 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Mood Section
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <MoodDistribution
              ref={moodDistributionChartRef}
              onDataUpdate={handleMoodDistributionDataUpdate}
            />
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <MoodPerMonthLineChart />
          </div>
        </div>
      </div>

      {/* Journal section */}
      <div className="mt-10 mb-24 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Journal Section
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <JournalLineChart />
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <JournalPieChart />
          </div>
        </div>
      </div>
      {/* <div className="flex-1 bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Users Mood Distribution per Week
        </h3>
        <StackBarChart />
      </div> */}
    </div>
  );
};

export default index;
