import React, { useState, useEffect } from "react";
import AxiosInstance from "../../../utils/AxiosInstance";
import { notifyError } from "../../../utils/helpers";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import "./datatable.css";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [reportToEdit, setReportToEdit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchReports = async () => {
    await AxiosInstance.get("/reports")
      .then((res) => {
        setReports(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        notifyError("Failed to fetch reports");
      });
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="px-3 mt-8">
      <div className="flex justify-between">
        <h1 className="font-bold font-serif text-3xl">List of Reports</h1>
        <p className="text-sm">
          <Link to="/admin">
            <span className="text-blue-500 hover:underline">Home</span> /
          </Link>
          <span className="text-gray-500"> Contacts</span>
        </p>
      </div>
    </div>
  );
};

export default Reports;
