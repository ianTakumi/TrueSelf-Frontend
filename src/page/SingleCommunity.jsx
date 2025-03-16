import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AxiosInstance from "../../utils/AxiosInstance";
import { getUser, notifyError, notifySuccess } from "../../utils/helpers";
import {
  CircularProgress,
  Box,
  Typography,
  Avatar,
  Paper,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  Button,
  ButtonGroup,
  Stack,
  Skeleton,
  Badge,
} from "@mui/material";
import {
  ChatBubbleOutline,
  Share,
  ThumbDown,
  ThumbUp,
  MoreVert,
  Edit,
  Delete,
  PostAdd,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import GroupIcon from "@mui/icons-material/Group";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import GavelOutlined from "@mui/icons-material/GavelOutlined";
import { Link } from "react-router-dom";

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
  const [isMember, setIsMember] = useState(false);
  const [joinLoading, setJoinLoading] = useState(true);
  const [bannerLoaded, setBannerLoaded] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  const fetchPost = async () => {
    try {
      const res = await AxiosInstance.get(`/posts/community/${id}`);
      console.log(res.data);
      if (res.data) {
        setPosts(res.data.data);
      }
    } catch (error) {
      notifyError("Failed to fetch posts. Please try again.");
    }
  };

  const fetchCommunity = async () => {
    try {
      const res = await AxiosInstance.get(`/spaces/${id}`);
      setCommunity(res.data.data);
      console.log(res.data.data);
      if (res.data.data.members.includes(userId)) {
        setIsMember(true);
      }
    } catch (error) {
      notifyError("Failed to fetch community. Please try again.");
    } finally {
      setLoading(false);
      setJoinLoading(false);
    }
  };

  const handleLikePost = async () => {};

  useEffect(() => {
    fetchCommunity();
    fetchPost();
  }, [id]);

  const handleJoinCommunity = async () => {
    setJoinLoading(true);
    try {
      const res = await AxiosInstance.get(`/spaces/join/${id}/${userId}`);
      console.log(res.data);
      notifySuccess("Joined community successfully!");
      setIsMember(true);
    } catch (error) {
      console.error("Error joining community:", error);
      notifyError("Failed to join community. Please try again.");
    } finally {
      setJoinLoading(false);
    }
  };

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
    <Box width="100%" maxWidth="1000px" margin="auto" display={"flex"} gap={10}>
      <Box width={"70%"}>
        <Box position="relative">
          {!bannerLoaded && (
            <Skeleton
              variant="rectangular"
              width="100%"
              height={300}
              sx={{ borderRadius: "8px" }}
            />
          )}

          <img
            src={community.banner?.url || "https://via.placeholder.com/800x300"}
            alt="Community Banner"
            style={{
              width: "100%",
              height: "150px",
              objectFit: "cover",
              borderRadius: "8px",
              display: bannerLoaded ? "block" : "none",
            }}
            onLoad={() => setBannerLoaded(true)}
          />

          {/* Skeleton for Avatar */}
          {!profileLoaded && (
            <Skeleton
              variant="circular"
              width={120}
              height={120}
              sx={{
                position: "absolute",
                bottom: -40,
                left: 20,
                border: "4px solid white",
              }}
            />
          )}

          <Avatar
            src={community.profile?.url || "https://via.placeholder.com/100"}
            sx={{
              width: 120,
              height: 120,
              position: "absolute",
              bottom: -40,
              left: 20,
              border: "4px solid white",
              display: profileLoaded ? "block" : "none",
            }}
            onLoad={() => setProfileLoaded(true)}
          />
        </Box>

        {/* Community Info */}
        <Box mt={6} mb={2} px={2}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Typography variant="h4" fontWeight="bold">
              {community.name}
            </Typography>

            <Button
              variant="outlined"
              color="secondary"
              disabled={isMember || joinLoading}
              onClick={handleJoinCommunity}
            >
              {joinLoading ? "Joining..." : isMember ? "Joined" : "Join Now"}
            </Button>
          </Stack>
          <Typography variant="body1" color="textSecondary">
            {community.description}
          </Typography>
          <Box display="flex" alignItems="center" gap={1} mt={1}>
            <GroupIcon color="action" />
            <Typography variant="body2" color="textSecondary">
              Members
            </Typography>
            <Badge
              badgeContent={community.members?.length || 0}
              color="primary"
              sx={{ ml: "10px" }}
            />
            <Link>
              <Button
                variant="outlined"
                color="secondary"
                sx={{ ml: "auto" }}
                startIcon={<PostAdd />}
              >
                Create
              </Button>
            </Link>
          </Box>
        </Box>

        <Divider />

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
                      height: 300,
                      objectFit: "cover",
                      borderRadius: 2,
                    }}
                    src={post.video.url}
                  />
                )}

                <Box display="flex" alignItems="center" gap={1} py={1} ml={1}>
                  {/* Vote Button Group */}
                  <ButtonGroup
                    variant="outlined"
                    sx={{
                      borderRadius: "20px",
                      overflow: "hidden",
                      borderColor: "rgba(0,0,0,0.1)",
                    }}
                  >
                    {/* Upvote Button */}
                    <Button
                      sx={{
                        borderRadius: 0,
                        borderColor: "rgba(0,0,0,0.1)",
                        color: "gray",
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                          backgroundColor: "rgba(255,69,0,0.15)",
                          color: "#FF4500",
                          transform: "scale(1.05)",
                        },
                        "&:active": {
                          transform: "scale(0.95)",
                        },
                      }}
                    >
                      <ThumbUp fontSize="small" />
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "bold", ml: 0.5 }}
                      >
                        898
                      </Typography>
                    </Button>

                    <Button
                      sx={{
                        borderRadius: 0,
                        borderColor: "rgba(0,0,0,0.1)",
                        color: "gray",
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                          backgroundColor: "rgba(90, 117, 204, 0.15)", // Light blue tint
                          color: "#5A75CC", // Reddit's downvote blue
                          transform: "scale(1.05)", // Slight pop effect
                        },
                        "&:active": {
                          transform: "scale(0.95)", // Slight press effect
                        },
                      }}
                    >
                      <ThumbDown fontSize="small" />
                    </Button>
                  </ButtonGroup>

                  {/* Comment Button */}
                  <Button
                    variant="outlined"
                    sx={{
                      borderRadius: "20px",
                      px: 1.5,
                      borderColor: "rgba(0,0,0,0.1)",
                      color: "gray",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <ChatBubbleOutline fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">126</Typography>
                  </Button>

                  {/* Share Button */}
                  <Button
                    variant="outlined"
                    sx={{
                      borderRadius: "20px",
                      px: 1.5,
                      borderColor: "rgba(0,0,0,0.1)",
                      color: "gray",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Share fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">Share</Typography>
                  </Button>
                </Box>
              </Card>
            ))
          )}
        </Box>
      </Box>

      {/* Right Sidebar */}
      <Box width="30%" position="sticky" top={20} height="80vh">
        <Paper
          sx={{
            p: 3,
            maxHeight: "70vh",
            overflowY: "auto",
            bgcolor: "#f9f9f9",
            borderRadius: 2,
            boxShadow: 3,
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#bbb",
              borderRadius: "10px",
            },
          }}
        >
          <Box display="flex" alignItems="center">
            <InfoOutlined sx={{ mr: 1, color: "primary.main" }} />
            <Typography variant="subtitle1" fontWeight="bold">
              Mission
            </Typography>
          </Box>
          <Typography variant="body1" mt={1} lineHeight={1.6}>
            {community.mission}
          </Typography>

          <Box display="flex" alignItems="center" mt={3}>
            <GavelOutlined sx={{ mr: 1, color: "primary.main" }} />
            <Typography variant="subtitle1" fontWeight="bold">
              Rules
            </Typography>
          </Box>
          <Typography
            variant="body1"
            mt={1}
            lineHeight={1.6}
            dangerouslySetInnerHTML={{ __html: community.rules }}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default SingleCommunity;
