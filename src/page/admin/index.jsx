import React, { useState, useEffect } from "react";
// import Map from "../../components/admin/Map";
import AxiosInstance from "../../../utils/AxiosInstance";
import { getUser, notifySuccess } from "../../../utils/helpers";
import AnxietyBarChart from "../../components/admin/charts/AnxietyBarChart";
import ContactEngagementChart from "../../components/admin/charts/ContactsLineChart";
import StackBarChart from "../../components/admin/charts/StackBarChart";
import SleepBarChart from "../../components/admin/charts/SleepBarChart";
import { AccountCircle } from "@mui/icons-material";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import { Link } from "react-router-dom";
import PieChartComponent from "../../components/admin/charts/PieChartComponent";
import ScatterPlotChart from "../../components/admin/charts/ScatterPlotChart";
import ContactPieChart from "../../components/admin/charts/ContactPieChart";
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

            {/* Flex container for number and button */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="text-3xl font-bold text-gray-900 bg-white px-4 py-2 rounded-lg shadow min-w-[70px] text-center">
                {userCount}
              </span>
              <Link to="/admin/users">
                <button className="px-4 py-2 bg-white text-[#8B47B5] font-semibold rounded-lg shadow min-w-[120px] text-center hover:bg-[#FFD700] transition-colors">
                  View Users
                </button>
              </Link>
            </div>
          </div>

          {/* Spaces Card */}
          <div className="flex-1 min-w-[200px] p-6 text-center bg-gradient-to-r from-[#5D69BE] to-[#C89FEB] rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105">
            <div className="relative">
              <PeopleIcon className="text-5xl text-white mb-4" />
            </div>
            <h6 className="text-xl font-semibold text-white">Spaces</h6>

            {/* Flex container for space count and button */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="text-3xl font-bold text-gray-900 bg-white px-4 py-2 rounded-lg shadow min-w-[80px] text-center">
                {spaceCount}
              </span>
              <Link to={"/admin/communities"}>
                <button className="px-4 py-2 bg-white text-[#5D69BE] font-semibold rounded-lg shadow min-w-[140px] text-center hover:bg-[#FFD700] transition-colors">
                  Explore Spaces
                </button>
              </Link>
            </div>
          </div>

          {/* AI Prediction Test Card */}
          <div className="flex-1 min-w-[200px] p-6 text-center bg-gradient-to-r from-[#014871] to-[#D7EDE2] rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105">
            <div className="relative">
              <EventIcon className="text-5xl text-white mb-4" />
            </div>
            <h6 className="text-xl font-semibold text-white">
              AI Prediction Test
            </h6>

            {/* Flex container for number and button */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="text-3xl font-bold text-gray-900 bg-white px-4 py-2 rounded-lg shadow min-w-[80px] text-center">
                {anxietyTestCount}
              </span>
              <Link to="/admin/predictions">
                <button className="px-4 py-2 bg-white text-[#014871] font-semibold rounded-lg shadow min-w-[140px] text-center hover:bg-[#FFD700] transition-colors">
                  View Results
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Charts container */}
      <div className="mt-10 space-y-6">
        {/* Section Header */}
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Anxiety Prediction Section
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <AnxietyBarChart />
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <PieChartComponent />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <SleepBarChart />
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <ScatterPlotChart />
          </div>
        </div>
      </div>

      <div className="mt-10 mb-24 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Contacts Section
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <ContactEngagementChart />
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <ContactPieChart />
          </div>
        </div>
      </div>

      {/* <div className="flex-1 bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Users Mood Distribution per Week
        </h3>
        <StackBarChart />
      </div> */}
    </div>
  );
};

export default index;
