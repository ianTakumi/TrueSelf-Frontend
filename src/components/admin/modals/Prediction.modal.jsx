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
  CircularProgress,
  Box,
  Autocomplete,
  Divider,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";

const PredictionModal = ({ onClose, predictionToView, download }) => {
  console.log("Prediction Modal", predictionToView);
  const yesNoOptions = [
    { value: 1, label: "Yes" },
    { value: 0, label: "No" },
  ];

  const { register, reset, control, watch } = useForm({
    defaultValues: {
      occupation: predictionToView?.occupation || "", // Ensure default value is set
    },
  });

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
        <Grid
          item
          xs={12}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Anxiety Prediction Score
          </Typography>
          <Box position="relative" display="inline-flex">
            <CircularProgress
              variant="determinate"
              value={(watch("severityScore") / 10) * 100}
              size={100}
              thickness={6}
              sx={{
                color:
                  watch("severityScore") < 4
                    ? "#4CAF50"
                    : watch("severityScore") < 7
                    ? "#FFC107"
                    : "#F44336",
              }}
            />
            <Box
              position="absolute"
              top={0}
              left={0}
              bottom={0}
              right={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography variant="h5" fontWeight="bold">
                {watch("severityScore")}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid container spacing={2}>
          {/* Personal Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold">
              Personal Information
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              options={[
                "Engineer",
                "Other",
                "Student",
                "Teacher",
                "Unemployed",
              ]}
              getOptionLabel={(option) => option}
              value={watch("occupation") || ""} // Ensure the selected value is set
              onChange={(_, newValue) => setValue("occupation", newValue)} // Update form state
              renderInput={(params) => (
                <TextField {...params} label="Occupation" fullWidth />
              )}
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

          {/* Health Factors */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold">
              Health Factors
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
          <Grid item xs={4}>
            <TextField
              label="Therapy Sessions/month"
              fullWidth
              inputProps={{ readOnly: true }}
              {...register("theraphySession")}
            />
          </Grid>
          {[
            { name: "smokingHabits", label: "Smoking" },
            { name: "familyHistory", label: "Family History" },
            { name: "dizziness", label: "Dizziness" },
            { name: "medication", label: "Medication" },
          ].map((field) => (
            <Grid item xs={4} key={field.name}>
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

          {/* Lifestyle Factors */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold">
              Lifestyle Factors
            </Typography>
          </Grid>
          {[
            { name: "sleepHours", label: "Hours of sleep/day" },
            { name: "physicalActivity", label: "Physical Activity(mins/week)" },
            { name: "caffeeineIntake", label: "Caffeine Intake(mg/day)" },
            { name: "alcoholConsumption", label: "Alcohol Intake(Bottle/day)" },
            { name: "dietQuality", label: "Diet Quality(1-10)" },
            { name: "stressLevel", label: "Stress Level(1-10)" },
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
