import React, { useState, useEffect } from "react";
import {
  notifyError,
  formatDate,
  formatDateTime,
} from "../../../utils/helpers";
import MUIDataTable from "mui-datatables";
import AxiosInstance from "../../../utils/AxiosInstance";
import {
  Button,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import CommunityModal from "../../components/admin/modals/CommunityModal";

const spaces = () => {
  const [spaces, setSpaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [communityToEdit, setCommunityToEdit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSpaces = async () => {
    try {
      await AxiosInstance.get("/spaces").then((response) => {
        if (response.status === 200) {
          setSpaces(response.data.data);
        }
      });
    } catch (error) {
      console.log(error);
      notifyError("Failed to fetch spaces");
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  const exportToPDF = async () => {
    const doc = new jsPDF();

    const headerImage = "/logo/tupLogo.png";

    try {
      const response = await fetch(headerImage);
      if (!response.ok) throw new Error("Failed to load image");

      const blob = await response.blob();
      const imgData = URL.createObjectURL(blob);

      // Add logo
      doc.addImage(imgData, "PNG", 20, 10, 170, 30);
      URL.revokeObjectURL(imgData); // Free up memory

      // Add centered heading
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      const pageWidth = doc.internal.pageSize.getWidth();
      const title = "List of Communities";
      const textWidth = doc.getTextWidth(title);
      const textX = (pageWidth - textWidth) / 2;
      doc.text(title, textX, 45);

      // Add table
      doc.autoTable({
        startY: 50,
        head: [
          [
            "No.",
            "Name",
            "Description",
            "Created By",
            "# of Members",
            "Status",
            "Created At",
            "Updated At",
          ],
        ],
        body: spaces.map((space, index) => [
          index + 1,
          space.name,
          space.description,
          space.createdBy.name,
          space.members.length,
          space.status,
          formatDate(space.createdAt),
          formatDate(space.updatedAt),
        ]),
      });

      // Save PDF
      doc.save(`community_list_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Spaces");
    const headerImage = "/logo/tupLogo.png";

    const imageResponse = await fetch(headerImage);
    const imageBlob = await imageResponse.blob();
    const imageBuffer = await imageBlob.arrayBuffer();

    // Add image to workbook
    const imageId = workbook.addImage({
      buffer: imageBuffer,
      extension: "png",
    });

    // Merge cells A1:H3 for the logo
    worksheet.mergeCells("A1:H3");
    worksheet.addImage(imageId, {
      tl: { col: 0, row: 0 },
      ext: { width: 900, height: 100 },
    });

    // Add headers and title
    const header = [
      ["TECHNOLOGICAL UNIVERSITY OF THE PHILIPPINES - TAGUIG"],
      ["Electrical and Allied Department"],
      ["Manila Technician Institute Computer Society"],
      [""], // Spacer
      ["LIST OF COMMUNITIES"], // Centered Title
      [""], // Another Spacer
      [
        "No.",
        "Name",
        "Description",
        "Created By",
        "# of Members",
        "Status",
        "Created At",
        "Updated At",
      ],
    ];

    header.forEach((row, index) => {
      const addedRow = worksheet.addRow(row);

      // Merge cells for header rows and title
      if (index < 5) {
        worksheet.mergeCells(`A${index + 4}:H${index + 4}`); // Merging A-H for headers and title
        addedRow.font = { bold: true, size: index === 4 ? 14 : 12 }; // Larger font for "LIST OF COMMUNITIES"
        addedRow.alignment = { horizontal: "center", vertical: "middle" };
      } else if (index === 6) {
        // Apply bold for table headers
        addedRow.font = { bold: true };
        addedRow.alignment = { horizontal: "center", vertical: "middle" };
      }
    });

    // Add data rows
    spaces.forEach((space, index) => {
      const dataRow = worksheet.addRow([
        index + 1,
        space.name,
        space.description,
        space.createdBy.name,
        space.members.length,
        space.status,
        formatDate(space.createdAt),
        formatDate(space.updatedAt),
      ]);

      // Center all cells in the current row
      dataRow.eachCell((cell) => {
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });
    });

    // Adjust column widths
    worksheet.columns = [
      { width: 5 },
      { width: 20 },
      { width: 25 },
      { width: 15 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 },
    ];

    // Export Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer]),
      `community_list_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  const columns = [
    {
      name: "no",
      label: "No.",
      options: { customBodyRender: (_, tableMeta) => tableMeta.rowIndex + 1 },
    },
    {
      name: "name",
      label: "Name",
    },
    {
      name: "description",
      label: "Description",
    },
    {
      name: "createdBy", // Use the parent object name
      label: "Created By",
      options: {
        customBodyRender: (value) => value?.name || "N/A",
      },
    },
    {
      name: "members",
      label: "# of Members",
      options: {
        customBodyRender: (value) => {
          return value ? value.length : 0;
        },
        setCellProps: () => ({ style: { textAlign: "center" } }),
      },
    },
    {
      name: "status",
      label: "Status",
    },

    {
      name: "createdAt",
      label: "Created At",
      options: {
        customBodyRender: (value) => formatDate(value),
      },
    },
    {
      name: "updatedAt",
      label: "Updated At",
      options: {
        customBodyRender: (value) => formatDate(value),
      },
    },
    {
      name: "profile.url",
      label: "Profile",
      options: {
        print: false,
        download: false,
        customBodyRender: (value, tableMeta) => {
          const communityName = tableMeta.rowData[1]; // Assuming "name" is the second column
          const firstLetter = communityName
            ? communityName.charAt(0).toUpperCase()
            : "?";

          return value ? (
            <img
              src={value}
              alt="Profile"
              style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            />
          ) : (
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                backgroundColor: "#1976d2",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              {firstLetter}
            </div>
          );
        },
        setCellProps: () => ({ style: { textAlign: "center" } }),
      },
    },
  ];

  const openModal = (community) => {
    setIsModalOpen(true);
    if (community) {
      setIsEditing(true);
      setSpaceToEdit(community);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setSpaceToEdit(null);
  };

  const options = {
    filterType: "checkbox",
    responsive: "standard",
    selectableRows: "none",
    download: true,
    print: true,
    rowsPerPage: 10,
    onDownload: (buildHead, buildBody, columns, data) => {
      const header = `"TECHNOLOGICAL OF THE UNIVERSITY OF THE PHILIPPINES - TAGUIG"\n"Electrical and Allied Department"\n"Manila Technician Institute Computer Society"\n\n`;

      const csvContent = header + buildHead(columns) + buildBody(data);

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);

      const fileName = `community_list_${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return false; // Prevent default MUIDataTable download
    },
  };
  return (
    <div className="px-3 mt-8">
      <div className="flex justify-between mb-3">
        <h1 className="font-bold font-serif" style={{ fontSize: "30px" }}>
          List of Communities
        </h1>
        <p style={{ fontSize: "13.5px" }}>
          <span className="text-blue-500 hover:underline">Home</span> /{" "}
          <span className="text-gray-500">Communities</span>
        </p>
      </div>

      {isModalOpen && (
        <CommunityModal
          fetchCommunities={fetchSpaces}
          onClose={closeModal}
          communityToEdit={communityToEdit}
          isEditing={isEditing}
        />
      )}
      <Button
        onClick={() => openModal()}
        variant="outlined"
        color="secondary"
        sx={{ fontSize: { xs: "0.75rem", sm: "1rem", marginBottom: "20px" } }}
      >
        Add Community
      </Button>
      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <CircularProgress color="secondary" size={50} />
          </div>
        ) : (
          <>
            <div className="mb-4 flex gap-3">
              <Button variant="outlined" color="error" onClick={exportToPDF}>
                Export PDF
              </Button>
              <Button
                variant="outlined"
                color="success"
                onClick={exportToExcel}
              >
                Export Excel
              </Button>
            </div>
            <MUIDataTable data={spaces} columns={columns} options={options} />
          </>
        )}
      </div>
    </div>
  );
};

export default spaces;
