import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import AxiosInstance from "../../utils/AxiosInstance";
import { getUser, notifyError, notifySuccess } from "../../utils/helpers";
import ReportModal from "../components/user/modals/ReportModal";
import { useForm } from "react-hook-form";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  TextField,
} from "@mui/material";
import { MoreVert, ChatBubbleOutline, Share } from "@mui/icons-material";
import ArrowCircleUpOutlinedIcon from "@mui/icons-material/ArrowCircleUpOutlined";
import ArrowCircleDownOutlinedIcon from "@mui/icons-material/ArrowCircleDownOutlined";
import CircularProgress from "@mui/material/CircularProgress";

const SinglePost = () => {
  const user = getUser();
  const userId = user._id;
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showCommentInput, setShowCommentInput] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);

    await AxiosInstance.post(`/`);
    // handleAddComment(post._id, data.comment);
    // reset(); // Clear input after submitting
    // setShowCommentInput(false); // Hide input after submitting
  };

  const fetchPost = async () => {
    await AxiosInstance.get(`/posts/singlePost/${postId}`)
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data.data);
          setPost(res.data.data);
          console.log(post);
        }
      })
      .catch((err) => {
        notifyError("Failed to fetch post");
      });
  };

  const handleOpenReportModal = (postId) => {
    setIsReportOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsReportOpen(false);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCopyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        notifySuccess("Link copied to clipboard");
      })
      .catch(() => {
        notifyError("Failed to copy link");
      });
  };

  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <>
      {post ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          mt={-10}
        >
          <Card sx={{ width: "60%", mb: 2 }}>
            <CardHeader
              avatar={
                <Avatar
                  src={
                    post.user?.profile.url || "https://via.placeholder.com/50"
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
                    "&:active": { transform: "scale(0.95)" },
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
                  disabled={post.user?._id === userId}
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
                    "&:active": { transform: "scale(0.95)" },
                  }}
                >
                  <ArrowCircleDownOutlinedIcon fontSize="small" />
                </Button>
              </ButtonGroup>

              <Button
                variant="outlined"
                onClick={() => setShowCommentInput(!showCommentInput)}
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
                <Typography variant="body2">{post.comments.length}</Typography>
              </Button>

              <Button
                onClick={handleCopyLink}
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
            {showCommentInput && (
              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{ p: 2 }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Write a comment..."
                  {...register("comment", {
                    required: "Comment cannot be empty",
                  })}
                  error={!!errors.comment}
                  helperText={errors.comment?.message}
                  sx={{ mb: 1 }}
                />
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </Box>
            )}
          </Card>
        </Box>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <CircularProgress />
        </Box>
      )}
    </>
  );
};

export default SinglePost;
