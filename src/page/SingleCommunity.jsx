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
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import {
  ChatBubbleOutline,
  Share,
  MoreVert,
  PostAdd,
} from "@mui/icons-material";
import GroupIcon from "@mui/icons-material/Group";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import GavelOutlined from "@mui/icons-material/GavelOutlined";
import ArrowCircleUpOutlinedIcon from "@mui/icons-material/ArrowCircleUpOutlined";
import ArrowCircleDownOutlinedIcon from "@mui/icons-material/ArrowCircleDownOutlined";
import { Link } from "react-router-dom";
import ReportModal from "../components/user/modals/ReportModal";

const SingleCommunity = () => {
  const user = getUser();
  const userId = user?._id;
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [joinLoading, setJoinLoading] = useState(true);
  const [bannerLoaded, setBannerLoaded] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const open = Boolean(anchorEl);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportPostId, setReportPostId] = useState(null);

  const handleOpenReportModal = (postId) => {
    setIsReportOpen(true);
    setReportPostId(postId);
  };

  const handleCloseReportModal = () => {
    setIsReportOpen(false);
    setReportPostId(null);
  };

  const handleMenuOpen = (event, postId) => {
    setAnchorEl(event.currentTarget);
    setSelectedPostId(postId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPostId(null);
  };

  const fetchPost = async () => {
    try {
      const res = await AxiosInstance.get(`/posts/community/${id}`);

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

  const handleLikePost = async (postId) => {
    console.log("Liking post:", postId);
    await AxiosInstance.post(`/posts/like/${postId}`, { userId }).then(
      (res) => {
        if (res.status === 200) {
          notifySuccess("Post liked successfully.");

          setPosts((prevPosts) =>
            prevPosts.map((post) =>
              post._id === postId
                ? { ...post, likes: [...post.likes, "currentUserId"] } // Optimistically update
                : post
            )
          );
        }
      }
    );
  };

  const handleDislikePost = async (postId) => {
    try {
      const res = await AxiosInstance.post(`/posts/dislike/${postId}`, {
        userId,
      });

      if (res.status === 200) {
        notifySuccess("Post disliked successfully.");

        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  likes: post.likes.filter((like) => like !== userId),
                  dislikes: [...post.dislikes, userId],
                }
              : post
          )
        );
      }
    } catch (error) {
      notifyError("Failed to dislike post.");
      console.error("Error disliking post:", error);
    }
  };

  const onEdit = async (postId) => {};

  const onDelete = async (postId) => {
    console.log("Deleting post:", postId);
    await AxiosInstance.delete(`/posts/${postId}`).then((res) => {
      if (res.status === 200) {
        notifySuccess("Post deleted successfully.");
        fetchPost();
      }
    });
  };

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
      {isReportOpen && (
        <ReportModal onClose={handleCloseReportModal} postId={reportPostId} />
      )}
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
            <Link to={`/create-post/${id}`} className="ml-auto">
              <Button
                variant="outlined"
                color="secondary"
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
                  action={
                    <>
                      <IconButton
                        onClick={(event) => handleMenuOpen(event, post._id)}
                      >
                        <MoreVert />
                      </IconButton>

                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && selectedPostId === post._id}
                        onClose={handleMenuClose}
                      >
                        {post.user?._id === userId ? (
                          // If the user is the owner, show Edit & Delete
                          <>
                            <MenuItem
                              onClick={() => {
                                handleMenuClose();
                                onEdit(post);
                              }}
                            >
                              Edit
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                handleMenuClose();
                                onDelete(post._id);
                              }}
                            >
                              Delete
                            </MenuItem>
                          </>
                        ) : (
                          // If the user is NOT the owner, show Report
                          <MenuItem
                            onClick={() => {
                              handleMenuClose();
                              handleOpenReportModal(post._id);
                            }}
                          >
                            Report
                          </MenuItem>
                        )}
                      </Menu>
                    </>
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
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {post.title}
                  </Typography>
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
                        width: "100%",
                        maxHeight: 400,
                        objectFit: "contain",
                        borderRadius: 2,
                      }}
                      image={img.url}
                      alt={`Post Image ${index + 1}`}
                    />
                  ))}

                {post.video && (
                  <CardMedia
                    component="video"
                    controls
                    sx={{ height: 300, objectFit: "cover", borderRadius: 2 }}
                    src={post.video.url}
                  />
                )}

                <Box display="flex" alignItems="center" gap={1} py={1} ml={1}>
                  <ButtonGroup
                    variant="outlined"
                    sx={{
                      borderRadius: "20px",
                      overflow: "hidden",
                      borderColor: "rgba(0,0,0,0.1)",
                    }}
                  >
                    <Button
                      disabled={post.likes.includes(userId)}
                      onClick={() => handleLikePost(post._id)}
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
                      <ArrowCircleUpOutlinedIcon fontSize="small" />
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: "bold", ml: 0.5 }}
                      >
                        {post.likes.length}
                      </Typography>
                    </Button>

                    <Button
                      onClick={() => handleDislikePost(post._id)}
                      disabled={post.user._id === userId}
                      sx={{
                        borderRadius: 0,
                        borderColor: "rgba(0,0,0,0.1)",
                        color: "gray",
                        transition: "all 0.3s ease-in-out",
                        "&:hover": {
                          backgroundColor: "rgba(90, 117, 204, 0.15)",
                          color: "#5A75CC",
                          transform: "scale(1.05)",
                        },
                        "&:active": {
                          transform: "scale(0.95)",
                        },
                      }}
                    >
                      <ArrowCircleDownOutlinedIcon fontSize="small" />
                    </Button>
                  </ButtonGroup>

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
                    <Typography variant="body2">
                      {post.comments.length}
                    </Typography>
                  </Button>

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
