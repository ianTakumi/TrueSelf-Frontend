import React, { useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import AxiosInstance from "../../utils/AxiosInstance";
import { getUser, notifyError } from "../../utils/helpers";

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

const MoodEntry = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const user = getUser();

  const handleMoodSelection = (mood) => {
    const userId = user._id;
    setSelectedMood(mood);

    Swal.fire({
      title: `${mood.name} Mood`,
      html: `
        <p><strong>How are you feeling?</strong></p>
        <textarea 
          id="note" 
          class="swal2-textarea" 
          placeholder="Add a note..." 
          rows="4"></textarea>
      `,
      icon: "info",
      confirmButtonText: "Submit",
      preConfirm: () => {
        const noteValue = document.getElementById("note").value;
        if (!noteValue) {
          Swal.showValidationMessage("Please add a note.");
          return false;
        }
        return noteValue;
      },
      customClass: {
        popup: "bg-[#f7f7f7] p-6 rounded-xl",
        title: "text-2xl font-semibold text-[#C8A2C8]",
        htmlContainer: "text-lg text-gray-700",
        textarea:
          "w-full p-4 rounded-xl shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const data = {
          mood: mood.name,
          note: result.value,
        };

        await AxiosInstance.post(`/moodEntries/${userId}`, data)
          .then((res) => {
            if (res.status === 201) {
              console.log("Mood data saved successfully");
              setIsSubmitted(true);
              setNote(result.value);
              const randomSuggestion =
                mood.suggestions[
                  Math.floor(Math.random() * mood.suggestions.length)
                ];
              setSuggestion(randomSuggestion);
              Swal.fire({
                title: "Success!",
                text: "Your mood and note have been submitted successfully.",
                icon: "success",
                confirmButtonText: "OK",
                customClass: {
                  popup: "bg-[#E0FFEB] p-6 rounded-xl",
                  title: "text-2xl font-semibold text-[#28a745]",
                  htmlContainer: "text-lg text-gray-700",
                },
              });
            }
          })
          .catch((err) => {
            console.error("Error saving mood data", err);
            notifyError("Error saving mood data");
          });
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#FFDAB9] via-[#FFFACD] to-[#B0E0E6] px-8 py-12">
      {isSubmitted ? (
        <div className="flex flex-col items-center justify-center w-full max-w-md p-6 rounded-xl bg-white shadow-lg">
          <div className="text-4xl mb-4 text-gray-800">
            <img src={selectedMood?.icon} width={75} height={75} alt="" />
          </div>
          <h2 className="text-3xl font-semibold text-gray-700 mb-6">
            {selectedMood?.name} Mood
          </h2>
          <div className="text-lg text-center text-gray-600 italic mb-4">
            {note}
          </div>
          <div className="bg-[#f7f7f7] p-6 rounded-xl shadow-lg w-full">
            <p className="text-xl text-gray-800">{suggestion}</p>
          </div>
          <Link to="/mood-dashboard">
            <button className="mt-6 bg-[#B5EAD7] text-[#4A4A4A] px-6 py-3 font-semibold rounded-lg shadow-md hover:bg-[#B0E0E6] transition duration-300">
              View Dashboard
            </button>
          </Link>
        </div>
      ) : (
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif font-bold text-[#C8A2C8]">
            Hi {user.name}! How are you feeling today?
          </h1>
          <p className="text-lg text-gray-700 mt-4 leading-relaxed">
            Choose a mood that best represents how you're feeling today.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
            {moodData.map((mood) => (
              <div
                key={mood.id}
                className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-lg cursor-pointer ${mood.color} hover:scale-105 transition-all duration-200`}
                onClick={() => handleMoodSelection(mood)}
              >
                <div className="text-5xl">
                  <img
                    src={mood.icon}
                    className="object-cover w-16 h-16"
                    alt={mood.name}
                  />
                </div>
                <h3 className="mt-2 text-xl font-semibold text-gray-800">
                  {mood.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodEntry;
