import React from "react";
import AxiosInstance from "../../../../utils/AxiosInstance";
import { useForm, Controller } from "react-hook-form";
import { notifySuccess, notifyError } from "../../../../utils/helpers";
import {
  TextField,
  Button,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ReportEditModal({ onClose, report, refresh }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      reportType: report.reportType,
      reason: report.reason,
      details: report.details,
      reportStatus: report.status,
      reportedBy: report.reporter.name,
      reportedUser: report.reportedItem.user.name,
      actionTaken: report.actionTaken || "None",
    },
  });

  const onSubmit = async (data) => {
    await AxiosInstance.put(`/reports/${report._id}`, data)
      .then((res) => {
        if (res.status === 200) {
          notifySuccess("Report updated successfully");
          refresh();
          onClose();
        }
      })
      .catch((err) => {
        console.error("\u274C API Error:", err);
        notifyError("Something went wrong");
      });
  };

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Edit Report
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                disabled
                label="Report Type"
                {...register("reportType", { required: true })}
                error={!!errors.reportType}
                helperText={errors.reportType ? "Report type is required" : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                disabled
                label="Reason"
                {...register("reason", { required: true })}
                error={!!errors.reason}
                helperText={errors.reason ? "Reason is required" : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Details"
                disabled
                {...register("details", { required: true })}
                error={!!errors.details}
                helperText={errors.details ? "Details are required" : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reported By"
                {...register("reportedBy")}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Reported User"
                {...register("reportedUser")}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="reportStatus"
                control={control}
                rules={{ required: "Status is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value || ""}
                    fullWidth
                    select
                    label="Report Status"
                    error={!!errors.reportStatus}
                    helperText={errors.reportStatus?.message}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Reviewed">Reviewed</MenuItem>
                    <MenuItem value="Resolved">Resolved</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="actionTaken"
                control={control}
                rules={{ required: "Action Taken is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value || ""}
                    fullWidth
                    select
                    label="Action Taken"
                    error={!!errors.actionTaken}
                    helperText={errors.actionTaken?.message}
                  >
                    <MenuItem value="None">None</MenuItem>
                    <MenuItem value="Post Deleted">Post Deleted</MenuItem>
                    <MenuItem value="Comment Deleted">Comment Deleted</MenuItem>
                    <MenuItem value="User Deactivated">
                      User Deactivated
                    </MenuItem>
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                color="secondary"
                type="submit"
                fullWidth
              >
                Update Report
              </Button>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
}
