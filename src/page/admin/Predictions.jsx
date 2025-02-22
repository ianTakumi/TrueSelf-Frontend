import React, { useState, useEffect } from "react";
import { notifyError } from "../../../utils/helpers";
import AxiosInstance from "../../../utils/AxiosInstance";
import MUIDataTable from "mui-datatables";
import { CircularProgress, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import PredictionModal from "../../components/admin/modals/Prediction.modal";
import VisibilityIcon from "@mui/icons-material/Visibility";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

const Predictions = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isViewing, setIsViewing] = useState(false);
  const [predictionToView, setPredictionToView] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPredictions = async () => {
    try {
      const res = await AxiosInstance.get("/anxietyPredictions");
      const formattedData = res.data.data.map(({ userId, ...rest }) => ({
        ...rest, // Keep all other fields
        name: userId?.name || "N/A",
        id: userId?._id || "N/A",
      }));
      console.log(formattedData);
      setPredictions(formattedData);
      setLoading(false);
    } catch (error) {
      notifyError(error);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  const openViewModal = (prediction) => {
    setPredictionToView(prediction);
    setIsViewing(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsViewing(false);
    setPredictionToView(null);
  };

  const columns = [
    {
      name: "name",
      label: "Name of User",
    },
    {
      name: "severityScore",
      label: "Predicted Score",
      options: {
        customBodyRender: (value) => {
          return value !== undefined && value !== null
            ? Math.round(value)
            : "N/A"; // Rounds to the nearest integer
        },
      },
    },
    {
      name: "createdAt",
      label: "Created At",
      options: {
        customBodyRender: (value) => {
          const date = new Date(value);
          return `${date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })} ${date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}`;
        },
      },
    },
    {
      name: "actions",
      label: "Actions",
      options: {
        print: false,
        customBodyRender: (_, tableMeta) => {
          const rowData = predictions[tableMeta.rowIndex]; // Get the current row data
          return (
            <button
              onClick={() => openViewModal(rowData)}
              className="flex items-center gap-2 px-3 py-1 text-blue-600 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md transition duration-200"
              aria-label="View Details"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              View
            </button>
          );
        },
      },
    },
  ];

  const options = {
    filterType: "dropdown",
    responsive: "standard",
    selectableRows: "none",
    downloadOptions: {
      filename: `Predictions_Report_${new Date()
        .toISOString()
        .slice(0, 10)}.csv`,
      separator: ",",
    },
  };

  const exportToPDF = async () => {
    const doc = new jsPDF("landscape");
    console.log(predictions);
    // Load the image
    const headerImage = "/logo/tupLogo.png";

    try {
      const imgBlob = await fetch(headerImage).then((res) => res.blob());
      const imgData = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(imgBlob);
        reader.onloadend = () => resolve(reader.result);
      });

      doc.addImage(imgData, "PNG", 30, 10, 250, 50);
    } catch (error) {
      console.error("Error loading image:", error);
    }

    // Add a centered title
    doc.setFontSize(16); // Increase font size for the title
    doc.setTextColor(0, 0, 0); // Black text
    doc.text("Anxiety Test Results", doc.internal.pageSize.getWidth() / 2, 65, {
      align: "center",
    });
    // Table Headers
    const head = [
      [
        "No.",
        "User",
        "Score",
        "Age",
        "Sleep Hrs",
        "Caffeine(g/day)",
        "Alcohol/week",
        "Smokes?",
        "Stress (1-10)",
        "HR (bpm)",
        "BR (bpm)",
        "Diet (1-10)",
        "Occupation",
      ],
    ];

    // Table Data
    const body = predictions.map((prediction, index) => [
      index + 1,
      prediction.name,
      Math.round(prediction.severityScore),
      prediction.age,
      prediction.sleepHours,
      prediction.caffeineIntake,
      prediction.alcoholConsumption,
      prediction.smoking === 1 ? "Yes" : "No",
      prediction.stressLevel,
      prediction.heartRate,
      prediction.breathingRate,
      prediction.dietQuality,
      prediction.occupation,
    ]);

    // AutoTable Options
    doc.autoTable({
      startY: 70, // Push the table down after image
      head: head,
      body: body,
      styles: {
        fontSize: 10, // Increase font size for readability
        cellPadding: 3, // Better spacing
        overflow: "linebreak", // Ensure text wraps
      },
      headStyles: {
        fillColor: [0, 150, 136], // Custom color (Teal)
        textColor: 255,
        fontSize: 10,
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 12 }, // No.
        1: { cellWidth: 30 }, // User
        2: { cellWidth: 15 }, // Score
        3: { cellWidth: 15 }, // Age
        19: { cellWidth: 30 }, // Occupation
      },
      margin: { top: 40, left: 10, right: 10 }, // Proper alignment
      theme: "striped",
    });

    doc.save(`prediction_list_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const exportToExcel = async () => {
    console.log("Exporting to Excel");
    console.log(predictions);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Predictions");

    // Load and add image
    const headerImage = "/logo/tupLogo.png";
    const imageResponse = await fetch(headerImage);
    const imageBlob = await imageResponse.blob();
    const imageBuffer = await imageBlob.arrayBuffer();

    // Add image to workbook
    const imageId = workbook.addImage({
      buffer: imageBuffer,
      extension: "png",
    });

    worksheet.addImage(imageId, {
      tl: { col: 0, row: 0 },
      ext: { width: 900, height: 100 },
    });

    const header = [
      ["TECHNOLOGICAL OF THE UNIVERSITY OF THE PHILIPPINES - TAGUIG"],
      ["Electrical and Allied Department"],
      ["Manila Technician Institute Computer Society"],
      [""],
      [
        "No.",
        "Name of User",
        "Predicted Score",
        "Age",
        "Number of Sleep Hours",
        "Minutes of Physical Activity",
        "Number of Caffeine Intake Grams/Day",
        "Number of Alcohol Intake Units/Day",
        "Do you currently smoke?",
        "Do you have a family history of anxiety?",
        "On a scale of 1 to 10, how would you rate your current stress level?",
        "Typical heart rate during anxiety attack? (beats per minute)",
        "Breathing rate during anxiety attack? (Breaths per Minute - BPM)",
        "On a scale of 1 to 5, how severe is sweating during an anxiety attack?",
        "Do you experience dizziness during anxiety attacks?",
        "Are you taking any medication for anxiety?",
        "Therapy sessions per month? (Sessions/Month)",
        "Have you recently experienced any major life changes?",
        "On a scale of 1 to 10, how would you rate your overall diet quality?",
        "What is your occupation",
      ],
    ];

    header.forEach((row, index) => {
      worksheet.addRow(row);
      worksheet.getRow(index + 1).font = { bold: true };
      const addedRow = worksheet.getRow(index + 1);
      addedRow.font = { bold: true };
      addedRow.alignment = { horizontal: "center", vertical: "middle" };
    });

    predictions.forEach((prediction, index) => {
      const row = worksheet.addRow([
        index + 1,
        prediction.name,
        Math.round(prediction.severityScore),
        prediction.age,
        prediction.sleepHours,
        prediction.physicalActivity,
        prediction.caffeineIntake,
        prediction.alcoholConsumption,
        prediction.smoking,
        prediction.familyHistory,
        prediction.stressLevel,
        prediction.heartRate,
        prediction.breathingRate,
        prediction.sweatingLevel,
        prediction.dizziness,
        prediction.medication,
        prediction.therapySessions,
        prediction.recentMajorLifeEvent,
        prediction.dietQuality,
        prediction.occupation,
      ]);
      row.alignment = { horizontal: "center", vertical: "middle" };
    });

    // Adjust column widths for readability
    worksheet.columns = [
      { width: 5 }, // Index
      { width: 20 }, // Name
      { width: 15 }, // Severity Score
      { width: 10 }, // Age
      { width: 15 }, // Sleep Hours
      { width: 20 }, // Physical Activity
      { width: 15 }, // Caffeine Intake
      { width: 15 }, // Alcohol Intake
      { width: 12 }, // Smoking
      { width: 18 }, // Family History
      { width: 15 }, // Stress Level
      { width: 12 }, // Heart Rate
      { width: 12 }, // Breathing Rate
      { width: 12 }, // Sweating
      { width: 12 }, // Dizziness
      { width: 15 }, // Medication
      { width: 20 }, // Therapy Sessions
      { width: 25 }, // Recent Major Life Event
      { width: 18 }, // Diet Quality
      { width: 20 }, // Occupation
    ];

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer]),
      `prediction_list_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  const exportSingleRecordToPDF = async () => {
    if (!predictionToView) {
      notifyError("No prediction selected.");
      return;
    }

    const doc = new jsPDF();

    // Load the image
    const headerImage = "/logo/tupLogo.png";
    try {
      const imgBlob = await fetch(headerImage).then((res) => res.blob());
      const imgData = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(imgBlob);
        reader.onloadend = () => resolve(reader.result);
      });

      doc.addImage(imgData, "PNG", 10, 10, 200, 50);
    } catch (error) {
      console.error("Error loading image:", error);
    }

    // Title
    doc.setFontSize(16);
    doc.text(
      "Anxiety Test Prediction",
      doc.internal.pageSize.getWidth() / 2,
      60,
      {
        align: "center",
      }
    );

    // User Details
    const prediction = predictionToView;
    const data = [
      ["User's Name:", prediction.name || "N/A"],
      ["Predicted Score:", Math.round(prediction.severityScore)],
      ["Age:", prediction.age || "N/A"],
      ["Number of Sleep Hours:", prediction.sleepHours || "N/A"],
      [
        "Physical Activity (minutes/day):",
        prediction.physicalActivity || "N/A",
      ],
      ["Caffeine Intake (g/day):", prediction.caffeineIntake || "N/A"],
      ["Alcohol Intake (per week):", prediction.alcoholConsumption || "N/A"],
      ["Smokes:", prediction.smoking ? "Yes" : "No"],
      ["Family History of Anxiety:", prediction.familyHistory ? "Yes" : "No"],
      ["Stress Level (1-10):", prediction.stressLevel || "N/A"],
      ["Heart Rate (bpm):", prediction.heartRate || "N/A"],
      ["Breathing Rate (bpm):", prediction.breathingRate || "N/A"],
      ["Sweating Level (1-5):", prediction.sweatingLevel || "N/A"],
      ["Dizziness:", prediction.dizziness ? "Yes" : "No"],
      ["Medication:", prediction.medication ? "Yes" : "No"],
      ["Therapy Sessions (per month):", prediction.therapySessions || "N/A"],
      ["Recent Major Life Event:", prediction.recentMajorLifeEvent || "N/A"],
      ["Diet Quality (1-10):", prediction.dietQuality || "N/A"],
      ["Occupation:", prediction.occupation || "N/A"],
      [
        "Created At:",
        new Date(prediction.createdAt).toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      ],
    ];

    doc.autoTable({
      startY: 65,
      body: data,
      styles: { fontSize: 12, cellPadding: 3 },
      columnStyles: { 0: { fontStyle: "bold" } },
    });

    // Save PDF
    doc.save(
      `prediction_${prediction.name}_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`
    );
  };

  return (
    <div className="px-3 mt-8">
      <div className="flex justify-between mb-5">
        <h1 className="font-bold font-serif text-3xl">List of Predictions</h1>
        <p className="text-sm">
          <Link to="/admin">
            <span className="text-blue-500 hover:underline">Home</span> /
          </Link>
          <span className="text-gray-500"> Predictions</span>
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center mt-10">
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="mb-4 flex gap-3">
            <Button variant="outlined" color="error" onClick={exportToPDF}>
              Export PDF
            </Button>
            <Button variant="outlined" color="success" onClick={exportToExcel}>
              Export Excel
            </Button>
          </div>
          <MUIDataTable
            data={predictions}
            columns={columns}
            options={options}
          />
        </>
      )}

      {isModalOpen && (
        <Box position="fixed" top="0" left="0" right="0" bottom="0" zIndex="50">
          <PredictionModal
            predictionToView={predictionToView}
            isViewing={isViewing}
            onClose={closeModal}
            download={exportSingleRecordToPDF}
          />
        </Box>
      )}
    </div>
  );
};

export default Predictions;
