import React, { useState } from "react";
import AxiosInstance from "../../../../utils/AxiosInstance";
import { notifyError, notifySuccess, getUser } from "../../../../utils/helpers";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Box,
  MenuItem,
  IconButton,
  Select,
  FormControl,
  DialogActions,
  Button,
  InputLabel,
} from "@mui/material";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
const ReportModal = ({
  onClose,
  postId = null,
  commentId = null,
  reportedUserId = null,
}) => {
  const user = getUser();
  const userId = user._id;

  const reportReasons = [
    "Spam",
    "Harassment",
    "Hate Speech",
    "Misinformation",
    "Violence",
    "Other",
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    let reportType = null;
    let reportedItem = null;

    if (postId) {
      reportType = "Post";
      reportedItem = postId;
    } else if (commentId) {
      reportType = "Comment";
      reportedItem = commentId;
    } else if (reportedUserId) {
      reportType = "User";
      reportedItem = reportedUserId;
    }

    if (!reportType || !reportedItem) {
      console.error("No valid report target found.");
      return;
    }

    const reportData = {
      ...data,
      reporter: userId,
      reportType,
      reportedItem,
    };

    await AxiosInstance.post("/reports", reportData)
      .then((res) => {
        notifySuccess("Reported successfully");
        onClose();
      })
      .catch((error) => {
        notifyError("Failed to report");
      });
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Report
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <FormControl fullWidth variant="outlined" error={!!errors.reason}>
            <InputLabel>Reason</InputLabel>
            <Select
              {...register("reason", { required: "Reason is required" })}
              defaultValue=""
              label="Reason"
            >
              {reportReasons.map((reason) => (
                <MenuItem key={reason} value={reason}>
                  {reason}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            {...register("details")}
            label="Details"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Box sx={{ flexGrow: 1 }} />
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="outlined" color="secondary">
            Report
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ReportModal;
