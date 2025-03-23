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
import Comments from "../components/user/Comments";
import { useNavigate } from "react-router-dom";

const SinglePost = () => {
  const user = getUser();
  const userId = user._id;
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comments, setComments] = useState([]);
  const [visibleCount, setVisibleCount] = useState(2);
  const navigate = useNavigate();

  const fetchComments = async () => {
    console.log("Fetching comments for post:", postId);
    await AxiosInstance.get(`/comments/${postId}`)
      .then((res) => {
        if (res.status === 200) {
          setComments(res.data.data);
          console.log("Comments:", res.data.data);
        }
      })
      .catch((err) => {
        notifyError("Failed to fetch comments");
      });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);

    await AxiosInstance.post(`/comments/${userId}/${postId}`, {
      content: data.comment,
    }).then((res) => {
      if (res.status === 201) {
        notifySuccess("Comment added successfully");
        fetchComments();
      }
    });
    reset();
    setShowCommentInput(false);
  };

  const fetchPost = async () => {
    await AxiosInstance.get(`/posts/singlePost/${postId}`)
      .then((res) => {
        if (res.status === 200) {
          setPost(res.data.data);
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
    fetchComments();
  }, []);

  const handleLikePost = async (postId) => {
    await AxiosInstance.post(`/posts/like/${postId}`, { userId })
      .then((res) => {
        if (res.status === 200) {
          notifySuccess("Post liked successfully.");

          setPost((prevPost) =>
            prevPost && prevPost._id === postId
              ? { ...prevPost, likes: [...prevPost.likes, { userId }] }
              : prevPost
          );
        }
      })
      .catch((err) => {
        if (err.response.status === 400) {
          notifyError("You have already liked this post.");
        }
      });
  };

  const handleDislikePost = async (postId) => {
    try {
      const res = await AxiosInstance.post(`/posts/dislike/${postId}`, {
        userId,
      });

      if (res.status === 200) {
        notifySuccess("Post disliked successfully.");
        setPost((prevPost) =>
          prevPost && prevPost._id === postId
            ? {
                ...prevPost,
                likes: prevPost.likes.filter((like) => like.userId !== userId), // Remove from likes
                dislikes: [...(prevPost.dislikes || []), { userId }], // Add to dislikes
              }
            : prevPost
        );
      }
    } catch (error) {
      notifyError("Failed to dislike post.");
      console.error("Error disliking post:", error);
    }
  };

  const onDelete = async (postId) => {
    console.log("Deleting post:", postId);
    await AxiosInstance.delete(`/posts/${postId}`).then((res) => {
      if (res.status === 200) {
        notifySuccess("Post deleted successfully.");
        navigate(`/community/${post.communityId._id}`);
      }
    });
  };

  return (
    <>
      {post ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="flex-start"
          minHeight="100vh"
          mt={10}
        >
          <Card
            sx={{ width: "60%", mb: 2, p: 2, boxShadow: 3, borderRadius: 3 }}
          >
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
                    open={Boolean(anchorEl) && postId === post._id}
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
              subheader={new Date(post.createdAt).toLocaleString()}
            />

            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                {post.title}
              </Typography>
              <Typography
                variant="body1"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </CardContent>

            {post.images?.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, p: 1 }}>
                {post.images.map((img, index) => (
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
              </Box>
            )}

            {post.video && (
              <CardMedia
                component="video"
                controls
                sx={{ width: "100%", borderRadius: 2 }}
                src={post.video.url}
              />
            )}

            {post.communityId.members.includes(userId) && (
              <Box display="flex" alignItems="center" gap={2} py={2}>
                <IconButton
                  onClick={() => handleLikePost(post._id)}
                  color={post.likes.includes(userId) ? "secondary" : "primary"}
                  disabled={post.user._id === userId} // Disable if the post belongs to the user
                >
                  <ArrowCircleUpOutlinedIcon />
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    {post.likes.length}
                  </Typography>
                </IconButton>

                <IconButton
                  onClick={() => handleDislikePost(post._id)}
                  color={
                    post.dislikes?.includes(userId) ? "secondary" : "primary"
                  }
                  disabled={post.user._id === userId} // Disable if the post belongs to the user
                >
                  <ArrowCircleDownOutlinedIcon />
                </IconButton>

                <IconButton
                  onClick={() => setShowCommentInput(!showCommentInput)}
                  color="secondary"
                >
                  <ChatBubbleOutline />
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    {comments.length}
                  </Typography>
                </IconButton>

                <IconButton onClick={handleCopyLink}>
                  <Share />
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    Share
                  </Typography>
                </IconButton>
              </Box>
            )}

            {showCommentInput && (
              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{ px: 2, pb: 2 }}
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
                  sx={{ mb: 1, borderRadius: "20px", bgcolor: "#f9f9f9" }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: 2 }}
                >
                  Submit
                </Button>
              </Box>
            )}

            {comments && (
              <Comments
                postId={postId}
                comments={comments}
                currentUserId={userId}
                setComments={setComments}
                fetchComments={fetchComments}
              />
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
