import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import AxiosInstance from "../../../utils/AxiosInstance";
import { getUser, notifyError } from "../../../utils/helpers";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const moodColors = {
  Happy: "#FDC700",
  Sad: "#51A2FF",
  Angry: "#FF6467",
  Neutral: "#99A1AF",
  Anxious: "#00D5BE",
};

const flaticonMoodIcons = {
  Happy: `<i class="fi fi-tr-laugh-beam"></i>`,
  Sad: `<i class="fi fi-tr-sad"></i>`,
  Angry: `<i class="fi fi-tr-angry"></i>`,
  Neutral: `<i class="fi fi-tr-meh"></i>`,
  Anxious: `<i class="fi fi-tr-face-anxious-sweat"></i>`,
};

const MoodCalendar = () => {
  const user = getUser();
  const userId = user._id;
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [moodData, setMoodData] = useState({});

  const daysInMonth = currentDate.daysInMonth();
  const startOfMonth = currentDate.startOf("month");
  const firstDayIndex = startOfMonth.day();

  const days = Array.from({ length: daysInMonth }, (_, i) =>
    startOfMonth.add(i, "day")
  );
  const blankDays = Array.from({ length: firstDayIndex }, (_, i) => i);

  const handleMoodSelect = (day) => {
    const moodOptions = Object.keys(moodColors);
    const currentMood = moodData[day] || "Neutral";
    const nextMood =
      moodOptions[(moodOptions.indexOf(currentMood) + 1) % moodOptions.length];
    setMoodData({ ...moodData, [day]: nextMood });
  };

  const fetchMoodData = async (month, year) => {
    try {
      const res = await AxiosInstance.get(`/moodEntries/moodPerDay/${userId}`, {
        params: { month, year },
      });

      if (res.status === 200) {
        const transformedData = res.data.reduce((acc, entry) => {
          acc[entry.date] = entry.mood;
          return acc;
        }, {});

        setMoodData(transformedData);
      }
    } catch (error) {
      notifyError("Failed to fetch mood per day");
      console.error(error);
    }
  };

  useEffect(() => {
    const month = currentDate.month() + 1;
    const year = currentDate.year();
    fetchMoodData(month, year);
  }, [currentDate]);

  return (
    <div className="p-8 bg-white shadow-lg rounded-lg w-full max-w-2xl mx-auto my-12">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setCurrentDate(currentDate.subtract(1, "month"))}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          <ArrowBackIosIcon sx={{ fontSize: "20px" }} />
        </button>
        <h2 className="text-xl font-bold">{currentDate.format("MMMM YYYY")}</h2>
        <button
          onClick={() => setCurrentDate(currentDate.add(1, "month"))}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          <ArrowForwardIosIcon sx={{ fontSize: "20px" }} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-3">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center font-bold text-gray-700 text-lg"
          >
            {day}
          </div>
        ))}

        {blankDays.map((_, index) => (
          <div key={index} className="w-16 h-16"></div>
        ))}

        {days.map((day) => {
          const formattedDay = day.format("YYYY-MM-DD");
          const mood = moodData[formattedDay];
          const hasMood = !!mood;

          return (
            <div
              key={formattedDay}
              onClick={() => handleMoodSelect(formattedDay)}
              className="w-16 h-16 flex flex-col items-center justify-center rounded-lg cursor-pointer border border-gray-300 shadow-md"
              style={{
                backgroundColor: hasMood ? moodColors[mood] : "#F5F5F5",
              }}
            >
              <div className="text-lg font-bold">{day.format("D")}</div>
              {hasMood && (
                <div
                  className="mt-2 text-2xl"
                  dangerouslySetInnerHTML={{ __html: flaticonMoodIcons[mood] }}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MoodCalendar;
