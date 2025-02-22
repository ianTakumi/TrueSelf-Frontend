import React, { useState } from "react";
import "./Profile.css";
import {
  getUser,
  getRandomColor,
  notifySuccess,
  notifyError,
  setUser,
  formatDate,
} from "../../utils/helpers";
import ChangePasswordModal from "../components/user/modals/ChangePassword";
import ProfileModal from "../components/user/modals/Profile";
import { IconButton } from "@mui/material";
import { Facebook, Google } from "@mui/icons-material";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";

import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import AxiosInstance from "../../utils/AxiosInstance";
import Swal from "sweetalert2";

const Profile = () => {
  const user = getUser();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "?";
  const backgroundColor = getRandomColor();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleOpenPasswordModal = () => {
    setIsPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLinkGoogleAccount = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse?.credential);
    const userId = user._id;
    const clean_data = {
      provider_id: decoded.sub,
    };
    console.log(clean_data);
    await AxiosInstance.put(`/auth/googleLinkAccount/${userId}`, clean_data)
      .then((response) => {
        if (response.status === 200) {
          notifySuccess("Successfully linked");
          setUser(response.data);
        } else {
          notifyError("Something went wrong");
        }
      })
      .catch((error) => {
        console.error("Error linking google account", error);
        notifyError("Failed to link Google account.");
      });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if the file is an image
      if (!file.type.startsWith("image/")) {
        notifyError("Please select a valid image file.");
        return;
      }

      const userId = user._id;
      const formData = new FormData();
      formData.append("profilePicture", file);
      AxiosInstance.put(`/users/update-profile-picture/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((res) => {
        setUser(res.data);
        notifySuccess("Profile picture updated");
        window.location.reload();
        console.log("Profile picture updated");
      });
      setSelectedFile(file);
    }
  };

  const handleDeleteAccount = async () => {
    Swal.fire({
      title: "Are you sure you want to delete your account?",
      html: `This action is <b>permanent</b> and cannot be undone. 
             <br><br>Under the <b>Data Privacy Act of the Philippines</b>, 
             you have the right to request data deletion. However, some 
             records may be retained for legal or security purposes.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete my account",
      cancelButtonText: "Cancel",
      // showDenyButton: true,
      // denyButtonText: "Request Data Export",
    }).then((result) => {
      if (result.isConfirmed) {
        // Call API to delete account
        Swal.fire(
          "Deleted!",
          "Your account has been permanently deleted.",
          "success"
        );
      } else if (result.isDenied) {
        // Call API to export user data
        Swal.fire(
          "Request Sent",
          "We will provide you with a copy of your data.",
          "info"
        );
      }
    });
  };
  return (
    <div className="profile-page h-screen mt-5">
      <div className="curves curve-top-right"></div>
      <div className="curves curve-bottom-left"></div>

      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header flex flex-col items-center mb-3 ">
          <div
            className="profile-avatar w-24 h-24 flex justify-center items-center text-white text-4xl font-bold rounded-full mb-4 relative"
            style={{
              backgroundColor: user.profile?.url
                ? "transparent"
                : backgroundColor, // Transparent if profile.url has a value
            }}
          >
            {user.profile?.url && user.profile?.public_id ? (
              // Display the profile picture if URL and public_id are present
              <img
                src={user.profile.url}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              // Display the fallback avatar with the initial
              <>{initial}</>
            )}

            {/* Always display the camera icon */}
            <IconButton
              sx={{
                position: "absolute",
                bottom: "5px", // Position it slightly above the bottom edge
                right: "5px", // Position it slightly left of the right edge
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                },
              }}
            >
              <CameraAltIcon />
              {/* File Input to select images */}
              <input
                type="file"
                accept="image/*" // Restrict file types to images
                onChange={handleFileChange} // Handle file change
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                  cursor: "pointer",
                }}
              />
            </IconButton>
          </div>

          <h2 className="profile-name text-2xl font-semibold">{user.name}</h2>
        </div>

        {/* Profile Card */}
        <div className="profile-card">
          <div className="card-header">
            <h2 className="card-title">{user.name}</h2>
            <p className="card-subtitle">{user.pronouns}</p>
            <span className="user-status">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)} -{" "}
              {user.status}
            </span>
          </div>

          <div className="card-info">
            <div>
              <p className="info-label">Email:</p>
              <p className="info-value">{user.email}</p>
            </div>
            <div>
              <p className="info-label">Phone:</p>
              <p className="info-value">{user.phoneNumber}</p>
            </div>
            <div>
              <p className="info-label">Gender Identity:</p>
              <p className="info-value">{user.genderIdentity}</p>
            </div>
            <div>
              <p className="info-label">Sexual Orientation:</p>
              <p className="info-value">{user.sexualOrientation}</p>
            </div>
            <div className="info-full">
              <p className="info-label">Date of Birth:</p>
              <p className="info-value">
                {new Date(user.dob).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="card-buttons">
            <button className="btn-primary" onClick={handleOpenPasswordModal}>
              Change Password
            </button>
            <button className="btn-secondary" onClick={handleEditProfile}>
              Update Profile
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {isPasswordModalOpen && (
        <ChangePasswordModal
          isOpen={isPasswordModalOpen}
          onClose={handleClosePasswordModal}
        />
      )}

      {isModalOpen && (
        <ProfileModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          user={user}
        />
      )}
    </div>
  );
};

export default Profile;
