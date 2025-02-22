import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { notifyError, notifySuccess } from "../../../../utils/helpers";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  MenuItem,
} from "@mui/material";
import AxiosInstance from "../../../../utils/AxiosInstance";

const Contact = ({ onContactCreated, onClose, contactToEdit }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = useForm();

  useEffect(() => {
    if (contactToEdit) {
      reset({
        name: contactToEdit.name,
        email: contactToEdit.email,
        phone: contactToEdit.phone,
        subject: contactToEdit.subject,
        body: contactToEdit.message,
        status: contactToEdit.status,
      });

      const selectedStatus = options.find(
        (option) => option.value === contactToEdit.status
      );
      setValue("status", selectedStatus); // Set initial value for status
    }
  }, [contactToEdit, reset, setValue]);

  const onSubmit = async (data) => {
    console.log(data);
    await AxiosInstance.put(`/contacts/${contactToEdit._id}`, data)
      .then((res) => {
        if (res.status === 200) {
          notifySuccess("Contact updated successfully");
          onContactCreated();
          onClose();
        }
      })
      .catch((err) => {
        notifyError("Failed to update contact");
        console.error(err);
      });
  };

  const options = [
    { value: "pending", label: "Pending" },
    { value: "in-progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
  ];

  const selectedStatus = watch("status");

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent>
        <Typography variant="h6" component="h2" gutterBottom>
          Edit Contact
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                id="name"
                label="Name"
                variant="outlined"
                fullWidth
                InputProps={{ readOnly: true }}
                {...register("name")}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="email"
                label="Email"
                variant="outlined"
                fullWidth
                InputProps={{ readOnly: true }}
                {...register("email")}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="phone"
                label="Phone Number"
                variant="outlined"
                fullWidth
                InputProps={{ readOnly: true }}
                inputProps={{ maxLength: 11 }}
                {...register("phone")}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="subject"
                label="Subject"
                variant="outlined"
                fullWidth
                InputProps={{ readOnly: true }}
                {...register("subject")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="body"
                label="Message"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                InputProps={{ readOnly: true }}
                {...register("body")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="status"
                select
                label="Status"
                fullWidth
                value={selectedStatus ? selectedStatus.value : ""}
                onChange={(event) =>
                  setValue(
                    "status",
                    options.find(
                      (option) => option.value === event.target.value
                    )
                  )
                }
                error={!!errors.status}
                helperText={errors.status ? "Please select a status" : ""}
              >
                {options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
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
      </DialogContent>
    </Dialog>
  );
};

export default Contact;
