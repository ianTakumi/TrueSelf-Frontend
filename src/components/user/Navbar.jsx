import React, { useState, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { NavLink, useNavigate } from "react-router-dom";
import { getUser, logout } from "../../../utils/helpers";
import Swal from "sweetalert2";
import {
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  Box,
} from "@mui/material";

const Navbar = () => {
  const user = getUser();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [dropdowns, setDropdowns] = useState({ foods: false });

  const colors = {
    active: "#A3DCE4", // Light Blue (from your palette)
    inactive: "#D6D5E0", // Light Purple (from your palette)
    hover: "#FAD9C1", // Peach (from your palette)
    pink: "#C8A2C8",
  };

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const toggleDropdown = (dropdown) => {
    setDropdowns((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  const handleResize = () => {
    if (window.innerWidth >= 768) {
      closeSidebar();
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
    <nav
      style={{
        background: "#FAFAFA",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 10,
        padding: "16px",
        borderBottom: "1px solid #E0E0E0",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <div className="flex items-center justify-center space-x-3">
          <img
            src="/logo/trueself5.png"
            className="w-10 h-10 object-cover"
            alt=""
          />
          <h5
            className="text-black font-semibold  font-raleway  "
            style={{ color: colors.pink }}
          >
            True Self
          </h5>
        </div>

        <div className="md:hidden">
          <IconButton onClick={toggleSidebar}>
            {isOpen ? (
              <CloseIcon style={{ color: "white" }} />
            ) : (
              <MenuIcon style={{ color: "#F1C40F" }} />
            )}
          </IconButton>
        </div>

        {/* Desktop Navigation */}
        <Box className="hidden md:flex space-x-4 items-center">
          {["/", "/about", "/contact"].map((path) => (
            <NavLink
              key={path}
              to={path}
              className={() =>
                `px-4 py-2 font-bold transition-colors duration-200 cursor-pointer text-black`
              }
              onMouseEnter={(e) => {
                e.target.classList.add("text-purple-400", "underline");
              }}
              onMouseLeave={(e) => {
                e.target.classList.remove("text-purple-400", "underline");
              }}
            >
              {path === "/"
                ? "Home"
                : path.substring(1).charAt(0).toUpperCase() + path.slice(2)}
            </NavLink>
          ))}

          {/* Foods Dropdown for Desktop */}
          {/* <Box
            className="relative"
            onMouseEnter={() => setDropdowns({ ...dropdowns, foods: true })}
          >
            <Button
              variant="text"
              style={{ color: "white", fontWeight: "bold" }}
              onClick={() => toggleDropdown("foods")}
            >
              Foods
              <KeyboardArrowDownIcon />
            </Button>
            {dropdowns["foods"] && (
              <Box
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  backgroundColor: "#2E2E2E",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  zIndex: 10,
                }}
              >
                <List>
                  <ListItem button component={NavLink} to="/food/category">
                    <ListItemText
                      primary="Categories"
                      sx={{ color: "white" }}
                    />
                  </ListItem>
                  <ListItem button component={NavLink} to="/foods">
                    <ListItemText primary="Foods" sx={{ color: "white" }} />
                  </ListItem>
                </List>
              </Box>
            )}
          </Box> */}
        </Box>

        {/* Search and Profile Icons */}
        <Box
          display="flex"
          alignItems="center"
          className="hidden md:flex space-x-4 relative"
        >
          <IconButton
            onClick={() => {
              if (user) {
                setProfileDropdown((prev) => !prev);
              } else {
                navigate("/login");
              }
            }}
          >
            <PersonIcon style={{ color: colors.pink }} />
          </IconButton>
          {profileDropdown && user && (
            <Box
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                zIndex: 10,
                width: "200px",
              }}
            >
              <List>
                <ListItem button component={NavLink} to="/profile">
                  <ListItemText primary="Profile" sx={{ color: "black" }} />
                </ListItem>
                <ListItem button component={NavLink} to="/community">
                  <ListItemText primary="Community" sx={{ color: "black" }} />
                </ListItem>
                <ListItem button component={NavLink} to="/mood">
                  <ListItemText
                    primary="Mood Tracker"
                    sx={{ color: "black" }}
                  />
                </ListItem>
                <ListItem button component={NavLink} to="/myDiary">
                  <ListItemText primary="My Journal" sx={{ color: "black" }} />
                </ListItem>

                <ListItem button component={NavLink} to="/test-anxiety">
                  <ListItemText
                    primary="Anxiety Test"
                    sx={{ color: "black" }}
                  />
                </ListItem>

                <ListItem button onClick={handleLogout}>
                  <ListItemText primary="Logout" sx={{ color: "black" }} />
                </ListItem>
              </List>
            </Box>
          )}
        </Box>
      </Box>

      {/* Mobile Sidebar */}
      <Drawer anchor="left" open={isOpen} onClose={closeSidebar}>
        <Box display="flex" justifyContent="flex-end" p={2}>
          <IconButton onClick={toggleSidebar}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {["/", "/about", "/contact", "/movies"].map((path) => (
            <ListItem
              button
              component={NavLink}
              key={path}
              to={path}
              onClick={closeSidebar}
            >
              <ListItemText
                primary={
                  path === "/"
                    ? "Home"
                    : path.substring(1).charAt(0).toUpperCase() + path.slice(2)
                }
              />
            </ListItem>
          ))}
          <Box>
            <Button onClick={() => toggleDropdown("foods")} fullWidth>
              Foods
              {dropdowns["foods"] ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </Button>
            {dropdowns["foods"] && (
              <List>
                <ListItem
                  button
                  component={NavLink}
                  to="/food/category"
                  onClick={closeSidebar}
                >
                  <ListItemText primary="Categories" />
                </ListItem>
                <ListItem
                  button
                  component={NavLink}
                  to="/foods"
                  onClick={closeSidebar}
                >
                  <ListItemText primary="Foods" />
                </ListItem>
              </List>
            )}
          </Box>
          <Divider />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            mt={2}
          >
            <IconButton>
              <SearchIcon style={{ color: "#F1C40F" }} />
            </IconButton>
            <NavLink to="/login">
              <IconButton>
                <PersonIcon style={{ color: "#F1C40F" }} />
              </IconButton>
            </NavLink>
          </Box>
        </List>
      </Drawer>
    </nav>
  );
};

export default Navbar;
