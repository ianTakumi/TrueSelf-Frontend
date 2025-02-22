import React, { useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import {
  notifyError,
  notifySuccess,
  setUser,
  sexualOrientationOptions,
  genderIdentityOptions,
  pronounsOptions,
} from "../../../../utils/helpers";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import AxiosInstance from "../../../../utils/AxiosInstance";
import dayjs from "dayjs";

const Profile = ({ onClose, user }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      dob: null,
      sexualOrientation: null,
      genderIdentity: null,
      pronouns: null,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        dob: user.dob ? dayjs(user.dob) : null,
        sexualOrientation: sexualOrientationOptions.find(
          (option) => option.value === user.sexualOrientation
        ),
        genderIdentity: genderIdentityOptions.find(
          (option) => option.value === user.genderIdentity
        ),
        pronouns: pronounsOptions.find(
          (option) => option.value === user.pronouns
        ),
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    const updatedUser = {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      dob: data.dob.toISOString(),
      sexualOrientation: data.sexualOrientation?.value,
      genderIdentity: data.genderIdentity?.value,
      pronouns: data.pronouns?.value,
    };

    AxiosInstance.put(`/users/admin/${user._id}`, updatedUser)
      .then((response) => {
        if (response.status === 200) {
          notifySuccess("Successfully updated profile");
          setUser(response.data);
          onClose();
        }
      })
      .catch((error) => {
        console.error(
          "Error updating user:",
          error.response ? error.response.data : error.message
        );
        notifyError("Error updating profile");
      });
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
      }}
    >
      <Paper elevation={3} className="p-6 w-full max-w-lg">
        <Typography variant="h5" className="mb-4 font-semibold">
          Update Profile
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <TextField
                label="Name"
                fullWidth
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name?.message}
                {...register("name", { required: "Name is required" })}
              />
            </div>

            <div>
              <Controller
                name="dob"
                rules={{ required: "Date of Birth is required" }}
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      {...field}
                      label="Date of Birth"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          error={!!errors.dob}
                          helperText={errors.dob?.message}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
            </div>

            <div>
              <TextField
                label="Email"
                fullWidth
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register("email", { required: "Email is required" })}
              />
            </div>

            <div>
              <TextField
                label="Phone Number"
                fullWidth
                variant="outlined"
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
                {...register("phoneNumber", {
                  required: "Phone Number is required",
                  pattern: {
                    value: /^((09)|(\+639))\d{9}$/,
                    message: "Invalid phone number format",
                  },
                })}
              />
            </div>

            <div>
              <Typography variant="subtitle1" className="mb-1">
                Sexual Orientation
              </Typography>
              <Controller
                name="sexualOrientation"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={sexualOrientationOptions}
                    placeholder="Select Sexual Orientation"
                  />
                )}
              />
            </div>

            <div>
              <Typography variant="subtitle1" className="mb-1">
                Gender Identity
              </Typography>
              <Controller
                name="genderIdentity"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={genderIdentityOptions}
                    placeholder="Select Gender Identity"
                  />
                )}
              />
            </div>

            <div>
              <Typography variant="subtitle1" className="mb-1">
                Pronouns
              </Typography>
              <Controller
                name="pronouns"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={pronounsOptions}
                    placeholder="Select Pronouns"
                  />
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button onClick={onClose} variant="outlined" color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Update
            </Button>
          </div>
        </form>
      </Paper>
    </Box>
  );
};

export default Profile;
