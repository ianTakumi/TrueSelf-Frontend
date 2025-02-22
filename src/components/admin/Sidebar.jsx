import React, { useState } from "react";
import {
  Dashboard as DashboardIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Article as ArticleIcon,
  Groups2 as Groups2Icon,
  SmartToy as SmartToyIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../../utils/helpers";
import Swal from "sweetalert2";

const Sidebar = ({ isMinimized }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState("dashboard");
  const [expanded, setExpanded] = useState({
    foods: false,
    users: false,
  });

  const handleItemClick = (item) => {
    setSelected(item);
  };

  const toggleExpansion = (item) => {
    setExpanded((prevState) => ({
      ...prevState,
      [item]: !prevState[item],
    }));
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        logout(() => {
          navigate("/");
        });
        Swal.fire(
          "Logged Out!",
          "You have been logged out successfully.",
          "success"
        );
      }
    });
  };

  return (
    <aside
      className={`  text-white overflow-hidden  ${
        isMinimized ? "w-20" : "w-80"
      }`}
      style={{ backgroundColor: "#181824" }}
    >
      {!isMinimized && (
        <div className="p-4 text-xl font-bold font-serif flex flex-row justify-center items-center -ml-2">
          <img src="/logo/trueself5.png" alt="Cinemax" className="w-12 mr-3" />
          Trueself
        </div>
      )}

      {/* Image displayed when minimized */}
      {isMinimized && (
        <div className="p-4 flex justify-center items-center">
          <img src="/logo/trueself5.png" alt="Trueself" className="ml-6" />
        </div>
      )}
      <ul className="mt-5 text-xs">
        <h1
          style={{ fontSize: "16px" }}
          className={`text-gray-400 font-sans px-8 pt-1  ${
            isMinimized ? "hidden" : "block"
          } `}
        >
          Main
        </h1>
        {/* Sidebar Items */}
        <Link to="/admin">
          <li
            className="mt-3 py-2 px-8 text-gray-400 cursor-pointer flex items-center w-full transition-colors duration-300 ease-in-out relative"
            onMouseOver={() => setHovered("dashboard")}
            onMouseOut={() => setHovered(null)}
            onClick={() => handleItemClick("dashboard")}
            style={{
              backgroundColor:
                hovered === "dashboard" || selected === "dashboard"
                  ? "#161621"
                  : "transparent",
            }}
          >
            {selected === "dashboard" && (
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-[#D1B1D3]" />
            )}
            <div
              className="mr-5 rounded-md transition-colors duration-300 ease-in-out"
              style={{ backgroundColor: "#2B3138" }}
            >
              <DashboardIcon
                style={{
                  color: "#D1B1D3",
                  fontSize: "1.7rem",
                  lineHeight: "1",
                }}
                className="p-1"
              />
            </div>
            <span
              className={`transition-all ease-in-out duration-500 ${
                isMinimized ? "hidden" : "block"
              }`}
              style={{
                fontSize: "16px",
                color:
                  hovered === "dashboard" || selected === "dashboard"
                    ? "white"
                    : "#9ca3af",
              }}
            >
              Dashboard
            </span>
          </li>
        </Link>

        {/* Users */}
        <Link to="/admin/users">
          <li
            className="mt-3 py-2 px-8 text-gray-400 cursor-pointer flex items-center w-full transition-colors duration-300 ease-in-out relative"
            onMouseOver={() => setHovered("users")}
            onMouseOut={() => setHovered(null)}
            onClick={() => handleItemClick("users")}
            style={{
              backgroundColor:
                hovered === "users" || selected === "users"
                  ? "#161621"
                  : "transparent",
            }}
          >
            {selected === "users" && (
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-[#D1B1D3]" />
            )}
            <div
              className="mr-5 rounded-md transition-colors duration-300 ease-in-out"
              style={{ backgroundColor: "#2B3138" }}
            >
              <GroupIcon
                style={{
                  color: "#D1B1D3",
                  fontSize: "1.7rem",
                  lineHeight: "1",
                }}
                className="p-1"
              />
            </div>
            <span
              className={`transition-all ease-in-out duration-500 ${
                isMinimized ? "hidden" : "block"
              }`}
              style={{
                fontSize: "16px",
                color:
                  hovered === "users" || selected === "users"
                    ? "white"
                    : "#9ca3af",
              }}
            >
              Users
            </span>
          </li>
        </Link>

        {/* Communities */}
        <Link to="/admin/communities">
          <li
            className="mt-3 py-2 px-8 text-gray-400 cursor-pointer flex items-center w-full transition-colors duration-300 ease-in-out relative"
            onMouseOver={() => setHovered("users")}
            onMouseOut={() => setHovered(null)}
            onClick={() => handleItemClick("users")}
            style={{
              backgroundColor:
                hovered === "communities" || selected === "communities"
                  ? "#161621"
                  : "transparent",
            }}
          >
            {selected === "communities" && (
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-[#D1B1D3]" />
            )}
            <div
              className="mr-5 rounded-md transition-colors duration-300 ease-in-out"
              style={{ backgroundColor: "#2B3138" }}
            >
              <Groups2Icon
                style={{
                  color: "#D1B1D3",
                  fontSize: "1.7rem",
                  lineHeight: "1",
                }}
                className="p-1"
              />
            </div>
            <span
              className={`transition-all ease-in-out duration-500 ${
                isMinimized ? "hidden" : "block"
              }`}
              style={{
                fontSize: "16px",
                color:
                  hovered === "communities" || selected === "communities"
                    ? "white"
                    : "#9ca3af",
              }}
            >
              Communities
            </span>
          </li>
        </Link>

        <Link to="/admin/predictions">
          <li
            className="mt-3 py-2 px-8 text-gray-400 cursor-pointer flex items-center w-full transition-colors duration-300 ease-in-out relative"
            onMouseOver={() => setHovered("predictions")}
            onMouseOut={() => setHovered(null)}
            onClick={() => handleItemClick("predictions")}
            style={{
              backgroundColor:
                hovered === "predictions" || selected === "predictions"
                  ? "#161621"
                  : "transparent",
            }}
          >
            {selected === "predictions" && (
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-[#D1B1D3]" />
            )}
            <div
              className="mr-5 rounded-md transition-colors duration-300 ease-in-out"
              style={{ backgroundColor: "#2B3138" }}
            >
              <SmartToyIcon
                style={{
                  color: "#D1B1D3",
                  fontSize: "1.7rem",
                  lineHeight: "1",
                }}
                className="p-1"
              />
            </div>
            <span
              className={`transition-all ease-in-out duration-500 ${
                isMinimized ? "hidden" : "block"
              }`}
              style={{
                fontSize: "16px",
                color:
                  hovered === "predictions" || selected === "predictions"
                    ? "white"
                    : "#9ca3af",
              }}
            >
              Predictions
            </span>
          </li>
        </Link>
        {/* Article */}
        {/* <Link to="/admin/articles">
          <li
            className="mt-3 py-2 px-8 text-gray-400 cursor-pointer flex items-center w-full transition-colors duration-300 ease-in-out relative"
            onMouseOver={() => setHovered("articles")}
            onMouseOut={() => setHovered(null)}
            onClick={() => handleItemClick("articles")}
            style={{
              backgroundColor:
                hovered === "articles" || selected === "articles"
                  ? "#161621"
                  : "transparent",
            }}
          >
            {selected === "articles" && (
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-green-500" />
            )}
            <div
              className="mr-5 rounded-md transition-colors duration-300 ease-in-out"
              style={{ backgroundColor: "#2B3138" }}
            >
              <ArticleIcon
                style={{
                  color: "#33C92D",
                  fontSize: "1.7rem",
                  lineHeight: "1",
                }}
                className="p-1"
              />
            </div>
            <span
              className={`transition-all ease-in-out duration-500 ${
                isMinimized ? "hidden" : "block"
              }`}
              style={{
                fontSize: "16px",
                color:
                  hovered === "articles" || selected === "articles"
                    ? "white"
                    : "#9ca3af",
              }}
            >
              Article
            </span>
          </li>
        </Link> */}
        <Link to="/admin/contacts">
          <li
            className="mt-3 py-2 px-8 text-gray-400 cursor-pointer flex items-center w-full transition-colors duration-300 ease-in-out relative"
            onMouseOver={() => setHovered("contacts")}
            onMouseOut={() => setHovered(null)}
            onClick={() => handleItemClick("contacts")}
            style={{
              backgroundColor:
                hovered === "contacts" || selected === "contacts"
                  ? "#161621"
                  : "transparent",
            }}
          >
            {selected === "contacts" && (
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-[#D1B1D3]" />
            )}
            <div
              className="mr-5 rounded-md transition-colors duration-300 ease-in-out"
              style={{ backgroundColor: "#2B3138" }}
            >
              <ArticleIcon
                style={{
                  color: "#D1B1D3",
                  fontSize: "1.7rem",
                  lineHeight: "1",
                }}
                className="p-1"
              />
            </div>
            <span
              className={`transition-all ease-in-out duration-500 ${
                isMinimized ? "hidden" : "block"
              }`}
              style={{
                fontSize: "16px",
                color:
                  hovered === "contacts" || selected === "contacts"
                    ? "white"
                    : "#9ca3af",
              }}
            >
              Contacts
            </span>
          </li>
        </Link>
        {/* <h1
          style={{ fontSize: "16px" }}
          className={`text-gray-400 font-sans px-8 pt-1 ${
            isMinimized ? "hidden" : "block"
          } `}
        >
          Services
        </h1>
        <li
          className="mt-3 py-2 px-8 text-gray-400 cursor-pointer flex items-center w-full transition-colors duration-300 ease-in-out relative"
          onMouseOver={() => setHovered("foods")}
          onMouseOut={() => setHovered(null)}
          onClick={() => handleItemClick("foods")}
        >
          {selected === "foods" && (
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-green-500" />
          )}
          <div
            className="mr-5 rounded-md transition-colors duration-300 ease-in-out"
            style={{ backgroundColor: "#2B3138" }}
          >
            <FastfoodIcon
              style={{ color: "#33C92D", fontSize: "1.7rem", lineHeight: "1" }}
              className="p-1"
            />
          </div>
          <span
            className={`transition-all ease-in-out duration-500 ${
              isMinimized ? "hidden" : "block"
            }`}
            style={{
              fontSize: "16px",
              color:
                hovered === "foods" || selected === "foods"
                  ? "white"
                  : "#9ca3af",
            }}
          >
            Foods
          </span>
          <div
            className={`ml-auto cursor-pointer ${
              isMinimized ? "hidden" : "block"
            }`}
            onClick={() => toggleExpansion("foods")}
          >
            {expanded.foods ? (
              <KeyboardArrowDownIcon style={{ color: "#33C92D" }} />
            ) : (
              <KeyboardArrowLeftIcon style={{ color: "#33C92D" }} />
            )}
          </div>
        </li>
        {expanded.foods && (
          <ul className="mt-2 text-gray-400 text-xs">
            <Link to="food/food-list">
              <li className="py-2 px-8 cursor-pointer hover:bg-gray-700 transition-colors duration-300 ease-in-out">
                <KeyboardArrowRightIcon className="mr-5 ml-2" />
                Food List
              </li>
            </Link>

            <Link to="food/category">
              <li className="py-2 px-8 cursor-pointer hover:bg-gray-700 transition-colors duration-300 ease-in-out">
                <KeyboardArrowRightIcon className="mr-5 ml-2" />
                Category
              </li>
            </Link>
          </ul>
        )} */}

        <h1
          style={{ fontSize: "16px" }}
          className={`text-gray-400 font-sans px-8 pt-1 ${
            isMinimized ? "hidden" : "block"
          } `}
        >
          User
        </h1>
        {/* User Profile */}
        <Link to="profile">
          <li
            className="mt-3 py-2 px-8 text-gray-400 cursor-pointer flex items-center w-full transition-colors duration-300 ease-in-out relative"
            onMouseOver={() => setHovered("profile")}
            onMouseOut={() => setHovered(null)}
            onClick={() => handleItemClick("profile")}
            style={{
              backgroundColor:
                hovered === "profile" || selected === "profile"
                  ? "#161621"
                  : "transparent",
            }}
          >
            {selected === "profile" && (
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-[#D1B1D3]" />
            )}
            <div
              className="mr-5 rounded-md transition-colors duration-300 ease-in-out"
              style={{ backgroundColor: "#2B3138" }}
            >
              <PersonIcon
                style={{
                  color: "#C8A2C8",
                  fontSize: "1.7rem",
                  lineHeight: "1",
                }}
                className="p-1"
              />
            </div>
            <span
              className={`transition-all ease-in-out duration-500 ${
                isMinimized ? "hidden" : "block"
              }`}
              style={{
                fontSize: "16px",
                color:
                  hovered === "profile" || selected === "profile"
                    ? "white"
                    : "#9ca3af",
              }}
            >
              Profile
            </span>
          </li>
        </Link>

        {/* Logout */}
        <li
          className="mt-3 py-2 px-8 text-gray-400 cursor-pointer flex items-center w-full transition-colors duration-300 ease-in-out relative"
          onMouseOver={() => setHovered("logout")}
          onMouseOut={() => setHovered(null)}
          onClick={handleLogout}
          style={{
            backgroundColor:
              hovered === "logout" || selected === "logout"
                ? "#161621"
                : "transparent",
          }}
        >
          {selected === "logout" && (
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-[#D1B1D3]" />
          )}
          <div
            className="mr-5 rounded-md transition-colors duration-300 ease-in-out"
            style={{ backgroundColor: "#2B3138" }}
          >
            <LogoutIcon
              style={{
                color: "#C8A2C8",
                fontSize: "1.7rem",
                lineHeight: "1",
              }}
              className="p-1"
            />
          </div>
          <span
            className={`transition-all ease-in-out duration-500 ${
              isMinimized ? "hidden" : "block"
            }`}
            style={{
              fontSize: "16px",
              color:
                hovered === "logout" || selected === "logout"
                  ? "white"
                  : "#9ca3af",
            }}
          >
            Logout
          </span>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
