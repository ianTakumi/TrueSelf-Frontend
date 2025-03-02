import React, { useState } from "react";
import AxiosInstance from "../../../../utils/AxiosInstance";
import { notifyError, notifySuccess, getUser } from "../../../../utils/helpers";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  TextField,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { modules } from "../../../../configs/ReactQuill.config";

const JournalModal = ({ isEditing, fetchJournals, journal, onClose }) => {
  const user = getUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [content, setContent] = useState(journal?.content || "");

  const onSubmit = async (data) => {
    const userId = user._id;

    const cleanedData = {
      title: data.title,
      content,
    };

    if (isEditing) {
      try {
        await AxiosInstance.put(
          `/journalEntries/${journal._id}`,
          cleanedData
        ).then((res) => {
          if (res.status === 200) {
            notifySuccess("Journal entry updated successfully");
            fetchJournals();
            onClose();
          }
        });
      } catch (error) {
        notifyError("Failed to update journal entry");
      }
    } else {
      try {
        await AxiosInstance.post(`/journalEntries/${userId}`, cleanedData).then(
          (res) => {
            if (res.status === 201) {
              notifySuccess("Journal entry added successfully");
              fetchJournals();
              onClose();
            }
          }
        );
      } catch (error) {
        notifyError("Failed to add journal entry");
      }
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditing ? "Edit entry" : "Add entry"}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "grey.500",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box mb={2}>
            <TextField
              id="title"
              label="Title"
              type="text"
              fullWidth
              defaultValue={journal?.title}
              variant="outlined"
              error={!!errors.title}
              helperText={errors.title?.message}
              {...register("title", {
                required: "Title is required",
              })}
            />
          </Box>
          <Box mb={2}>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            color="secondary"
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
            {isEditing ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default JournalModal;
