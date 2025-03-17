import React, { useState, useEffect } from "react";
import AxiosInstance from "../../utils/AxiosInstance";
import { notifyError, notifySuccess, getUser } from "../../utils/helpers";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { modules } from "../configs/ReactQuill.config";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";

import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import {
  Tabs,
  Tab,
  Box,
  CircularProgress,
  TextField,
  Paper,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import GavelOutlined from "@mui/icons-material/GavelOutlined";
import { useNavigate } from "react-router-dom";

registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginFileEncode,
  FilePondPluginFileValidateType
);

const CreatePost = () => {
  const user = getUser();
  const userId = user._id;
  const { id } = useParams();
  const [tabIndex, setTabIndex] = useState(0);
  const [community, setCommunity] = useState({});
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const [submitLoading, setSubmitLoading] = useState(false);

  const { handleSubmit, control, register, setValue } = useForm({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const handlePostSubmit = handleSubmit(async (data) => {
    setSubmitLoading(true);
    const postType =
      tabIndex === 0 ? "text" : tabIndex === 1 ? "image" : "video";

    const cleanedData = {
      type: postType,
      id: id,
      title: data.title,
      content: content,
    };

    if (postType === "text") {
      console.log(cleanedData);
      await AxiosInstance.post(`/posts/${userId}`, cleanedData).then((res) => {
        console.log(res.data);
        notifySuccess("Post created successfully!");
        setValue("title", "");
        setValue("content", "");
        setSubmitLoading(false);
        navigate(`/community/${id}`);
      });
    } else if (postType === "image" || postType === "video") {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("type", postType);
      formData.append("id", id);
      files.forEach((file) => {
        formData.append("media", file.file);
      });
      console.log(formData);
      await AxiosInstance.post(`/posts/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((res) => {
        setSubmitLoading(false);
        console.log(res.data);

        notifySuccess("Post created successfully!");
        setValue("title", "");
        setFiles([]);
        navigate(`/community/${id}`);
      });
    }
  });

  const fetchCommunity = async () => {
    try {
      const res = await AxiosInstance.get(`/spaces/${id}`);
      setCommunity(res.data.data);
    } catch (error) {
      notifyError("Failed to fetch community. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunity();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="min-h-screen text-black flex justify-center items-start p-6">
      <div className="flex gap-6 w-full max-w-6xl">
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Create Post</h2>

          <Tabs
            value={tabIndex}
            onChange={(e, newValue) => setTabIndex(newValue)}
          >
            <Tab label="Text" />
            <Tab label="Image" />
            <Tab label="Video" />
          </Tabs>

          {tabIndex === 0 && (
            <div className="mt-10">
              <div className="mb-4">
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Title*"
                      fullWidth
                      variant="outlined"
                    />
                  )}
                />
              </div>

              <div className="mb-4">
                <label className="block font-medium mb-1">Body</label>

                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                />
              </div>
            </div>
          )}

          {tabIndex === 1 && (
            <div className="mt-10">
              <div className="mb-4">
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Title*"
                      fullWidth
                      variant="outlined"
                    />
                  )}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="">Attachment</label>
                <FilePond
                  files={files}
                  onupdatefiles={setFiles}
                  allowMultiple={true}
                  maxFiles={2}
                  name="files"
                  labelIdle='Drag & Drop your files or <span className="filepond--label-action">Browse</span>'
                  allowFileEncode={true}
                  acceptedFileTypes={["image/*", "application/pdf"]}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {tabIndex === 2 && (
            <div className="mt-10">
              <div className="mb-4">
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Title*"
                      fullWidth
                      variant="outlined"
                    />
                  )}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="videoUpload">Attachment</label>
                <FilePond
                  files={files}
                  id="videoUpload"
                  onupdatefiles={setFiles}
                  allowMultiple={false}
                  maxFiles={1}
                  name="files"
                  labelIdle='Drag & Drop your files or <span className="filepond--label-action">Browse</span>'
                  allowFileEncode={true}
                  acceptedFileTypes={["video/*"]}
                  fileValidateTypeDetectType={(source, type) =>
                    new Promise((resolve) => {
                      resolve(type || "video/mp4");
                    })
                  }
                  className="mt-2"
                />
              </div>
            </div>
          )}

          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ mt: 4, py: 1.5, borderRadius: 2, position: "relative" }}
            onClick={handlePostSubmit}
            disabled={submitLoading} // Disable button while loading
          >
            {submitLoading ? (
              <CircularProgress size={24} color="secondary" />
            ) : (
              "Post"
            )}
          </Button>
        </div>

        <Box width="35%" position="sticky" top={20} height="80vh">
          <Paper
            sx={{
              p: 3,
              maxHeight: "70vh",
              overflowY: "auto",
              bgcolor: "#f9f9f9",
              borderRadius: 2,
              boxShadow: 3,
              "&::-webkit-scrollbar": { width: "4px" },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#aaa",
                borderRadius: "10px",
              },
            }}
          >
            {/* Community Name */}
            <Box mb={2} textAlign="center">
              <Typography variant="h5" fontWeight="bold" color="primary.dark">
                {community.name}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Rules Section */}
            <Box display="flex" alignItems="center" mb={1}>
              <GavelOutlined sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6" fontWeight="bold">
                Rules
              </Typography>
            </Box>

            <Typography
              variant="body1"
              lineHeight={1.7}
              p={1.5}
              bgcolor="rgba(0, 0, 0, 0.05)"
              borderRadius={2}
              dangerouslySetInnerHTML={{ __html: community.rules }}
            />
          </Paper>
        </Box>
      </div>
    </div>
  );
};

export default CreatePost;
