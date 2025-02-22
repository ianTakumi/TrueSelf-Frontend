import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { CircularProgress, Button, Box } from "@mui/material";
import { notifyError } from "../../../utils/helpers";
import AxiosInstance from "../../../utils/AxiosInstance";
import ContactModal from "../../components/admin/modals/Contact.modal";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [contactToEdit, setContactToEdit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const response = await AxiosInstance.get("/contacts");
      if (response.status === 200) {
        setContacts(response.data.data);
      }
    } catch (error) {
      notifyError("Failed to fetch contacts");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const openEditModal = (contact) => {
    setContactToEdit(contact);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setContactToEdit(null);
  };

  const exportToPDF = async () => {
    const doc = new jsPDF();

    // Load the image
    const headerImage = "/logo/tupLogo.png";

    // Fetch and convert image to base64
    const imgData = await fetch(headerImage)
      .then((res) => res.blob())
      .then((blob) => URL.createObjectURL(blob));

    doc.addImage(imgData, "PNG", 20, 10, 170, 30);

    // Move table down after the image
    doc.autoTable({
      startY: 50, // Start below the image
      head: [["No.", "Name", "Email", "Phone", "Subject", "Message", "Status"]],
      body: contacts.map((contact, index) => [
        index + 1,
        contact.name,
        contact.email,
        contact.phone,
        contact.subject,
        contact.message,
        contact.status.charAt(0).toUpperCase() + contact.status.slice(1),
      ]),
    });

    doc.save(`contacts_list_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Contacts");

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
      [""], // Empty row for spacing
      ["No.", "Name", "Email", "Phone", "Subject", "Message", "Status"], // Column headers
    ];

    header.forEach((row, index) => {
      worksheet.addRow(row);
      worksheet.getRow(index + 1).font = { bold: true };
    });

    // Add data rows
    contacts.forEach((contact, index) => {
      worksheet.addRow([
        index + 1,
        contact.name,
        contact.email,
        contact.phone,
        contact.subject,
        contact.message,
        contact.status.charAt(0).toUpperCase() + contact.status.slice(1),
      ]);
    });

    // Adjust column width for better readability
    worksheet.columns = [
      { width: 5 },
      { width: 20 },
      { width: 25 },
      { width: 15 },
      { width: 20 },
      { width: 40 },
      { width: 10 },
    ];

    // Generate and save the file
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer]),
      `contacts_list_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  const columns = [
    {
      name: "no",
      label: "No.",
      options: { customBodyRender: (_, tableMeta) => tableMeta.rowIndex + 1 },
    },
    { name: "name", label: "Name" },
    { name: "email", label: "Email" },
    { name: "phone", label: "Phone" },
    { name: "subject", label: "Subject" },
    { name: "message", label: "Message" },
    {
      name: "status",
      label: "Status",
      options: {
        customBodyRender: (value) =>
          value.charAt(0).toUpperCase() + value.slice(1),
      },
    },
    {
      name: "actions",
      label: "Actions",
      options: {
        print: false,
        download: false,
        customBodyRender: (_, tableMeta) => {
          const contact = contacts[tableMeta.rowIndex];
          return (
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
              }
              sx={{
                backgroundColor: "#E3EEFF",
                color: "#007BFF",
                textTransform: "none",
                fontWeight: "bold",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "#D0E0FF",
                },
              }}
              onClick={() => openEditModal(contact)}
            >
              Edit
            </Button>
          );
        },
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

      const fileName = `contacts_list_${new Date()
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
      <div className="flex justify-between">
        <h1 className="font-bold font-serif text-3xl">List of Contacts</h1>
        <p className="text-sm">
          <Link to="/admin">
            <span className="text-blue-500 hover:underline">Home</span> /
          </Link>
          <span className="text-gray-500"> Contacts</span>
        </p>
      </div>

      {isModalOpen && (
        <Box position="fixed" top="0" left="0" right="0" bottom="0" zIndex="50">
          <ContactModal
            contactToEdit={contactToEdit}
            isEditing={isEditing}
            onClose={closeModal}
            onContactCreated={fetchContacts}
          />
        </Box>
      )}

      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : (
          <>
            {/* PDF and Excel Export Buttons */}
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

            <MUIDataTable data={contacts} columns={columns} options={options} />
          </>
        )}
      </div>
    </div>
  );
};

export default Contacts;
