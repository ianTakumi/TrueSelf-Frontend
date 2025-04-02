import React, { useState, useEffect } from "react";
import AxiosInstance from "../../../utils/AxiosInstance";
import { notifyError } from "../../../utils/helpers";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import "./datatable.css";
import {
  CircularProgress,
  Button,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import MUIDataTable from "mui-datatables";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ReportViewModal from "../../components/admin/modals/ReportViewModal";
import ReportEditModal from "../../components/admin/modals/ReportEditModal";
const Reports = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [reportToEdit, setReportToEdit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  const fetchReports = async () => {
    setIsLoading(true);
    await AxiosInstance.get("/reports")
      .then((res) => {
        setReports(res.data.data);
        console.log(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        notifyError("Failed to fetch reports");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center flex-col items-center h-screen">
        <CircularProgress size={24} />
        <h1 className="font-bold text-xl mt-2">Loading...</h1>
      </div>
    );
  }

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reports");

    try {
      // Load and Add Logo Image
      const headerImage = "/logo/tupLogo.png";
      const imageResponse = await fetch(headerImage);

      if (!imageResponse.ok) throw new Error("Failed to load image");

      const imageBlob = await imageResponse.blob();
      const imageBuffer = await imageBlob.arrayBuffer();

      const imageId = workbook.addImage({
        buffer: imageBuffer,
        extension: "png",
      });

      worksheet.addImage(imageId, {
        tl: { col: 0, row: 0 },
        ext: { width: 900, height: 100 },
      });

      // Insert More Blank Rows to Push Headers Down
      for (let i = 0; i < 6; i++) {
        worksheet.addRow([]);
      }

      // Define the Header Row (Row 7)
      const headers = [
        "No.",
        "Report Type",
        "Reason",
        "Details",
        "Reported Item",
        "Reported By",
        "Status",
        "Reported At",
      ];

      const headerRow = worksheet.addRow(headers);

      // Apply Background Color Only to Header Cells
      headerRow.eachCell((cell, colNumber) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "800080" }, // Purple background
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });

      // Validate reports data
      if (!reports || reports.length === 0) {
        console.error("No reports available.");
        alert("No reports found!");
        return;
      }

      // Insert Data into Worksheet (Starting from Row 8)
      reports.forEach((report, index) => {
        const row = worksheet.addRow([
          index + 1,
          report.reportType || "N/A",
          report.reason || "N/A",
          report.details || "N/A",
          report.reportedItem?.title || "N/A",
          report.reporter?.name || "Unknown",
          report.status.charAt(0).toUpperCase() + report.status.slice(1),
          new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }).format(new Date(report.createdAt || Date.now())),
        ]);

        // Center align all cells in the row
        row.eachCell((cell) => {
          cell.alignment = { horizontal: "center", vertical: "middle" };
        });
      });

      // Auto-adjust column widths
      worksheet.columns.forEach((column, index) => {
        column.width = headers[index].length + 5;
      });

      // Save and Download the File
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `reports_list_${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating Excel:", error);
      alert("Failed to export Excel file.");
    }
  };

  const exportToPDF = async () => {
    const doc = new jsPDF({ orientation: "landscape" });

    const headerImage = "/logo/tupLogo.png";
    const response = await fetch(headerImage);
    if (!response.ok) throw new Error("Failed to load image");
    const blob = await response.blob();
    const imgData = URL.createObjectURL(blob);

    doc.addImage(imgData, "PNG", 60, 10, 170, 30);
    URL.revokeObjectURL(imgData);

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const pageWidth = doc.internal.pageSize.getWidth();
    const title = "List of Reports";
    const textWidth = doc.getTextWidth(title);
    const textX = (pageWidth - textWidth) / 2;
    doc.text(title, textX, 45);

    doc.autoTable({
      startY: 55,
      head: [
        [
          " ",
          "Report Type",
          "Reason",
          "Details",
          "Reported Item",
          "Reported By",
          "Status",
          "Reported At",
        ],
      ],
      body: reports.map((report, index) => [
        index + 1,
        report.reportType,
        report.reason,
        report.details,
        report.reportedItem?.title || "N/A",
        report.reporter?.name || "Unknown",
        report.status.charAt(0).toUpperCase() + report.status.slice(1),
        new Intl.DateTimeFormat("en-US", {
          month: "long",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(new Date(report.createdAt)),
      ]),

      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 40 },
        4: { cellWidth: 40 },
        5: { cellWidth: 40 },
        6: { cellWidth: 30 },
        7: { cellWidth: 50 },
      },
      theme: "grid",
      didParseCell: (data) => {
        if (data.row.section === "body") {
          data.cell.styles.fillColor = [255, 255, 255];
          data.cell.styles.textColor = [0, 0, 0];
        }
      },
      headStyles: {
        fillColor: [128, 0, 128],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
    });

    doc.save(`reports_list_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const columns = [
    {
      name: "no",
      label: "#",
      options: {
        customBodyRender: (value, tableMeta) => tableMeta.rowIndex + 1,
        setCellProps: () => ({
          style: { textAlign: "center" },
        }),
        setCellHeaderProps: () => ({
          style: { textAlign: "center" },
        }),
      },
    },
    {
      name: "reportType",
      label: "Report Type",
      options: {
        setCellProps: () => ({
          style: { textAlign: "center" },
        }),
        setCellHeaderProps: () => ({
          style: { textAlign: "center" },
        }),
      },
    },
    {
      name: "reason",
      label: "Reason",
      options: {
        setCellProps: () => ({
          style: { textAlign: "center" },
        }),
        setCellHeaderProps: () => ({
          style: { textAlign: "center" },
        }),
      },
    },
    {
      name: "details",
      label: "Details",
      options: {
        setCellProps: () => ({
          style: { textAlign: "center" },
        }),
        setCellHeaderProps: () => ({
          style: { textAlign: "center" },
        }),
      },
    },
    {
      name: "reportedItem",
      label: "Reported Item",
      options: {
        customBodyRender: (value) => (value?.title ? value.title : "N/A"),
        setCellProps: () => ({
          style: { textAlign: "center" },
        }),
        setCellHeaderProps: () => ({
          style: { textAlign: "center" },
        }),
      },
    },
    {
      name: "reporter",
      label: "Reported By",
      options: {
        customBodyRender: (value) => value?.name || "Unknown",
        setCellProps: () => ({
          style: { textAlign: "center" },
        }),
        setCellHeaderProps: () => ({
          style: { textAlign: "center" },
        }),
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        setCellProps: () => ({
          style: { textAlign: "center" },
        }),
        setCellHeaderProps: () => ({
          style: { textAlign: "center" },
        }),
      },
    },
    {
      name: "createdAt",
      label: "Created At",
      options: {
        customBodyRender: (value) => {
          return new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }).format(new Date(value));
        },
        setCellProps: () => ({
          style: { textAlign: "center" },
        }),
        setCellHeaderProps: () => ({
          style: { textAlign: "center" },
        }),
      },
    },
    {
      name: "actions",
      label: "Actions",
      options: {
        customBodyRender: (value, tableMeta) => {
          const report = reports[tableMeta.rowIndex];
          console.log(report);
          return (
            <div className="flex justify-center gap-2">
              <Button
                variant="outlined"
                disabled={report.status === "Resolved"}
                color="secondary"
                onClick={() => {
                  setReportToEdit(report);
                  setIsViewing(true);
                }}
              >
                View
              </Button>

              <Button
                variant="outlined"
                color="primary"
                disabled={report.status === "Resolved"}
                onClick={() => {
                  setReportToEdit(report);
                  setIsEditing(true);
                  setIsModalOpen(true);
                }}
              >
                Edit
              </Button>
            </div>
          );
        },
        setCellProps: () => ({
          style: { textAlign: "center" },
        }),
        setCellHeaderProps: () => ({
          style: { textAlign: "center" },
        }),
      },
    },
  ];

  const options = {
    filterType: "checkbox",
    responsive: "standard",
    selectableRows: "none",
    download: true,
    print: true,
    rowsPerPage: 10,
    onDownload: (buildHead, buildBody, columns, data) => {
      const header = `"TECHNOLOGICAL UNIVERSITY OF THE PHILIPPINES - TAGUIG"\n"Electrical and Allied Department"\n"Manila Technician Institute Computer Society"\n\n`;

      const formattedData = data
        .map((row) => {
          const rowData = [...row.data];

          const reportedItem =
            rowData[columns.findIndex((col) => col.name === "reportedItem")];
          const reporter =
            rowData[columns.findIndex((col) => col.name === "reporter")];

          // Format extracted values
          const reportedItemDetails = reportedItem
            ? `"Title: ${reportedItem.title || "N/A"}, Type: ${
                reportedItem.type || "N/A"
              }"`
            : `"N/A"`;

          const reporterDetails = reporter
            ? `"${reporter.name || "N/A"}"`
            : `"N/A"`;

          // Replace object fields with formatted values
          rowData[columns.findIndex((col) => col.name === "reportedItem")] =
            reportedItemDetails;
          rowData[columns.findIndex((col) => col.name === "reporter")] =
            reporterDetails;

          return rowData.join(",");
        })
        .join("\n");

      // Build final CSV content
      const csvContent = header + buildHead(columns) + "\n" + formattedData;

      // Create and trigger CSV download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", "report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return false;
    },
  };

  return (
    <div className="px-3 mt-8">
      <div className="flex justify-between">
        <h1 className="font-bold font-serif text-3xl">List of Reports</h1>
        <p className="text-sm">
          <Link to="/admin">
            <span className="text-blue-500 hover:underline">Home</span> /
          </Link>
          <span className="text-gray-500"> Reports</span>
        </p>
      </div>

      <div className="my-4 flex gap-3">
        <Button variant="outlined" color="error" onClick={exportToPDF}>
          Export PDF
        </Button>
        <Button variant="outlined" color="success" onClick={exportToExcel}>
          Export Excel
        </Button>
      </div>
      <div className="my-7">
        <MUIDataTable data={reports} columns={columns} options={options} />
      </div>
      {isEditing && isModalOpen && (
        <ReportEditModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsEditing(false);
            setIsModalOpen(false);
          }}
          report={reportToEdit}
          refresh={fetchReports}
        />
      )}

      {isViewing && (
        <ReportViewModal
          isOpen={isViewing}
          onClose={() => {
            setIsViewing(false);
          }}
          report={reportToEdit}
        />
      )}
    </div>
  );
};

export default Reports;
