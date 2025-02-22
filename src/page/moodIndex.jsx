import React, { useState } from "react";
import { getUser } from "../../utils/helpers";
import Sphere from "../components/user/sphere";
import { Link } from "react-router-dom";
import Brain from "../components/user/brain_v2/brain";
const MoodIndex = () => {
  const user = getUser();

  return (
    <div className="relative h-screen w-screen bg-white">
      <Brain />

      <div className="absolute top-0 right-0 flex justify-end items-center h-screen pr-8">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
          <h1 className="text-4xl font-serif font-bold text-[#C8A2C8]">
            Mood Tracking
          </h1>
          <p className="text-lg text-gray-700 mt-4 leading-relaxed">
            A life-changing personal approach to your mental well-being. Calm
            your body and mind with the power of journaling and mood tracking.
          </p>

          <div className="mt-6 flex flex-row gap-5 justify-center">
            <Link to={"/record-mood"}>
              <button
                aria-label="Record your mood"
                className="bg-[#B5EAD7] text-[#4A4A4A] px-6 py-3 font-semibold rounded-lg shadow-md hover:bg-[#B0E0E6] hover:scale-105 transition duration-300"
              >
                Record Mood
              </button>
            </Link>
            <Link to={"/mood-dashboard"}>
              <button
                aria-label="View mood dashboard"
                className="border-2 border-[#B5EAD7] text-[#4A4A4A] px-6 py-3 font-semibold rounded-lg shadow-md hover:bg-[#B0E0E6] hover:border-[#B0E0E6] hover:scale-105 transition duration-300"
              >
                View Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
    // <div className="relative min-h-screen bg-[#cccccc] flex flex-col md:flex-row items-center justify-center  space-y-8 md:space-y-0">
    //   {/* Sphere at the Center */}
    //   <div className="flex justify-center w-full">
    //     <Brain />
    //   </div>

    //   {/* CTA Card */}

    // </div>
  );
};

export default MoodIndex;
