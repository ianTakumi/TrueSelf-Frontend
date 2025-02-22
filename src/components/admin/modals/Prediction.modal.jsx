import React, { useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  MenuItem,
  Box,
  Divider,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";

const PredictionModal = ({ onClose, predictionToView, download }) => {
  const yesNoOptions = [
    { value: 1, label: "Yes" },
    { value: 0, label: "No" },
  ];

  const { register, reset, control } = useForm();

  useEffect(() => {
    if (predictionToView) {
      reset(predictionToView);
    }
  }, [predictionToView, reset]);

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="center">
          <img
            src="/page/school/mtics.png"
            alt="Left Logo"
            style={{ width: "60px", height: "60px", marginRight: "16px" }}
          />
          <Box textAlign="center">
            <Typography variant="h6" fontWeight="bold">
              TECHNOLOGICAL UNIVERSITY OF THE PHILIPPINES - TAGUIG
            </Typography>
            <Typography variant="body2">
              Electrical and Allied Department
            </Typography>
            <Typography variant="body2">
              Manila Technician Institute Computer Society
            </Typography>
          </Box>
          <img
            src="/page/school/tup.png"
            alt="Right Logo"
            style={{ width: "60px", height: "60px", marginLeft: "16px" }}
          />
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={2}>
          {/* Personal Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold">
              Personal Information
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Name"
              fullWidth
              InputProps={{ readOnly: true }}
              {...register("name")}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Age"
              fullWidth
              InputProps={{ readOnly: true }}
              {...register("age")}
            />
          </Grid>

          {/* Health Metrics */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold">
              Health Metrics
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Heart Rate"
              fullWidth
              InputProps={{ readOnly: true }}
              {...register("heartRate")}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Breathing Rate"
              fullWidth
              InputProps={{ readOnly: true }}
              {...register("breathingRate")}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Sweating Level"
              fullWidth
              InputProps={{ readOnly: true }}
              {...register("sweatingLevel")}
            />
          </Grid>

          {/* Lifestyle Factors */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold">
              Lifestyle Factors
            </Typography>
          </Grid>
          {[
            { name: "sleepHours", label: "Sleep Hours" },
            { name: "physicalActivity", label: "Physical Activity" },
            { name: "caffeineIntake", label: "Caffeine Intake" },
            { name: "alcoholIntake", label: "Alcohol Intake" },
            { name: "dietQuality", label: "Diet Quality" },
          ].map((field) => (
            <Grid item xs={4} key={field.name}>
              <TextField
                label={field.label}
                fullWidth
                InputProps={{ readOnly: true }}
                {...register(field.name)}
              />
            </Grid>
          ))}

          {/* Select Fields */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold">
              Medical & Family History
            </Typography>
          </Grid>
          {[
            { name: "smoking", label: "Smoking" },
            { name: "familyHistory", label: "Family History" },
            { name: "dizziness", label: "Dizziness" },
            { name: "medication", label: "Medication" },
          ].map((field) => (
            <Grid item xs={3} key={field.name}>
              <Controller
                name={field.name}
                control={control}
                render={({ field: controllerField }) => (
                  <TextField
                    select
                    label={field.label}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    {...controllerField}
                  >
                    {yesNoOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" variant="contained" onClick={download}>
          Download
        </Button>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PredictionModal;
