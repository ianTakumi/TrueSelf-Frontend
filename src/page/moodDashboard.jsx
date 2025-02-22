import React, { useState, useRef, useEffect } from "react";
import Calendar from "../components/user/Calendar";
import {
  getUser,
  notifyError,
  notifySuccess,
  songs,
} from "../../utils/helpers";
import PieChart from "../components/user/charts/PieChart";
import MoodLineChart from "../components/user/charts/LineCharts";
import AxiosInstance from "../../utils/AxiosInstance";
import {
  Box,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Edit, Delete, TableChart, ViewModule } from "@mui/icons-material";
import Swal from "sweetalert2";
import MoodModal from "../components/user/modals/MoodModal";
import Playlist from "../components/user/Playlist";
const MoodDashboard = () => {
  const user = getUser();
  const userId = user._id;
  const [moods, setMoods] = useState([]);
  const [visibleMoods, setVisibleMoods] = useState(5);
  const [viewMode, setViewMode] = useState("card");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [moodToEdit, setMoodToEdit] = useState(null);

  const fetchMoods = async () => {
    try {
      const res = await AxiosInstance.get(`/moodEntries/${userId}`);
      if (res.status === 200) {
        setMoods(res.data.moodEntries);
      }
    } catch (error) {
      console.error(error);
      notifyError("Failed to fetch mood entries");
    }
  };

  useEffect(() => {
    fetchMoods();
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

  const handleDelete = (moodId) => {
    Swal.fire({
      title: "Do you want to delete this entry?",
      showDenyButton: true,
      confirmButtonText: "Delete",
      denyButtonText: `No`,
      confirmButtonColor: "#C6313A",
      denyButtonColor: "#D3D3D3",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMoodEntry(moodId);
      }
    });
  };

  const deleteMoodEntry = async (moodId) => {
    await AxiosInstance.delete(`/moodEntries/${userId}/${moodId}`)
      .then((res) => {
        notifySuccess("Successfully Deleted!");
        fetchMoods();
        console.log(res);
      })
      .catch((err) => {
        notifyError("Failed to delete mood entry");
        console.error(err);
      });
  };

  const openModal = (mood) => {
    setMoodToEdit(mood);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setMoodToEdit(null);
    setIsModalOpen(false);
  };

  return (
    <div className="my-10 px-6 md:px-20 lg:px-32">
      <div className="text-center">
        <h1 className="font-serif font-bold text-2xl md:text-3xl">
          Mood Tracker Dashboard
        </h1>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          Reflect, relax, and gain insights into your emotional well-being.
        </p>
      </div>

      {isModalOpen && (
        <Box position="fixed" top="0" left="0" right="0" bottom="" zIndex="50">
          <MoodModal
            mood={moodToEdit}
            onClose={closeModal}
            fetchMoods={fetchMoods}
          />
        </Box>
      )}
      <div className="flex flex-col md:flex-row mt-8 gap-8">
        <div className="w-full md:w-1/2">
          <Calendar />
        </div>
        <Playlist />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <div className="bg-white shadow-lg p-6 rounded-xl">
          <h2 className="font-serif font-semibold text-lg md:text-xl mb-4">
            Monthly Mood Trend
          </h2>
          <MoodLineChart />
        </div>
        <div className="bg-white shadow-lg p-6 rounded-xl">
          <h2 className="font-serif font-semibold text-lg md:text-xl mb-4">
            Mood Distribution Overview
          </h2>
          <PieChart />
        </div>
      </div>

      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-serif font-semibold text-lg md:text-xl">
            Recent Mood Entries
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

        <div className="  p-6  ">
          {moods.length > 0 ? (
            <>
              {viewMode === "card" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {moods.slice(0, visibleMoods).map((mood) => (
                    <div
                      key={mood._id}
                      className="p-4 border rounded-xl shadow-md bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <h3 className="text-lg font-semibold">
                        Mood: {mood.mood}
                      </h3>
                      <p className="text-sm text-gray-700 mt-1">{mood.note}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatDate(mood.createdAt)}
                      </p>
                      <div className="flex justify-end space-x-2 mt-4">
                        <IconButton
                          onClick={() => openModal(mood)}
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(mood._id)}
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
                      <th className="border px-4 py-2 text-left">Mood</th>
                      <th className="border px-4 py-2 text-left">Note</th>
                      <th className="border px-4 py-2 text-left">Date</th>
                      <th className="border px-4 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {moods.slice(0, visibleMoods).map((mood) => (
                      <tr
                        key={mood._id}
                        className="border-b transition-colors duration-200 hover:bg-gray-100"
                      >
                        <td className="border px-4 py-2">{mood.mood}</td>
                        <td className="border px-4 py-2">{mood.note}</td>
                        <td className="border px-4 py-2">
                          {formatDate(mood.createdAt)}
                        </td>
                        <td className="border px-4 py-2 flex justify-center space-x-2">
                          <IconButton
                            onClick={() => openModal(mood)}
                            color="primary"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(mood._id)}
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
            <p className="text-gray-500">No mood entries available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodDashboard;
