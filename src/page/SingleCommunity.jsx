import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AxiosInstance from "../../utils/AxiosInstance";
import { notifyError } from "../../utils/helpers";
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
  Favorite,
  ChatBubbleOutline,
  Share,
  Image,
  VideoLibrary,
} from "@mui/icons-material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useForm, Controller } from "react-hook-form";

const SingleCommunity = () => {
  const { handleSubmit, control, register, setValue } = useForm({
    defaultValues: {
      title: "",
      content: "",
    },
  });
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [posts, setPosts] = useState([]);
  const [postType, setPostType] = useState("text");
  const [postContent, setPostContent] = useState("");
  const [postMedia, setPostMedia] = useState(null);

  const fetchPost = async () => {
    try {
      const res = await AxiosInstance.get(`/posts/${id}`);
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

  useEffect(() => {
    fetchCommunity();
    fetchPost();
  }, [id]);

  const handlePostSubmit = handleSubmit(async (data) => {
    console.log(postType);
    if (postType === "text") {
      console.log(data);
      await AxiosInstance.post("/posts");
    }
    // if (!data.title.trim() || !data.content.trim()) {
    //   notifyError("Title and content are required.");
    //   return;
    // }

    // try {
    //   const payload = {
    //     title: data.title,
    //     content: data.content,
    //     type: postType, // Ensure the type is included
    //   };

    //   const res = await AxiosInstance.post(`/posts/${id}`, payload);

    //   notifySuccess("Post created successfully!");
    //   fetchPost(); // Refresh posts after submission

    //   // Reset form fields
    //   setValue("title", "");
    //   setValue("content", "");
    // } catch (error) {
    //   notifyError("Failed to create post. Please try again.");
    // }
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
      {/* Banner */}
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

          {postType === "text" && (
            <>
              <TextField
                {...register("title", { required: "Title is required" })}
                placeholder="Enter title"
                variant="outlined"
                fullWidth
                margin="normal"
              />

              <Controller
                name="content"
                control={control}
                rules={{ required: "Content is required" }}
                render={({ field }) => <ReactQuill theme="snow" {...field} />}
              />
            </>
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
                        post.author?.profilePic ||
                        "https://via.placeholder.com/50"
                      }
                    />
                  }
                  title={post.author?.name || "Unknown User"}
                  subheader={new Date(post.createdAt).toLocaleString()}
                />
                <CardContent>
                  <Typography variant="body1">{post.content}</Typography>
                </CardContent>
                {post.image && (
                  <CardMedia
                    component="img"
                    height="300"
                    image={post.image}
                    alt="Post Image"
                  />
                )}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  px={2}
                  py={1}
                >
                  <IconButton>
                    <Favorite />
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
