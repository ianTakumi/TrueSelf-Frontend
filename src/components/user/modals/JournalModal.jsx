import React from "react";
import AxiosInstance from "../../../../utils/AxiosInstance";
import { notifyError, notifySuccess, getUser } from "../../../../utils/helpers";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
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

  const onSubmit = async (data) => {
    const userId = user._id;
    console.log(data);
    await AxiosInstance.put(`/journalEntries/${userId}, `);
  };
  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? "Edit Journal" : "View Journal"}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box mb={2}>
            <TextField
              id="title"
              label="Title"
              type="text"
              fullWidth
              value={journal?.title}
              variant="outlined"
              errors={!!errors.title}
              helperText={errors.title?.message}
              {...register("title", {
                required: "Title is required",
              })}
            />
          </Box>
          <Box mb={2}></Box>
        </DialogContent>
        <DialogActions>
          {isEditing ? (
            <>
              {" "}
              <Button
                onClick={onClose}
                color="inherit"
                variant="outlined"
                sx={{
                  borderColor: "grey.400",
                  color: "grey.600",
                  "&:hover": {
                    borderColor: "grey.500",
                    backgroundColor: "grey.100",
                  },
                }}
              >
                Cancel
              </Button>
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
                Update
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={onClose}
                color="inherit"
                variant="outlined"
                sx={{
                  borderColor: "grey.400",
                  color: "grey.600",
                  "&:hover": {
                    borderColor: "grey.500",
                    backgroundColor: "grey.100",
                  },
                }}
              >
                Close
              </Button>
            </>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default JournalModal;
