import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { notifyError, notifySuccess, getUser } from "../../../../utils/helpers";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  MenuItem,
  Avatar,
} from "@mui/material";
import AxiosInstance from "../../../../utils/AxiosInstance";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { modules } from "../../../configs/ReactQuill.config";

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileEncode);

const CommunityModal = ({
  onClose,
  communityToEdit,
  isEditing,
  fetchCommunities,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const user = getUser();
  const [profileFiles, setProfileFiles] = useState([]);
  const [bannerFiles, setBannerFiles] = useState([]);
  const [content, setContent] = useState(communityToEdit?.rules || "");

  useEffect(() => {
    if (communityToEdit) {
      reset({
        name: communityToEdit.name,
        email: communityToEdit.email,
        phone: communityToEdit.phone,
        subject: communityToEdit.subject,
        body: communityToEdit.message,
        status: communityToEdit.status,
      });

      if (communityToEdit.profileImage) {
        setProfileFiles([
          {
            source: communityToEdit.profileImage,
            options: { type: "local" },
          },
        ]);
      }

      if (communityToEdit.bannerImage) {
        setBannerFiles([
          {
            source: communityToEdit.bannerImage,
            options: { type: "local" },
          },
        ]);
      }
    }
  }, [communityToEdit, reset]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("mission", data.mission);
    formData.append("rules", content);

    if (isEditing) {
      formData.append("status", data.status);
    }

    if (profileFiles[0]) {
      formData.append("profile", profileFiles[0].file);
    }

    if (bannerFiles[0]) {
      formData.append("banner", bannerFiles[0].file);
    }

    console.log(formData);
    try {
      if (isEditing) {
        const res = await AxiosInstance.put(
          `/spaces/${communityToEdit._id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (res.status === 200) {
          notifySuccess("Community updated successfully");
          fetchCommunities();
          onClose();
        }
      } else {
        const res = await AxiosInstance.post(`/spaces/${user._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.status === 201) {
          notifySuccess("Community created successfully");
          fetchCommunities();
          onClose();
        }
      }
    } catch (error) {
      notifyError("Failed to create community");
      console.error(error);
    }
  };

  const options = [
    { value: "Pending", label: "Pending" },
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
    { value: "Suspended", label: "Suspended" },
    { value: "Archived", label: "Archived" },
  ];

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent>
        <Typography variant="h6" component="h2" gutterBottom>
          {isEditing ? "Edit Community" : "Add Community"}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                id="name"
                label="Name"
                variant="outlined"
                fullWidth
                InputProps={{ readOnly: isEditing ? true : false }}
                {...register("name")}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                id="description"
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={1}
                InputProps={{ readOnly: isEditing ? true : false }}
                {...register("description")}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                id="mission"
                label="Mission"
                variant="outlined"
                fullWidth
                multiline
                rows={1}
                InputProps={{ readOnly: isEditing ? true : false }}
                {...register("mission")}
              />
            </Grid>

            <Grid item xs={12}>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
              />
            </Grid>

            {isEditing && (
              <Grid item xs={12}>
                <TextField
                  id="createdBy"
                  label="Created By"
                  variant="outlined"
                  fullWidth
                  InputProps={{ readOnly: true }}
                  {...register("createdBy")}
                />
              </Grid>
            )}

            {/* Profile Image Upload */}
            <Grid item xs={12}>
              <Typography variant="body1">Profile Image</Typography>
              <FilePond
                files={profileFiles}
                onupdatefiles={setProfileFiles}
                allowMultiple={false}
                name="profileImage"
                labelIdle="Drag & Drop your profile image or <span class='filepond--label-action'>Browse</span>"
              />
            </Grid>

            {/* Banner Image Upload */}
            <Grid item xs={12}>
              <Typography variant="body1">Banner Image</Typography>
              <FilePond
                files={bannerFiles}
                onupdatefiles={setBannerFiles}
                allowMultiple={false}
                name="bannerImage"
                labelIdle="Drag & Drop your banner image or <span class='filepond--label-action'>Browse</span>"
              />
            </Grid>
          </Grid>

          <DialogActions>
            <Button
              onClick={onClose}
              color="inherit"
              variant="outlined"
              sx={{
                borderColor: "grey.400",
                color: "grey.600",
                "&:hover": {
                  borderColor: "grey.500",
                  backgroundColor: "grey.100",
                },
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              color="success"
              variant="outlined"
              sx={{
                borderColor: "green.500",
                color: "green.600",
                "&:hover": {
                  borderColor: "green.600",
                  backgroundColor: "green.50",
                },
              }}
            >
              {isEditing ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CommunityModal;
