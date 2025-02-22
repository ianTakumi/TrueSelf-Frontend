import React, { useState } from "react";
import { Menu } from "@mui/icons-material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { logout, getUser } from "../../../utils/helpers";
import { useNavigate, NavLink } from "react-router-dom";
import Swal from "sweetalert2";

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const user = getUser();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    setIsDropdownOpen(false);
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
    }).then((result) => {
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
    <nav className="text-white flex items-center justify-center py-2 px-4 bg-white">
      <div className="ml-auto flex items-center w-full ">
        {/* Menu Icon */}
        <button
          onClick={toggleSidebar}
          className="text-black mr-4 cursor-pointer"
        >
          <Menu
            style={{ fontSize: "30px" }}
            className="text-gray-400 mb-1 ml-2 "
          />
        </button>
        {/* Right Side Icons */}
        <div className="flex items-center ml-auto space-x-4">
          <NavLink to={"/admin/email"}>
            <button className="text-black">
              <EmailOutlinedIcon style={{ fontSize: "20px" }} />
            </button>
          </NavLink>

          <div className="relative">
            <button
              onClick={toggleProfileDropdown}
              className="text-black flex items-center gap-3"
            >
              <img
                src={user.profile.url}
                alt="User Profile Pic"
                className="rounded-full w-12 h-12"
              />
              <span>{user.name}</span>
              <KeyboardArrowDownOutlinedIcon style={{ fontSize: "15px" }} />
            </button>
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-50">
                <NavLink to={"/admin/profile"}>
                  <button className="flex gap-4 px-4 py-3 text-gray-700 justify-between hover:bg-gray-100 w-full text-left">
                    <span className="text-gray-700">Profile</span>
                    <PersonOutlineOutlinedIcon style={{ fontSize: "18px" }} />
                  </button>
                </NavLink>

                <button
                  className="flex gap-4 px-4 py-3 text-gray-700 justify-between hover:bg-gray-100 w-full text-left"
                  onClick={handleLogout}
                >
                  <span className="text-gray-700">Logout</span>
                  <LogoutOutlinedIcon style={{ fontSize: "18px" }} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
