import React, { useState, useEffect } from "react";
import Map from "../../components/admin/Map";
import AxiosInstance from "../../../utils/AxiosInstance";
import { getUser, notifySuccess } from "../../../utils/helpers";
import AnxietyBarChart from "../../components/admin/charts/AnxietyBarChart";
import ContactEngagementChart from "../../components/admin/charts/ContactsLineChart";

import { AccountCircle } from "@mui/icons-material";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import { Link } from "react-router-dom";

const index = () => {
  const [userCount, setUserCount] = useState(0);
  const [spaceCount, setSpaceCount] = useState(0);
  const [anxietyTestCount, setAnxietyTestCount] = useState(0);

  const user = getUser();
  const fetchUserCount = async () => {
    try {
      await AxiosInstance.get("/users/count").then((response) => {
        if (response.status === 200) {
          setUserCount(response.data.count);
          console.log(response);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSpaceCount = async () => {
    try {
      await AxiosInstance.get("/spaces/count").then((response) => {
        if (response.status === 200) {
          setSpaceCount(response.data.count);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAnxietyTestCount = async () => {
    try {
      await AxiosInstance.get("/anxietyPredictions/count").then((response) => {
        if (response.status === 200) {
          setAnxietyTestCount(response.data.count);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserCount();
    fetchSpaceCount();
    fetchAnxietyTestCount();
  }, []);

  return (
    <div>
      {/* Widgets container */}
      <div>
        <div className="flex gap-4 mt-4">
          {/* Users Card */}
          <div className="flex-1 min-w-[200px] p-6 text-center bg-gradient-to-r from-[#FED0C5] to-[#8B47B5] rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105">
            <div className="relative">
              <AccountCircle className="text-5xl text-white mb-4" />
            </div>
            <h6 className="text-xl font-semibold text-white">Users</h6>
            <h4 className="text-3xl font-bold text-gray-900 bg-white inline-block px-4 py-1 rounded-lg shadow">
              {userCount}
            </h4>
            <Link to="/admin/users">
              <button className="mt-4 px-4 py-2 bg-white text-[#8B47B5] font-semibold rounded-lg hover:bg-[#FFD700] transition-colors">
                View Users
              </button>
            </Link>
          </div>

          {/* Spaces Card */}
          <div className="flex-1 min-w-[200px] p-6 text-center bg-gradient-to-r from-[#5D69BE] to-[#C89FEB] rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105">
            <div className="relative">
              <PeopleIcon className="text-5xl text-white mb-4" />
            </div>
            <h6 className="text-xl font-semibold text-white">Spaces</h6>
            <h4 className="text-3xl font-bold text-gray-900 bg-white inline-block px-4 py-1 rounded-lg shadow">
              {spaceCount}
            </h4>
            <button className="mt-4 px-4 py-2 bg-white text-[#5D69BE] font-semibold rounded-lg hover:bg-[#FFD700] transition-colors">
              Explore Spaces
            </button>
          </div>

          {/* AI Prediction Test Card */}
          <div className="flex-1 min-w-[200px] p-6 text-center bg-gradient-to-r from-[#014871] to-[#D7EDE2] rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105">
            <div className="relative">
              <EventIcon className="text-5xl text-white mb-4" />
            </div>
            <h6 className="text-xl font-semibold text-white">
              AI Prediction Test
            </h6>
            <h4 className="text-3xl font-bold text-gray-900 bg-white inline-block px-4 py-1 rounded-lg shadow">
              {anxietyTestCount}
            </h4>
            <Link to="/admin/predictions">
              <button className="mt-4 px-4 py-2 bg-white text-[#8B47B5] font-semibold rounded-lg hover:bg-[#FFD700] transition-colors">
                View Results
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Charts container */}
      <div className="mt-8">
        <div className="flex gap-4">
          <div className="flex-1 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Anxiety Level
            </h3>
            <AnxietyBarChart />
          </div>

          <div className="flex-1 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Contact Us Engagements
            </h3>
            <ContactEngagementChart />
          </div>
        </div>
      </div>

      {/* Map container */}
      <div className="mt-8">
        <Map />
      </div>
    </div>
  );
};

export default index;
