import React, { useEffect, useState } from "react";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { Link } from "react-router-dom";
import { Tabs, Tab, Pagination, LinearProgress } from "@mui/material";
import AxiosInstance from "../../utils/AxiosInstance";
import { getRecommendations, getUser } from "../../utils/helpers";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Result = () => {
  const user = getUser();
  const [data, setData] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const severityScore = data?.severityScore || 0;
  const percentage = (severityScore / 10) * 100;
  const isSevere = severityScore > 5;

  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  const fetchAnxietyData = async () => {
    await AxiosInstance.get(
      `/anxietyPredictions/lastPrediction/${user._id}`
    ).then((res) => {
      setData(res.data.data);
      setRecommendations(getRecommendations(res.data.data));
    });
  };

  useEffect(() => {
    fetchAnxietyData();
  }, []);

  const currentDate = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const getStressColor = (value) => {
    if (value === 1) return "bg-green-500"; // Very Low (Green)
    if (value === 2) return "bg-blue-500"; // Low (Blue)
    if (value === 3) return "bg-yellow-500"; // Medium (Yellow)
    if (value === 4) return "bg-orange-500"; // High (Orange)
    if (value === 5) return "bg-red-500"; // Very High (Red)
    return "bg-red-500"; // Default (Unknown)
  };

  const newGetStressColor = (value) => {
    if (value >= 1 && value <= 2) return "bg-green-500"; // Very Low (Green)
    if (value >= 3 && value <= 4) return "bg-blue-500"; // Low (Blue)
    if (value >= 5 && value <= 6) return "bg-yellow-500"; // Medium (Yellow)
    if (value >= 7 && value <= 8) return "bg-orange-500"; // High (Orange)
    if (value >= 9 && value <= 10) return "bg-red-500"; // Very High (Red)
    return "bg-gray-500";
  };

  const getProgressColor = (value, min, max) => {
    console.log(value, min, max);

    const mid = min + (max - min) / 2;

    if (value < min) return "bg-yellow-500"; // Low
    if (value >= min && value < mid) return "bg-blue-500"; // Medium
    if (value >= mid && value < max) return "bg-green-500"; // Normal
    return "bg-red-500";
  };

  const getSleepColor = (sleepHours) => {
    if (sleepHours >= 7) return "bg-green-500";
    if (sleepHours >= 5) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const getActivityColor = (minutes) => {
    if (minutes >= 150) return "bg-green-500"; // Meets or exceeds recommendation
    if (minutes >= 90) return "bg-yellow-500"; // Moderate activity
    return "bg-red-500"; // Low activity
  };

  const getCaffeineColor = (mg) => {
    if (mg <= 400) return "bg-green-500"; // Safe limit
    if (mg <= 600) return "bg-yellow-500"; // Moderate risk
    return "bg-red-500"; // High risk
  };

  const getAlcoholColor = (drinks) => {
    if (drinks <= 7) return "bg-green-500"; // Within limit
    if (drinks <= 14) return "bg-yellow-500"; // Moderate risk
    return "bg-red-500"; // High risk
  };

  const groupedData = [
    {
      title: "Health Factors",
      items: [
        {
          label: "Heart Rate",
          value: `${data.heartRate} bpm`,
          progress: (data.heartRate / 120) * 100,
          color: getProgressColor(data.heartRate, 60, 100),
        },
        {
          label: "Breathing Rate",
          value: `${data.breathingRate} breaths/min`,
          progress: (Math.min(data.breathingRate, 20) / 20) * 100,
          color: getProgressColor(Math.min(data.breathingRate, 20), 12, 20),
        },
        {
          label: "Stress Level",
          value: `${data.stressLevel}/10`,
          progress: Math.min((data.stressLevel / 10) * 100, 100),
          color: newGetStressColor(data.stressLevel),
        },
        {
          label: "Sweating Level",
          value: data.sweatingLevel,
          progress: (data.sweatingLevel / 5) * 100,
          color: getStressColor(data.sweatingLevel, 1, 5),
        },
        {
          label: "Dizziness",
          value: data.dizziness ? (
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
              Yes
            </span>
          ) : (
            <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
              No
            </span>
          ),
        },

        {
          label: "Family History",
          value: data.familyHistory ? (
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
              Yes
            </span>
          ) : (
            <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
              No
            </span>
          ),
        },
        {
          label: "Medication",
          value: data.medication ? (
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
              Yes
            </span>
          ) : (
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
              No
            </span>
          ),
        },
        {
          label: "Therapy Sessions",
          value: `${data.therapySessions} sessions`,
        },
      ],
    },
    {
      title: "Lifestyle",
      items: [
        {
          label: "Sleep Hours",
          value: `${data.sleepHours} hrs`,
          progress: Math.min((data.sleepHours / 8) * 100, 100),
          color: getSleepColor(data.sleepHours),
        },
        {
          label: "Physical Activity",
          value: `${data.physicalActivity} minutes/week`,
          progress: (data.physicalActivity / 150) * 100,
          color: getActivityColor(data.physicalActivity),
        },
        {
          label: "Caffeine Intake",
          value: `${data.caffeineIntake} mg`,
          progress: Math.min((data.caffeineIntake / 400) * 100, 100), // Prevent overflow
          color: getCaffeineColor(data.caffeineIntake),
        },
        {
          label: "Alcohol Consumption",
          value: `${data.alcoholConsumption} drinks/week`,
          progress: Math.min((data.alcoholIntake / 7) * 100, 100), // Prevent overflow
          color: getAlcoholColor(data.alcoholIntake),
        },
        {
          label: "Smoking",
          value: data.smoking ? (
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
              Yes
            </span>
          ) : (
            <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
              No
            </span>
          ),
        },
        {
          label: "Diet Quality",
          value: `${data.dietQuality}/10`,
          progress: Math.min((data.dietQuality / 10) * 100, 100),
          color: newGetStressColor(data.dietQuality),
        },
      ],
    },
    {
      title: "Other factors",
      items: [
        { label: "Occupation", value: data.occupation },
        {
          label: "Recent Major Life Event",
          value: data.recentMajorLifeEvent ? (
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
              Yes
            </span>
          ) : (
            <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
              No
            </span>
          ),
        },
      ],
    },
  ];

  const paginatedItems = groupedData
    .flatMap((group) => group.items)
    .slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const downloadToPDF = async () => {
    const doc = new jsPDF();
    const columns = ["Factor", "Description", "Recommended Range"];
    const healthColumns = ["Health Indicator", "Value", "Recommendation"];
    const otherFactorsColumns = ["Factor", "Value", "Description"];

    const otherFactorRows = [
      [
        "Occupation",
        data.occupation,
        "Occupational stress can contribute to anxiety symptoms. It is essential to establish a healthy work-life balance, set boundaries, and practice stress management techniques to reduce work-related stress and prevent burnout.",
      ],
      [
        "Recent Major Life Event",
        data.recentMajorLifeEvent ? "Yes" : "No",
        "Major life events, such as job loss, divorce, relocation, or bereavement, can trigger or exacerbate anxiety symptoms. Seeking social support, professional counseling, or therapy can help individuals cope with the emotional impact of significant life changes.",
      ],
    ];

    const rows = [
      [
        "Caffeine Intake",
        `${data.caffeineIntake} mg`,
        `Up to 400 milligrams (mg) of caffeine a day appears to be safe for most healthy adults.  Keep in mind that the actual caffeine content in beverages varies widely, especially among energy drinks.`,
      ],
      [
        "Alcohol Consumption",
        `${data.alcoholConsumption} drinks/week`,
        "For those who consume alcohol, moderation is defined as up to two drinks per day for men and one drink per day for women, as recommended by health guidelines.",
      ],
      [
        "Sleep Duration",
        `${data.sleepHours} hours`,
        "Adequate sleep (7–9 hours per night) is essential for regulating mood and reducing stress, both of which play a crucial role in managing anxiety. Chronic sleep deprivation can heighten anxiety symptoms by increasing cortisol levels and impairing emotional resilience.",
      ],
      [
        "Physical Activity",
        `${data.physicalActivity} minutes/week`,
        "Engaging in at least 150 minutes of moderate-intensity or 75 minutes of vigorous-intensity physical activity per week has been shown to reduce anxiety by lowering stress hormones and promoting endorphin release. Regular exercise improves mood, enhances sleep quality, and strengthens the body's ability to cope with stressors.",
      ],

      [
        "Smoking",
        data.smoking ? "Yes" : "No",
        "Smoking has been linked to increased anxiety, as nicotine alters brain chemistry and can lead to dependence, withdrawal symptoms, and heightened stress levels. Research suggests that quitting smoking can significantly improve mood, reduce anxiety over time, and enhance overall mental well-being.",
      ],

      [
        "Diet Quality",
        `${data.dietQuality}/10`,
        "A balanced diet rich in whole foods, lean proteins, healthy fats, and essential nutrients supports brain function and helps regulate mood, reducing the risk of anxiety. Research shows that diets high in processed foods and sugar may contribute to increased stress and anxiety levels, while nutrient-dense foods promote emotional stability.",
      ],
    ];

    const healthRows = [
      [
        "Heart Rate",
        `${data.heartRate} bpm`,
        `A normal resting heart rate for adults ranges from **60 to 100 beats per minute (bpm)**, with lower rates often indicating better cardiovascular fitness. During anxiety or stress, the heart rate can temporarily rise to **100–160 bpm** due to the body's fight-or-flight response. Consistently elevated heart rates may be linked to chronic anxiety and stress-related health issues.`,
      ],
      [
        "Breathing Rate",
        `${data.breathingRate} breaths/min`,
        `The normal respiratory rate for adults is **12–20 breaths per minute (bpm)** at rest. Breathing rates can increase during anxiety or panic attacks, leading to hyperventilation, dizziness, and chest tightness. Slow, deep breathing techniques can help regulate breathing patterns, reduce anxiety symptoms, and promote relaxation.`,
      ],
      [
        "Stress Level",
        `${data.stressLevel}/10`,
        `Stress levels can vary based on individual experiences, coping mechanisms, and environmental factors. Chronic stress and high stress levels can contribute to anxiety disorders, depression, and other health conditions. Effective stress management techniques include mindfulness, relaxation exercises, physical activity, and social support.`,
      ],
      [
        "Sweating Level",
        data.sweatingLevel,
        "Excessive sweating can be triggered by anxiety, stress, hormonal imbalances, or medical conditions. While sweating is a normal bodily response to regulate temperature, profuse sweating unrelated to physical exertion may indicate an underlying health issue or anxiety disorder.",
      ],
      [
        "Dizziness",
        data.dizziness ? "Yes" : "No",
        "Dizziness can result from various factors, including anxiety, dehydration, low blood sugar, inner ear problems, or medication side effects. Persistent or recurrent dizziness should be evaluated by a healthcare professional to determine the underlying cause and appropriate treatment.",
      ],
      [
        "Family History",
        data.familyHistory ? "Yes" : "No",
        "A family history of anxiety or mental health disorders can increase an individual's risk of developing similar conditions due to genetic and environmental factors. Understanding family medical history can help identify potential risk factors and guide preventive measures and treatment options.",
      ],
      [
        "Medication",
        data.medication ? "Yes" : "No",
        "Medication can be prescribed to manage anxiety symptoms, particularly in cases of severe or persistent anxiety disorders. It is essential to follow your healthcare provider's recommendations regarding medication use, dosage, and potential side effects.",
      ],
      [
        "Therapy Sessions",
        `${data.therapySessions} sessions`,
        "Therapy sessions, such as cognitive-behavioral therapy (CBT), mindfulness-based stress reduction (MBSR), or exposure therapy, can help individuals develop coping strategies, improve emotional regulation, and address underlying issues contributing to anxiety. Regular therapy sessions provide a supportive environment for exploring thoughts, emotions, and behavioral patterns.",
      ],
    ];

    const severityText =
      data.severityScore > 5 ? "Severe Anxiety" : "Mild Anxiety";

    const heartRateText = `${data.heartRate} bpm (Normal: 60–100 bpm)`;
    const breathingRateText = `${data.breathingRate} breaths/min (Normal: 12–20 breaths/min)`;

    const headerImage = "/logo/result.png";
    // Fetch and convert image to base64
    const response = await fetch(headerImage);
    if (!response.ok) throw new Error("Failed to load image");

    const blob = await response.blob();
    const imgData = URL.createObjectURL(blob);

    // Add logo
    doc.addImage(imgData, "PNG", 20, 10, 170, 50);
    URL.revokeObjectURL(imgData);

    // Add centered heading
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const pageWidth = doc.internal.pageSize.getWidth();
    const title = "Anxiety Assestment Report";
    const textWidth = doc.getTextWidth(title);
    const textX = (pageWidth - textWidth) / 2;
    doc.text(title, textX, 70);

    // Add user details
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${user.name}`, 20, 80);
    doc.text(`Date of Assessment: ${currentDate}`, 20, 90);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("I. Overview", 20, 100);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const overviewText =
      "This report summarizes the findings of your recent anxiety assessment. " +
      "It includes a severity score, potential contributing factors, and tailored " +
      "recommendations to help you manage and reduce anxiety.";

    doc.text(doc.splitTextToSize(overviewText, 170), 20, 110); // Wrap text

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("II. Key Results", 20, 140);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Overall Anxiety Severity Score:", 20, 150);
    doc.setFont("helvetica", "normal");
    doc.text(
      ` ${Math.round(data.severityScore.toFixed(1))}/10 (${severityText})`,
      100,
      150
    );

    doc.setFont("helvetica", "bold");
    doc.text("Heart Rate:", 20, 160);

    doc.setFont("helvetica", "normal");
    doc.text(` ${heartRateText}`, 100, 160);

    doc.setFont("helvetica", "bold");
    doc.text("Breathing Rate:", 20, 170);
    doc.setFont("helvetica", "normal");
    doc.text(`${breathingRateText}`, 100, 170);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("III. Lifestyle Factors", 20, 190);
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 200,
      theme: "striped",
      styles: { fontSize: 10 },
    });

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("IV. Health Indicators", 20, 90);

    doc.autoTable({
      head: [healthColumns],
      body: healthRows,
      startY: 100,
      theme: "striped",
      styles: { fontSize: 10 },
    });

    // Set font and add heading
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");

    // Get the previous table's Y position safely
    const previousTableY = doc.autoTable.previous
      ? doc.autoTable.previous.finalY
      : 20;

    // Define the next Y position
    const nextY = previousTableY + 15;

    // Check if the table will fit on the current page
    const pageHeight = doc.internal.pageSize.height;
    const estimatedTableHeight = 50; // Approximate height of the table

    if (nextY + estimatedTableHeight > pageHeight) {
      doc.addPage(); // Add a new page if there's not enough space
      doc.text("V. Other Factors", 20, 20); // Reset Y position on the new page
      doc.autoTable({
        head: [otherFactorsColumns],
        body: otherFactorRows,
        startY: 30, // Start table below the heading
        theme: "striped",
        styles: { fontSize: 10 },
      });
    } else {
      // Render on the same page if there's enough space
      doc.text("V. Other Factors", 20, nextY);
      doc.autoTable({
        head: [otherFactorsColumns],
        body: otherFactorRows,
        startY: nextY + 10,
        theme: "striped",
        styles: { fontSize: 10 },
      });
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("VI. Detailed Recommendations", 20, 90);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    const lineHeight = 7;
    const maxWidth = 170;
    let yPos = 105; // Start position after heading

    recommendations.forEach((recommendation) => {
      const wrappedText = doc.splitTextToSize(`• ${recommendation}`, maxWidth);
      doc.text(wrappedText, 20, yPos);
      yPos += wrappedText.length * lineHeight; // Adjust Y position for next bullet
    });

    yPos += 15; // Space before disclaimer
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Disclaimer:", 20, yPos);

    doc.setFont("helvetica", "normal");
    const disclaimerText =
      "This report is based on research findings; however, consulting a qualified healthcare professional " +
      "is strongly recommended for accurate diagnosis and personalized medical advice. This information is for general awareness " +
      "and should not replace professional medical consultation.";

    const wrappedDisclaimer = doc.splitTextToSize(disclaimerText, maxWidth);
    doc.text(wrappedDisclaimer, 20, yPos + 5);
    // Save the PDF
    doc.save("Anxiety_Assessment_Report.pdf");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center px-4 md:px-10 lg:px-20 py-10">
      <div className="relative w-32 h-32 mb-6 lg:mb-0 lg:mr-20 ">
        <CircularProgressbar
          value={percentage}
          styles={buildStyles({
            pathColor: isSevere ? "#FF5733" : "#FFC107",
            trailColor: "#e0e0e0",
          })}
        />
        {/* Overlay MUI Icon */}
        <div className="absolute inset-0 flex items-center justify-center text-4xl">
          {isSevere ? (
            <SentimentVeryDissatisfiedIcon
              className="text-red-500"
              fontSize="large"
            />
          ) : (
            <SentimentSatisfiedIcon
              className="text-yellow-500"
              fontSize="large"
            />
          )}
        </div>

        <p
          className={`text-lg font-bold text-center mb-1 ${
            data.severityScore > 5 ? "text-red-500" : "text-yellow-500"
          }`}
        >
          {Math.round(data.severityScore)}/10
        </p>

        <p
          className={`text-lg font-semibold text-center ${
            isSevere ? "text-red-500" : "text-yellow-500"
          }`}
        >
          {isSevere ? "Severe Anxiety" : "Mild Anxiety"}
        </p>
      </div>

      {/* Card Section */}
      <div className="w-full max-w-3xl p-5 bg-white shadow-xl rounded-xl border border-gray-300 h-96">
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab label="Results" />
          <Tab label="Recommendations" />
        </Tabs>

        {/* Results Section */}
        {tabIndex === 0 && (
          <div>
            <h2 className="text-xl font-bold text-center mb-4">
              Assessment Result
            </h2>
            <h3 className="text-md font-bold text-gray-600 mb-2">
              {
                groupedData.find((group) =>
                  group.items.includes(paginatedItems[0])
                )?.title
              }
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {paginatedItems.map((item, index) => (
                <div key={index} className="text-gray-800">
                  <p>
                    <strong>{item.label}:</strong> {item.value}
                  </p>
                  {item.progress !== undefined && (
                    <div className="w-full bg-gray-300 rounded-md mt-1 h-2">
                      <div
                        className={`h-2 rounded-md ${item.color}`}
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              count={Math.ceil(
                groupedData.flatMap((g) => g.items).length / itemsPerPage
              )}
              page={page}
              onChange={handlePageChange}
              className="mt-4 flex justify-center"
            />
          </div>
        )}

        {/* Recommendations Section */}
        {tabIndex === 1 && (
          <div className="text-center mt-4">
            {recommendations.length > 0 ? (
              recommendations.map((rec, index) => (
                <div key={index} className="flex items-start mb-4">
                  <CheckCircleIcon
                    className="text-green-500 mt-1"
                    fontSize="small"
                  />
                  <span className="text-gray-700 ml-2 flex-1">{rec}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center italic">
                No recommendations available.
              </p>
            )}
          </div>
        )}

        {/* Buttons Section */}
        <div className="mt-4 flex flex-col sm:flex-row justify-between gap-4">
          <Link to="/test-anxiety" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 px-4 py-2 text-sm font-bold rounded-lg hover:bg-blue-600 hover:text-white flex items-center gap-1 justify-center">
              <RestartAltIcon className="w-4 h-4" /> Take Again
            </button>
          </Link>
          <button
            onClick={downloadToPDF}
            className="w-full sm:w-auto border-2 border-red-600 text-red-600 px-4 py-2 text-sm font-bold rounded-lg hover:bg-red-600 hover:text-white flex items-center gap-1 justify-center"
          >
            <PictureAsPdfIcon className="w-4 h-4" /> Download Result
          </button>

          <Link to="/recommend" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto border-2 border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-600 hover:text-white flex items-center gap-1 justify-center">
              <LocalHospitalIcon className="w-4 h-4" /> View Recommendations
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Result;
