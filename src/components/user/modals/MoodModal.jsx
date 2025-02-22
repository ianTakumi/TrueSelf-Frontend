import React, { useState } from "react";
import AxiosInstance from "../../../../utils/AxiosInstance";
import {
  notifyError,
  notifySuccess,
  getUser,
  moodData,
} from "../../../../utils/helpers";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Grid,
} from "@mui/material";
import { useForm } from "react-hook-form";

const MoodModal = ({ onClose, mood, fetchMoods }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const user = getUser();
  const userId = user._id;
  const [selectedMood, setSelectedMood] = useState(mood.mood || null);

  const onSubmit = async (data) => {
    data = {
      ...data,
      mood: selectedMood,
    };
    // console.log(data);

    await AxiosInstance.put(`/moodEntries/${mood._id}`, data)
      .then((res) => {
        if (res.status === 200) {
          notifySuccess("Mood updated successfully!");
          onClose();
          fetchMoods();
        }
      })
      .catch(() => {
        notifyError("Failed to update mood");
      });
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Mood</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {/* Moods  */}
          <Grid container spacing={2} justifyContent="center">
            {moodData.map((mood) => {
              const isSelected = selectedMood === mood.name; // Compare using mood.name

              return (
                <Grid item xs={4} sm={3} key={mood.name} textAlign="center">
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    bgcolor={isSelected ? "#B5EAD7" : "#F4DAD1"} // Apply selected state correctly
                    p={2}
                    borderRadius={2}
                    sx={{
                      transition: "all 0.3s ease-in-out",
                      cursor: "pointer",
                      border: isSelected
                        ? "3px solid #72C4A8"
                        : "3px solid transparent",
                      "&:hover": {
                        bgcolor: "#E8C7BC",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                        transform: "scale(1.05)",
                      },
                    }}
                    onClick={() => setSelectedMood(mood.name)} // Update selected mood based on name
                  >
                    <img
                      src={mood.icon}
                      alt={mood.name}
                      height={50}
                      width={50}
                      style={{ objectFit: "contain" }}
                    />
                    <Typography variant="body2" noWrap>
                      {mood.name}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>

          {/* Note */}
          <Box mb={2} mt={3}>
            <TextField
              id="note"
              label="Note"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={mood.note}
              error={!!errors.note}
              helperText={errors.note?.message}
              {...register("note", { required: "Note is required" })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
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
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default MoodModal;
