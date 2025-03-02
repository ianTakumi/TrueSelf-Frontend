import React, { useState, useEffect } from "react";
import AxiosInstance from "../../../utils/AxiosInstance";
import { notifyError, formatDate } from "../../../utils/helpers";
import { Link } from "react-router-dom";
import { CircularProgress, Button } from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import MUIDataTable from "mui-datatables";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await AxiosInstance.get("/users");
      if (res.status === 200) {
        setUsers(res.data.data);
      }
    } catch (err) {
      notifyError("Error", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Get current page's data
  const paginatedUsers = users.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const exportToPDF = async () => {
    const doc = new jsPDF();

    // Load the image
    const headerImage = "/logo/tupLogo.png";

    const imgData = await fetch(headerImage)
      .then((res) => res.blob())
      .then((blob) => URL.createObjectURL(blob));

    doc.addImage(imgData, "PNG", 20, 10, 170, 30);

    doc.setFontSize(16); // Set font size
    doc.setFont("helvetica", "bold"); // Set font style
    doc.text("User List", doc.internal.pageSize.width / 2, 45, {
      align: "center",
    });

    // Generate the table
    doc.autoTable({
      startY: 50,
      head: [
        [
          "No.",
          "Name",
          "Date of Birth",
          "Gender Identity",
          "Email",
          "Phone",
          "Status",
          "Registered At",
        ],
      ],
      body: users.map((user, index) => [
        index + 1,
        user.name,
        formatDate(user.dob),
        user.genderIdentity,
        user.email,
        user.phoneNumber,
        user.status.charAt(0).toUpperCase() + user.status.slice(1),
        formatDate(user.createdAt),
      ]),
    });

    doc.save(`users_list_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");

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
        "Name",
        "Date of Birth",
        "Gender Identity",
        "Pronouns",
        "Email",
        "Phone",
        "Status",
        "Registered At",
      ],
    ];

    header.forEach((row, index) => {
      worksheet.addRow(row);
      worksheet.getRow(index + 1).font = { bold: true };
    });

    // Add data rows
    users.forEach((user, index) => {
      worksheet.addRow([
        index + 1,
        user.name,
        formatDate(user.dob),
        user.genderIdentity,
        user.pronouns,
        user.email,
        user.phoneNumber,
        user.status.charAt(0).toUpperCase() + user.status.slice(1),
        formatDate(user.createdAt),
      ]);
    });

    worksheet.columns = [
      { width: 5 },
      { width: 20 },
      { width: 25 },
      { width: 15 },
      { width: 20 },
      { width: 40 },
      { width: 40 },
      { width: 40 },
      { width: 40 },
    ];

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer]),
      `users_list_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  const columns = [
    {
      name: "no",
      label: "No.",
      options: { customBodyRender: (_, tableMeta) => tableMeta.rowIndex + 1 },
    },
    { name: "name", label: "Name" },
    {
      name: "dob",
      label: "Date of Birth",
      options: {
        customBodyRender: (value) => formatDate(value),
      },
    },
    { name: "genderIdentity", label: "Gender Identity" },

    { name: "email", label: "Email" },
    { name: "phoneNumber", label: "Phone" },
    {
      name: "status",
      label: "Status",
      options: {
        customBodyRender: (value) =>
          value.charAt(0).toUpperCase() + value.slice(1),
      },
    },
    {
      name: "createdAt",
      label: "Registered At",
      options: {
        customBodyRender: (value) => formatDate(value),
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
      const header = `"TECHNOLOGICAL OF THE UNIVERSITY OF THE PHILIPPINES - TAGUIG"\n"Electrical and Allied Department"\n"Manila Technician Institute Computer Society"\n\n`;

      const csvContent = header + buildHead(columns) + buildBody(data);
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);

      const fileName = `users_list_${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return false;
    },
  };

  return (
    <div className="px-3 mt-8">
      <div className="flex justify-between">
        <h1 className="font-bold font-serif" style={{ fontSize: "30px" }}>
          List of Users
        </h1>
        <p style={{ fontSize: "13.5px" }}>
          <Link to="/admin">
            <span className="text-blue-500 hover:underline">Home</span> /
          </Link>
          <span className="text-gray-500"> Users</span>
        </p>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <CircularProgress />
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

            <MUIDataTable data={users} columns={columns} options={options} />
          </>
        )}
      </div>
    </div>
  );
};

export default Users;
