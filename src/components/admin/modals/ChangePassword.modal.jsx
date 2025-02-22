import React from "react";
import { useForm } from "react-hook-form";
import AxiosInstance from "../../../../utils/AxiosInstance";
import { notifySuccess, notifyError, getUser } from "../../../../utils/helpers";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";

const ChangePasswordModal = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const user = getUser();
    const userId = user._id;
    const cleanData = {
      currentPassword: data.current,
      newPassword: data.newPassword,
      confirmPassword: data.confirm,
    };

    try {
      await AxiosInstance.put(`/auth/changePassword/${userId}`, cleanData).then(
        (response) => {
          if (response.status === 200) {
            notifySuccess("Password updated successfully!");
            onClose();
          }
        }
      );
    } catch (error) {
      console.log(error);
      notifyError(error.message);
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Change Password</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box mb={2}>
            <TextField
              id="current"
              label="Current Password"
              type="password"
              fullWidth
              variant="outlined"
              error={!!errors.current}
              helperText={errors.current?.message}
              {...register("current", {
                required: "Current Password is required",
              })}
            />
          </Box>
          <Box mb={2}>
            <TextField
              id="newPassword"
              label="New Password"
              type="password"
              fullWidth
              variant="outlined"
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
              {...register("newPassword", {
                required: "New Password is required",
              })}
            />
          </Box>
          <Box mb={2}>
            <TextField
              id="confirm"
              label="Confirm Password"
              type="password"
              fullWidth
              variant="outlined"
              error={!!errors.confirm}
              helperText={errors.confirm?.message}
              {...register("confirm", {
                required: "Confirm Password is required",
              })}
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
            color="success"
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

export default ChangePasswordModal;
