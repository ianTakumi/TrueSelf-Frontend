import React, { useState } from "react";
import { EditOutlined } from "@mui/icons-material";
import { Typography, Paper, Avatar, Box, IconButton } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import {
  getUser,
  formatDate,
  notifySuccess,
  notifyError,
  setUser,
} from "../../../utils/helpers";
import ProfileModal from "../../components/admin/modals/Profile.modal";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import ChangePasswordModal from "../../components/admin/modals/ChangePassword.modal";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import AxiosInstance from "../../../utils/AxiosInstance";
import { Facebook, Google } from "@mui/icons-material";
const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const user = getUser();

  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenPasswordModal = () => {
    setIsPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  const handleLinkFacebookAccount = async () => {
    console.log("Linking Facebook account");
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

  // Handle file input change
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

  return (
    <Box className="container" sx={{ maxWidth: "xl", marginTop: 3 }}>
      {/* Page Header */}
      <Box display="flex" justifyContent="space-between" mb={4}>
        <h1 className="font-bold text-2xl">Admin Profile</h1>

        <Typography variant="body2" color="text.secondary">
          <span className="text-blue-500 hover:underline">Home</span> /
          <span> Profile</span>
        </Typography>
      </Box>

      {/* Profile Information Section */}
      <Paper elevation={3} sx={{ padding: 3, width: "100%", borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            {/* Profile Image with Camera Icon */}
            <Box
              sx={{
                position: "relative",
                width: 96,
                height: 96,
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid #ccc",
              }}
            >
              <Avatar
                alt="Profile"
                src={user.profile.url}
                sx={{ width: "100%", height: "100%" }}
              />
              {/* Camera Icon */}
              <IconButton
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
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
            </Box>
            {/* User Details */}
            <Box>
              <h6 className="font-semibold text-xl">{user.name || "Admin"}</h6>
              <p className="text-gray-400">{user?.email}</p>
              <p className="text-gray-500">Administrator</p>
            </Box>
          </Box>
          {/* Edit Profile Button */}
          <IconButton onClick={handleEditProfile} color="primary">
            <EditOutlined />
          </IconButton>
        </Box>
      </Paper>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Profile detail card */}
        <div className="bg-gradient-to-r from-white to-gray-100 shadow-lg rounded-xl p-6 w-full max-w-full mx-auto">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
            Profile Details
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700">
              <strong className="font-semibold">Name:</strong>{" "}
              {user?.name || "N/A"}
            </p>
            <p className="text-gray-700">
              <strong className="font-semibold">Date of Birth:</strong>{" "}
              {user?.dob ? formatDate(user.dob) : "N/A"}
            </p>
            <p className="text-gray-700">
              <strong className="font-semibold">Email:</strong>{" "}
              {user?.email || "N/A"}
            </p>
            <p className="text-gray-700">
              <strong className="font-semibold">Phone:</strong>{" "}
              {user?.phoneNumber || "N/A"}
            </p>
          </div>
          <div className="flex justify-center mt-6">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md transition hover:bg-red-600 hover:scale-105"
              onClick={handleOpenPasswordModal}
            >
              Change Password
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-white to-gray-100 shadow-lg rounded-xl p-6 w-full max-w-md mx-auto">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
            Linked Accounts
          </h2>
          {/* Facebook Section */}
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm mb-3">
            <div className="flex items-center space-x-3">
              <Facebook className="text-blue-600" fontSize="large" />
              <p className="text-gray-700">
                <strong>Facebook:</strong>
              </p>
            </div>
            {user?.socialAccounts?.find(
              (account) => account.provider === "facebook"
            ) ? (
              <button className="border border-blue-500 text-blue-500 px-3 py-1 rounded-lg hover:bg-blue-500 hover:text-white transition">
                Already Linked
              </button>
            ) : (
              <button
                onClick={handleLinkFacebookAccount} // Implement this function
                className="border border-blue-500 text-blue-500 px-3 py-1 rounded-lg hover:bg-blue-500 hover:text-white transition"
              >
                Link Facebook
              </button>
            )}
          </div>
          {/* Google Section */}
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm">
            <div className="flex items-center space-x-3">
              <Google className="text-red-500" fontSize="large" />
              <p className="text-gray-700">
                <strong>Google:</strong>
              </p>
            </div>
            {user?.socialAccounts?.find(
              (account) => account.provider === "google"
            ) ? (
              <button className="border border-green-500 text-green-500 px-3 py-1 rounded-lg hover:bg-green-500 hover:text-white transition">
                Already Linked
              </button>
            ) : (
              <GoogleLogin
                onSuccess={handleLinkGoogleAccount}
                onError={() => {
                  console.error("Google login failed");
                  alert("Failed to authenticate with Google.");
                }}
              />
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ProfileModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          user={user}
        />
      )}
      {isPasswordModalOpen && (
        <ChangePasswordModal
          isOpen={isPasswordModalOpen}
          onClose={handleClosePasswordModal}
        />
      )}
    </Box>
  );
};

export default Profile;
