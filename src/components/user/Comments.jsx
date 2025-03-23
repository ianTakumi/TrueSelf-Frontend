import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { notifySuccess, getUser } from "../../../utils/helpers";
import ReportModal from "./modals/ReportModal";
import AxiosInstance from "../../../utils/AxiosInstance";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SendIcon from "@mui/icons-material/Send";

export default function Comments({
  postId,
  comments,
  currentUserId,
  setComments,
  fetchComments,
}) {
  const [visibleCount, setVisibleCount] = useState(2);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  const user = getUser();
  const userId = user?._id;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 2);
  };

  const handleMenuOpen = (event, comment) => {
    setAnchorEl(event.currentTarget);
    setSelectedComment(comment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleReport = () => {
    setReportModalOpen(true);
    handleMenuClose();
  };

  const handleCloseModal = () => {
    setReportModalOpen(false);
    setSelectedComment(null);
  };

  const handleDelete = async () => {
    if (selectedComment) {
      await AxiosInstance.delete(`/comments/${selectedComment._id}`).then(
        (res) => {
          if (res.status === 200) {
            setComments((prev) =>
              prev.filter((c) => c._id !== selectedComment._id)
            );
            fetchComments();
            notifySuccess("Comment deleted successfully.");
          }
        }
      );
    }
    handleMenuClose();
  };

  const handleReplySubmit = async (parentId) => {
    if (!replyText) return;

    try {
      const response = await AxiosInstance.post(
        `/comments/${userId}/${postId}/${replyingTo}`,
        {
          postId,
          content: replyText,
          parentCommentId: parentId,
          userId,
        }
      );

      if (response.status === 201) {
        setComments((prev) => [...prev, response.data]);
        notifySuccess("Reply added successfully.");
        setReplyText("");
        setReplyingTo(null);
        fetchComments();
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  return (
    <Box sx={{ mt: 2, p: 2, borderTop: "1px solid #ddd" }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Comments
      </Typography>

      {comments.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 4,
            color: "text.secondary",
            bgcolor: "#f9f9f9",
            borderRadius: 2,
          }}
        >
          <ChatBubbleOutlineIcon sx={{ fontSize: 50, color: "gray" }} />
          <Typography variant="body1" sx={{ mt: 1 }}>
            No comments yet. Be the first to share your thoughts!
          </Typography>
        </Box>
      ) : (
        comments
          .filter((comment) => !comment.parentComment)
          .slice(0, visibleCount)
          .map((comment) => (
            <Box
              key={comment._id}
              sx={{
                mb: 2,
                p: 2,
                bgcolor: "#f5f5f5",
                borderRadius: 2,
                position: "relative",
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold">
                {comment.user?.name || "Anonymous"}
              </Typography>
              <Typography variant="body2">{comment.content}</Typography>
              <Typography variant="caption" color="textSecondary">
                {new Date(comment.createdAt).toLocaleString()}
              </Typography>

              <IconButton
                aria-label="more"
                onClick={(e) => handleMenuOpen(e, comment)}
                sx={{ position: "absolute", top: 8, right: 8 }}
              >
                <MoreVertIcon />
              </IconButton>

              <Button
                size="small"
                sx={{ mt: 1 }}
                onClick={() => setReplyingTo(comment._id)}
              >
                Reply
              </Button>

              {replyingTo === comment._id && (
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    placeholder="Write a reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <IconButton
                    color="primary"
                    onClick={() => handleReplySubmit(comment._id)}
                  >
                    <SendIcon />
                  </IconButton>
                </Box>
              )}

              {comments
                .filter((c) => c.parentComment === comment._id)
                .map((reply) => (
                  <Box
                    key={reply._id}
                    sx={{
                      mt: 1,
                      ml: 4,
                      p: 1,
                      bgcolor: "#ececec",
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">
                      {reply.user?.name || "Anonymous"}
                    </Typography>
                    <Typography variant="body2">{reply.content}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(reply.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                ))}
            </Box>
          ))
      )}

      {visibleCount < comments.length && (
        <Button onClick={handleLoadMore} variant="outlined" sx={{ mt: 2 }}>
          View More
        </Button>
      )}

      <Menu
        id="comment-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleReport}>Report</MenuItem>
        {selectedComment?.user._id === currentUserId && (
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        )}
      </Menu>

      {reportModalOpen && (
        <ReportModal
          open={reportModalOpen}
          onClose={handleCloseModal}
          comment={selectedComment}
          commentId={selectedComment._id}
        />
      )}
    </Box>
  );
}
