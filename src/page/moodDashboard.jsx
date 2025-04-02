import React, { useState, useEffect } from "react";
import Calendar from "../components/user/Calendar";
import { getUser, notifyError, notifySuccess } from "../../utils/helpers";
import PieChart from "../components/user/charts/PieChart";
import MoodLineChart from "../components/user/charts/LineCharts";
import AxiosInstance from "../../utils/AxiosInstance";
import {
  Box,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Button,
} from "@mui/material";
import { Edit, Delete, TableChart, ViewModule } from "@mui/icons-material";
import Swal from "sweetalert2";
import MoodModal from "../components/user/modals/MoodModal";
import Playlist from "../components/user/Playlist";
import Affirmations from "../components/user/Affirmations";
import MoodStreak from "../components/user/MoodStreak";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
const moodData = [
  {
    id: 1,
    name: "Neutral",
    color: "bg-gray-400",
    icon: "/moods/neutral.png",
    suggestions: [
      "Enjoy the present moment and take a deep breath.",
      "Take some time to relax, maybe listen to calming music.",
      "Engage in a simple, calming activity like stretching or journaling.",
      "Reflect on things you're grateful for or things you've accomplished.",
      "Embrace the peace, focus on being in the here and now.",
      "Spend some time outdoors to recharge your energy.",
    ],
  },
  {
    id: 2,
    name: "Happy",
    color: "bg-yellow-400",
    icon: "/moods/smiley.png",
    suggestions: [
      "Keep spreading positivity!",
      "Celebrate small wins.",
      "Share your happiness with others.",
      "Take a moment to enjoy the good things in life.",
      "Practice gratitude to amplify your joy.",
      "Keep that smile going, it brightens up the world!",
    ],
  },
  {
    id: 3,
    name: "Anxious",
    color: "bg-teal-400",
    icon: "/moods/anxious.png",
    suggestions: [
      "Channel your energy into something creative!",
      "Celebrate your excitement with others!",
      "Make a plan to accomplish something you've been wanting to do.",
      "Use your excitement to motivate you to reach your goals.",
      "Find ways to keep your enthusiasm going.",
      "Share your excitement with friends or family!",
    ],
  },
  {
    id: 4,
    name: "Sad",
    color: "bg-blue-400",
    icon: "/moods/sad.png",
    suggestions: [
      "Take some time for self-care.",
      "Talk to someone you trust about your feelings.",
      "Journaling can help process your emotions.",
      "Do something that relaxes you, like reading or walking.",
      "Consider watching something that makes you laugh.",
      "Practice mindfulness or meditation to find peace.",
    ],
  },
  {
    id: 5,
    name: "Angry",
    color: "bg-red-400",
    icon: "/moods/angry.png",
    suggestions: [
      "Try some deep breathing exercises.",
      "Take a walk to cool off and reset.",
      "Reflect on what triggered your anger and how to address it.",
      "Practice mindfulness or meditation to calm your mind.",
      "Write down your feelings as a form of release.",
      "Engage in a physical activity to release tension.",
    ],
  },
];

const MoodDashboard = () => {
  const user = getUser();
  const userId = user._id;
  const [moods, setMoods] = useState([]);
  const [visibleMoods, setVisibleMoods] = useState(6);
  const [viewMode, setViewMode] = useState("card");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [moodToEdit, setMoodToEdit] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest");
  const navigate = useNavigate();

  const fetchMoods = async () => {
    try {
      const res = await AxiosInstance.get(`/moodEntries/${userId}`);
      if (res.status === 200) {
        let sortedEntries = res.data.moodEntries.sort((a, b) => {
          return sortOrder === "newest"
            ? new Date(b.createdAt) - new Date(a.createdAt) // Newest first
            : new Date(a.createdAt) - new Date(b.createdAt); // Oldest first
        });
        setMoods(sortedEntries);
      }
    } catch (error) {
      console.error(error);
      notifyError("Failed to fetch mood entries");
    }
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"));
  };

  useEffect(() => {
    fetchMoods();
  }, [sortOrder]);

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

  const loadMoreMoods = () => {
    setVisibleMoods((prev) => prev + 6);
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
        <Calendar />

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

      <div className="my-10">
        <Affirmations />
      </div>
      <div className="my-10">
        <MoodStreak />
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

        <div className="flex justify-between items-center mt-10  mb-5">
          <Button
            onClick={() => navigate("/record-mood")}
            variant="outlined"
            sx={{
              borderColor: "#63579F",
              color: "#63579F",
              "&:hover": {
                backgroundColor: "#63579F",
                color: "white",
                borderColor: "#63579F",
              },
            }}
          >
            Add Entry
          </Button>
          <Button
            onClick={toggleSortOrder}
            variant="outlined"
            sx={{
              borderColor: "#63579F",
              color: "#63579F",
              "&:hover": {
                backgroundColor: "#63579F",
                color: "white",
                borderColor: "#63579F",
              },
            }}
            startIcon={
              sortOrder === "newest" ? <ArrowUpward /> : <ArrowDownward />
            }
          >
            Sort by: {sortOrder === "newest" ? "Oldest First" : "Newest First"}
          </Button>
        </div>
        <div className="p-6">
          {moods.length > 0 ? (
            <>
              {viewMode === "card" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {moods.slice(0, visibleMoods).map((mood) => {
                    const moodInfo = moodData.find((m) => m.name === mood.mood); // Find the mood info
                    return (
                      <div
                        key={mood._id}
                        className="p-4 border rounded-xl shadow-md bg-gray-50 hover:bg-gray-100 transition"
                      >
                        {/* Lazy-loaded Image */}
                        {moodInfo && (
                          <img
                            src={moodInfo.icon}
                            alt={moodInfo.name}
                            className="w-16 h-16 mx-auto mb-2"
                            loading="lazy"
                          />
                        )}

                        <h3 className="text-lg font-semibold">
                          Mood: {mood.mood}
                        </h3>
                        <p className="text-sm text-gray-700 mt-1">
                          {mood.note}
                        </p>
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
                    );
                  })}
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
            <div className="flex flex-col items-center justify-center">
              <img
                src="/svg/moodDashboard/tots.svg"
                height={300}
                width={300}
                alt=""
              />
              <p className="text-gray-500">No mood entries available.</p>
            </div>
          )}
        </div>

        {moods.length > visibleMoods && (
          <div className="flex justify-center mt-4">
            <button
              onClick={loadMoreMoods}
              className="px-4 py-2 bg-[#63579F] text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition"
            >
              View More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodDashboard;
