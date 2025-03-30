import React, { useState, useEffect, use } from "react";
import Clock from "react-clock";
import "react-clock/dist/Clock.css";
import {
  IconButton,
  Modal,
  Box,
  Slider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getUser,
  notifyError,
  notifySuccess,
  getPreviewHtml,
} from "../../utils/helpers";
import { useForm } from "react-hook-form";
import { modules } from "../configs/ReactQuill.config";
import AxiosInstance from "../../utils/AxiosInstance";
import Swal from "sweetalert2";
import { Edit, Delete, TableChart, ViewModule } from "@mui/icons-material";
import JournalModal from "../components/user/modals/JournalModal";
import JournalStreak from "../components/user/JournalStreak";
import Affirmations from "../components/user/Affirmations";
import JournalLineChart from "../components/user/charts/JournalLineChart";
import JournalPieChart from "../components/user/charts/JournalPieChart";

const images = [
  "/page/journal/1.jpg",
  "/page/journal/2.jpg",
  "/page/journal/3.jpg",
  "/page/journal/4.jpg",
  "/page/journal/5.jpg",
  "/page/journal/6.jpg",
  "/page/journal/7.jpg",
  "/page/journal/8.jpg",
  "/page/journal/9.jpg",
  "/page/journal/10.jpg",
];

const Diary = () => {
  const [time, setTime] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [quote, setQuote] = useState(null);
  const [selectedImage, setSelectedImage] = useState(
    sessionStorage.getItem("selectedImage") || images[0]
  );
  const [journalEntries, setJournalEntries] = useState([]);
  const [visibleJournalEntries, setVisibleJournalEntries] = useState(6);
  const [viewMode, setViewMode] = useState("card");
  const user = getUser();
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: { title: "", journalEntry: "" },
  });
  const journalEntry = watch("journalEntry");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedJournalEntry, setSelectedJournalEntry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch("http://api.quotable.io/random");
        const data = await response.json();
        setQuote(data);
      } catch (error) {
        console.error("Error fetching quote:", error);
      }
    };
    fetchQuote();
  }, []);

  const handleSelectImage = (img) => {
    setSelectedImage(img);
    sessionStorage.setItem("selectedImage", img);
    setOpen(false);
  };

  const handleJournalChange = (content) => {
    setValue("journalEntry", content, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    const userId = user._id;
    const cleanedData = {
      userId,
      title: data.title,
      content: data.journalEntry,
    };
    console.log(cleanedData);
    await AxiosInstance.post(`/journalEntries/${userId}`, cleanedData).then(
      (response) => {
        console.log(response.data);
        if (response.status === 201) {
          notifySuccess("Journal entry saved successfully");
          getAllJournalEntry();
        } else {
          console.error("Error saving journal entry:", response.data.message);
          notifyError("Error saving journal entry");
        }
      }
    );
  };

  const handleDelete = async (id) => {
    console.log("Delete journal entry with id:", id);
    const result = await Swal.fire({
      title: "Do you want to delete this journal entry?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#ff7eb6",
      cancelButtonColor: "#6c8ae4",
      background: "#f7f7f9",
      color: "#333",
    });

    if (result.isConfirmed) {
      try {
        await AxiosInstance.delete(`/journalEntries/${id}`).then((res) => {
          if (res.status === 200) {
            notifySuccess("Journal entry deleted successfully");
            getAllJournalEntry();
          } else {
            console.error("Error deleting journal entry:", res.data.message);
            notifyError("Error deleting journal entry");
          }
        });
      } catch (error) {
        console.error("Error deleting journal entry:", error);
        notifyError("Error deleting journal entry");
      }
    }
  };

  const getAllJournalEntry = async () => {
    const userId = user._id;
    await AxiosInstance.get(`/journalEntries/${userId}`).then((response) => {
      if (response.status === 200) {
        setJournalEntries(response.data.data);
      } else {
        console.error("Error saving journal entry:", response.data.message);
        notifyError("Error saving journal entry");
      }
    });
  };

  useEffect(() => {
    getAllJournalEntry();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleOpenModal = (journalEntry = null) => {
    setIsModalOpen(true);
    setIsEditing(!!journalEntry);
    setSelectedJournalEntry(journalEntry);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setSelectedJournalEntry(null);
  };

  const loadMoreJournals = () => {
    setVisibleJournalEntries((prev) => prev + 6);
  };

  return (
    <div className="my-10 px-6 md:px-20 lg:px-32">
      <div className="flex justify-center items-center flex-col">
        <h1 className="font-bold text-4xl text-lilac">Digital Journal</h1>
        <p className="mt-2 text-lg text-gray-700 max-w-md text-center">
          Your story matters. Express yourself freely and embrace your true self
          in a safe space.
        </p>
      </div>

      {isModalOpen && (
        <Box position="fixed" top="0" left="0" right="0" bottom="" zIndex="50">
          <JournalModal
            journal={selectedJournalEntry}
            onClose={handleCloseModal}
            fetchJournals={getAllJournalEntry}
            isEditing={isEditing}
          />
        </Box>
      )}

      <div className="flex flex-col md:flex-row items-center justify-center gap-12 my-10">
        <div className="relative">
          <img
            src={selectedImage}
            alt="Journal Illustration"
            className="w-60 h-60 rounded-full shadow-lg"
          />
          <IconButton
            sx={{
              position: "absolute",
              bottom: 40,
              left: 170,
              backgroundColor: "white",
              boxShadow: 3,
            }}
            onClick={() => setOpen(true)}
          >
            <EditIcon fontSize="medium" />
          </IconButton>
        </div>

        <div className="text-center mt-8 px-6">
          {quote ? (
            <div className="bg-gradient-to-r from-pink-200 via-yellow-200 to-blue-200 p-5 rounded-lg shadow-lg">
              <p className="text-xl font-semibold text-gray-800">
                "{quote.content}"
              </p>
              <p className="mt-2 text-gray-700">- {quote.author}</p>
            </div>
          ) : (
            <p className="text-gray-500">Loading quote...</p>
          )}
        </div>
        <div className="text-center">
          <p className="text-xl font-medium bg-gray-100 p-3 rounded-lg shadow">
            {time.toDateString()}
          </p>
          <Clock className="mt-4  p-2 rounded-lg" value={time} />
        </div>
      </div>

      <div className="my-20">
        <JournalStreak />
      </div>

      <div className="my-10">
        <Affirmations />
      </div>

      <div className="my-10 p-6">
        <h2 className="font-serif font-semibold text-lg md:text-xl mb-4">
          Analytics
        </h2>
        <div className="flex justify-between items-center mb-4 gap-5">
          <div className="w-1/2">
            <JournalLineChart />
          </div>
          <div className="w-1/2">
            <JournalPieChart />
          </div>
        </div>
      </div>
      {/* List of journals */}
      <div className="my-5 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-serif font-semibold text-lg md:text-xl">
            Recent Journal Entries
          </h2>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newView) => newView && setViewMode(newView)}
            size="small"
          >
            <ToggleButton value="card">
              <ViewModule fontSize="small" />
            </ToggleButton>
            <ToggleButton value="table">
              <TableChart fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="border-2 my-5 border-[#C8A2C8] text-[#C8A2C8] px-4 py-2 rounded-lg hover:bg-[#C8A2C8] hover:text-white transition"
        >
          Add Entry
        </button>

        {journalEntries.length > 0 ? (
          <>
            {viewMode === "card" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {journalEntries.slice(0, visibleJournalEntries).map((entry) => (
                  <div
                    key={entry._id}
                    className="p-4 border rounded-xl shadow-md bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <h3 className="text-lg font-semibold">{entry.title}</h3>
                    <p
                      className="text-sm text-gray-700 mt-1"
                      dangerouslySetInnerHTML={{
                        __html: getPreviewHtml(entry.content, 200),
                      }}
                    />

                    <p className="text-xs text-gray-500 mt-2">
                      {formatDate(entry.createdAt)}
                    </p>
                    <div className="flex justify-end space-x-2 mt-4">
                      <IconButton
                        onClick={() => handleOpenModal(entry)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(entry._id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <table className="min-w-full border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2 text-left">Title</th>
                    <th className="border px-4 py-2 text-left">Content</th>
                    <th className="border px-4 py-2 text-left">Created At </th>
                    <th className="border px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {journalEntries
                    .slice(0, visibleJournalEntries)
                    .map((entry) => (
                      <tr
                        key={entry._id}
                        className="border-b transition-colors duration-200 hover:bg-gray-100"
                      >
                        <td className="border px-4 py-2">{entry.title}</td>
                        <td
                          className="border px-4 py-2"
                          dangerouslySetInnerHTML={{
                            __html: getPreviewHtml(entry.content, 100),
                          }}
                        />

                        <td className="border px-4 py-2">
                          {formatDate(entry.createdAt)}
                        </td>
                        <td className="border px-4 py-2 flex justify-center space-x-2">
                          <IconButton
                            onClick={() => handleEdit(entry._id)}
                            color="primary"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(entry._id)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <img src="/svg/journal/note.svg" width={300} height={300} alt="" />
            <p className="text-gray-500">No journal entries available.</p>
          </div>
        )}
      </div>

      {visibleJournalEntries < journalEntries.length && (
        <div className="flex justify-center my-4">
          <button
            onClick={loadMoreJournals}
            className="bg-[#63579F] text-white px-4 py-2 rounded-lg hover:bg-[#7C6DC4] transition"
          >
            Load More
          </button>
        </div>
      )}

      {/* Image Selection Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: 4,
            borderRadius: 2,
            boxShadow: 24,
            width: { xs: "80%", md: "50%", lg: "40%" },
          }}
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute top-2 right-2 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-lg hover:bg-gray-300"
          >
            ✕
          </button>

          <h2 className="text-2xl font-bold mb-4 text-center">
            Select an Image
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Image ${index + 1}`}
                className="w-24 h-24 rounded-lg cursor-pointer hover:opacity-80"
                onClick={() => handleSelectImage(img)}
              />
            ))}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Diary;
