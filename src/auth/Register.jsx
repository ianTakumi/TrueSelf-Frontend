import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import "./Register.css";
import AxiosInstance from "../../utils/AxiosInstance";
import { toast } from "react-toastify";
import {
  notifyError,
  notifySuccess,
  sexualOrientationOptions,
  genderIdentityOptions,
  pronounsOptions,
} from "../../utils/helpers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import Select from "react-select";
import { WidthFull } from "@mui/icons-material";

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const {
    control,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      dob: null,
      sexualOrientation: "",
      genderIdentity: "",
      pronouns: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    console.log(data);
    notifySuccess("Registration successful");

    try {
      await AxiosInstance.post("/auth/register", data).then((response) => {
        console.log(response);
        alert("Registration successful");
      });
    } catch (error) {
      console.log(error);
      notifyError("Registration failed");
    }
  };

  const nextStep = async () => {
    const isValid = await trigger();

    if (isValid) {
      setCurrentStep(currentStep + 1);
    } else {
      toast.error("Please fill out all required fields.");
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div>
      {/* Curved top section */}
      <div className="register-curved-top hidden sm:block"></div>

      <div className="register-container">
        {/* Left Section: Registration Form */}
        <div className="register-card">
          <form onSubmit={handleSubmit(onSubmit)}>
            {currentStep === 1 && (
              <div className="step-1">
                <div className="register-form-group-reg">
                  <label htmlFor="name">Name</label>
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: "Name is required" }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        id="name"
                        placeholder="Enter your name"
                      />
                    )}
                  />
                  {errors.name && (
                    <p className="text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div className="register-form-group-reg">
                  <label htmlFor="dob">Date of Birth</label>
                  <Controller
                    name="dob"
                    control={control}
                    rules={{ required: "Date of birth is required" }}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          {...field}
                          label="Date of Birth"
                          sx={{ width: "100%" }}
                          renderInput={(params) => (
                            <input
                              {...params.inputProps} // Get the inputProps from the DatePicker
                              style={{
                                width: "100%",
                                padding: "8px 12px",
                                borderRadius: "50px", // Apply border radius to the input
                                border: "1px solid #ccc", // Border color
                                outline: "none", // Remove default outline
                              }}
                              aria-label="Date of Birth"
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />

                  {errors.dob && (
                    <p className="text-red-500">{errors.dob.message}</p>
                  )}
                </div>

                <div className="register-form-group-reg">
                  <label htmlFor="email">Email</label>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: "Invalid email format",
                      },
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                      />
                    )}
                  />
                  {errors.email && (
                    <p className="text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="register-form-group-reg">
                  <label htmlFor="phone">Phone Number</label>
                  <Controller
                    name="phoneNumber"
                    control={control}
                    rules={{
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{10,15}$/,
                        message: "Phone number must be 11 digits",
                      },
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        id="phoneNumber"
                        placeholder="Enter your phone number"
                      />
                    )}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500">{errors.phoneNumber.message}</p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="step-2">
                <div className="register-form-group-reg">
                  <label htmlFor="genderIdentity">Gender Identity</label>
                  <Controller
                    name="genderIdentity"
                    control={control}
                    rules={{ required: "Gender Identity is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={genderIdentityOptions}
                        placeholder="Select Gender Identity"
                      />
                    )}
                  />
                  {errors.genderIdentity && (
                    <p className="text-red-500">
                      {errors.genderIdentity.message}
                    </p>
                  )}
                </div>

                <div className="register-form-group-reg">
                  <label htmlFor="pronouns">Pronouns</label>
                  <Controller
                    name="pronouns"
                    control={control}
                    rules={{ required: "Pronouns are required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={pronounsOptions}
                        placeholder="Select Pronouns"
                      />
                    )}
                  />
                  {errors.pronouns && (
                    <p className="text-red-500">{errors.pronouns.message}</p>
                  )}
                </div>

                <div className="register-form-group-reg">
                  <label htmlFor="sexualOrientation">Sexual Orientation</label>
                  <Controller
                    name="sexualOrientation"
                    control={control}
                    rules={{ required: "Sexual Orientation is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={sexualOrientationOptions}
                        placeholder="Select Sexual Orientation"
                      />
                    )}
                  />
                  {errors.sexualOrientation && (
                    <p className="text-red-500">
                      {errors.sexualOrientation.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="step-3">
                <div className="register-form-group-reg">
                  <label htmlFor="password">Password</label>
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                      />
                    )}
                  />
                  {errors.password && (
                    <p className="text-red-500">{errors.password.message}</p>
                  )}
                </div>

                <div className="register-form-group-reg">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    rules={{
                      required: "Confirm password is required",
                      validate: (value) =>
                        value === getValues("password") ||
                        "Passwords do not match",
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="password"
                        id="confirmPassword"
                        placeholder="Confirm your password"
                      />
                    )}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 ">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            )}
            <div className="navigation-buttons">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 mt-2 mr-3 border-2 border-[#B0E0E6] bg-[#B0E0E6] text-white font-semibold rounded-lg shadow-md hover:bg-[#B0E0E6] hover:text-white focus:outline-none transition duration-300 ease-in-out"
                >
                  Previous
                </button>
              )}
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 mt-2  border-2 border-[#B0E0E6] text-[#B0E0E6] font-semibold rounded-lg shadow-md hover:bg-[#B0E0E6] hover:text-white focus:outline-none transition duration-300 ease-in-out"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 mt-2  border-2 border-[#B0E0E6] text-[#B0E0E6] font-semibold rounded-lg shadow-md hover:bg-[#B0E0E6] hover:text-white focus:outline-none transition duration-300 ease-in-out"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Section: Text */}
        <div className="register-text-section">
          <h1 className="register-title">True Self</h1>
          <p className="register-subtitle">
            "Embrace differences in one voice"
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
