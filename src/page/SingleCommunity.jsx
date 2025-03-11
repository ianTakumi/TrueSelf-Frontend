import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AxiosInstance from "../../utils/AxiosInstance";
import { getUser, notifyError, notifySuccess } from "../../utils/helpers";
import {
  CircularProgress,
  Box,
  Typography,
  Avatar,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  IconButton,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import {
  ChatBubbleOutline,
  Share,
  ThumbDown,
  ThumbUp,
} from "@mui/icons-material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useForm, Controller } from "react-hook-form";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileEncode);

const SingleCommunity = () => {
  const user = getUser();
  const userId = user?._id;
  const { handleSubmit, control, register, setValue } = useForm({
    defaultValues: {
      title: "",
      content: "",
    },
  });
  const [files, setFiles] = useState([]);
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [posts, setPosts] = useState([]);
  const [postType, setPostType] = useState("text");

  const fetchPost = async () => {
    try {
      const res = await AxiosInstance.get(`/posts/community/${id}`);
      console.log(res.data);
      setPosts(res.data.data);
    } catch (error) {
      notifyError("Failed to fetch posts. Please try again.");
    }
  };

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

  const handleLikePost = async () => {};

  useEffect(() => {
    fetchCommunity();
    fetchPost();
  }, [id]);

  const handlePostSubmit = handleSubmit(async (data) => {
    console.log(postType);

    const cleanedData = {
      ...data,
      type: postType,
      id: id,
    };

    if (postType === "text") {
      console.log(cleanedData);
      await AxiosInstance.post(`/posts/${userId}`, cleanedData).then((res) => {
        console.log(res.data);
        notifySuccess("Post created successfully!");
        setValue("title", "");
        setValue("content", "");
        fetchPost();
      });
    } else if (postType === "image" || postType === "video") {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("type", postType);
      formData.append("id", id);
      files.forEach((file) => {
        formData.append("media", file.file);
      });

      await AxiosInstance.post(`/posts/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((res) => {
        console.log(res.data);
        notifySuccess("Post created successfully!");
        setValue("title", "");
        setFiles([]);
        fetchPost();
      });
    }
  });

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

  if (!community) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h6" color="error">
          Community not found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box width="100%" maxWidth="800px" margin="auto">
      <Box position="relative">
        <img
          src={community.banner?.url || "https://via.placeholder.com/800x300"}
          alt="Community Banner"
          style={{
            width: "100%",
            height: "300px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
        <Avatar
          src={community.profile?.url || "https://via.placeholder.com/100"}
          sx={{
            width: 120,
            height: 120,
            position: "absolute",
            bottom: -40,
            left: 20,
            border: "4px solid white",
          }}
        />
      </Box>

      {/* Community Info */}
      <Box mt={6} mb={2} px={2}>
        <Typography variant="h4" fontWeight="bold">
          {community.name}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {community.description}
        </Typography>
        <Typography variant="body2" color="textSecondary" mt={1}>
          <strong>Status:</strong> {community.status} |{" "}
          <strong>Members:</strong> {community.members?.length || 0}
        </Typography>
      </Box>

      {/* Tabs: About & Posts */}
      <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} centered>
        <Tab label="About" />
        <Tab label="Posts" />
      </Tabs>

      <Divider />

      {/* Create Post Section */}
      {tab === 1 && (
        <Card sx={{ mb: 3, p: 2 }} component="form" onSubmit={handlePostSubmit}>
          <TextField
            select
            fullWidth
            value={postType}
            onChange={(e) => setPostType(e.target.value)}
            variant="outlined"
          >
            <MenuItem value="text">Text Post</MenuItem>
            <MenuItem value="image">Image</MenuItem>
            <MenuItem value="video">Video</MenuItem>
          </TextField>

          <TextField
            {...register("title", { required: "Title is required" })}
            placeholder="Enter title"
            variant="outlined"
            fullWidth
            margin="normal"
          />

          {postType === "text" && (
            <>
              <Controller
                name="content"
                control={control}
                rules={{ required: "Content is required" }}
                render={({ field }) => <ReactQuill theme="snow" {...field} />}
              />
            </>
          )}

          {(postType === "image" || postType === "video") && (
            <div className="mt-10">
              <h1>Attachment</h1>
              <FilePond
                files={files}
                onupdatefiles={setFiles}
                allowMultiple={true}
                maxFiles={5}
                name="files"
                labelIdle='Drag & Drop your files or <span className="filepond--label-action">Browse</span>'
                allowFileEncode={true}
                acceptedFileTypes={["image/*", "video/*", "application/pdf"]}
                className="mt-2"
              />
            </div>
          )}

          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button variant="contained" type="submit">
              Post
            </Button>
          </Box>
        </Card>
      )}

      {/* About Section */}
      {tab === 0 && (
        <Box p={3} mb={10}>
          <Typography variant="h6">About This Community</Typography>
          <Typography variant="body1" mt={1}>
            {community.description}
          </Typography>
        </Box>
      )}

      {/* Posts Section */}
      {tab === 1 && (
        <Box mt={3}>
          {posts.length === 0 ? (
            <Typography variant="body1" textAlign="center">
              No posts yet.
            </Typography>
          ) : (
            posts.map((post) => (
              <Card key={post._id} sx={{ mb: 2 }}>
                <CardHeader
                  avatar={
                    <Avatar
                      src={
                        post.user?.profile.url ||
                        "https://via.placeholder.com/50"
                      }
                    />
                  }
                  title={post.user?.name || "Unknown User"}
                  subheader={new Date(post.createdAt).toLocaleString("en-US", {
                    month: "long",
                    day: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                />
                <CardContent>
                  <Typography
                    variant="body1"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </CardContent>

                {post.images &&
                  post.images.length > 0 &&
                  post.images.map((img, index) => (
                    <CardMedia
                      key={index}
                      component="img"
                      sx={{
                        width: "100%", // Full width
                        maxHeight: 400, // Limit height
                        objectFit: "contain", // Ensures the full image is visible
                        borderRadius: 2, // Optional rounded corners
                      }}
                      image={img.url}
                      alt={`Post Image ${index + 1}`}
                    />
                  ))}

                {post.video && (
                  <CardMedia
                    component="video"
                    controls
                    sx={{
                      height: 300, // Set a fixed height
                      objectFit: "cover", // Ensures the video fits well
                      borderRadius: 2, // Optional: adds rounded corners
                    }}
                    src={post.video.url} // Make sure post.video contains { url, public_id }
                  />
                )}

                {/* Icons Section - Aligned and Closer */}
                <Box display="flex" justifyContent="center" gap={1.5} py={1}>
                  <IconButton>
                    <ThumbUp />
                  </IconButton>
                  <IconButton>
                    <ThumbDown /> {/* Dislike Button */}
                  </IconButton>
                  <IconButton>
                    <ChatBubbleOutline />
                  </IconButton>
                  <IconButton>
                    <Share />
                  </IconButton>
                </Box>
              </Card>
            ))
          )}
        </Box>
      )}
    </Box>
  );
};

export default SingleCommunity;
