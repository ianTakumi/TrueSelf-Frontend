import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Login.css";
import AxiosInstance from "../../utils/AxiosInstance";
import { notifyError, notifySuccess } from "../../utils/helpers";
import { useForm, Controller } from "react-hook-form";
import { authenticate } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import FacebookIcon from "@mui/icons-material/Facebook";
import { Link } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (location.state?.message) {
      if (location.state?.status === "error") {
        notifyError(location.state.message);
      } else {
        notifySuccess(location.state.message);
      }
      // Clear the location state after notifying the user
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.message]);

  const onSubmit = async (data) => {
    console.log(data);

    await AxiosInstance.post("/auth/login", data)
      .then((response) => {
        console.log(response);
        authenticate(response.data, () => {
          console.log("User authenticated");
          notifySuccess("Login successful");
        });
        if (response.data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      })
      .catch((error) => {
        console.log(error);
        notifyError(error.response.data.message);
      });
  };

  const redirectToResetPassword = () => {
    navigate("/reset-password-request");
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log(decoded);
    const data = {
      email: decoded.email,
      sub: decoded.sub,
    };
    try {
      await AxiosInstance.post("/auth/googleLogin", data)
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            authenticate(response.data, () => {
              console.log("User authenticated");
              notifySuccess("Login successful");
            });
            if (response.data.user.role === "admin") {
              navigate("/admin");
            }
          } else {
            notifyError(response.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
          notifyError(error.data.message);
        });
    } catch (error) {
      console.log(error);
      notifyError("Login failed");
    }
  };

  const handleFacebookLoginOrSignup = async () => {
    window.location.href = "http://localhost:5000/api/v1/facebook/auth";
  };
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div>
      <div className="login-container">
        <Link to="/">
          <div className="flex justify-center items-center gap-5 my-10 cursor-pointer">
            <img src="/logo/trueself5.png" width={110} height={110} alt="" />
            <h1 className="login-title">True Self</h1>
          </div>
        </Link>

        <div className="login-card">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="login-form-group">
              <label htmlFor="email">Email</label>
              <Controller
                name="email"
                control={control}
                rules={{ required: "Email is required" }}
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
                <p className="text-red-500 text-left ml-2">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="login-form-group">
              <label htmlFor="password">Password</label>
              <div className="password-container">
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: "Password is required" }}
                  render={({ field }) => (
                    <div className="relative w-full">
                      <input
                        {...field}
                        type={passwordVisible ? "text" : "password"}
                        id="password"
                        placeholder="Enter your password"
                        className="w-full py-2 px-3 pr-12 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                        onClick={togglePasswordVisibility}
                      >
                        {passwordVisible ? <VisibilityOff /> : <Visibility />}
                      </span>
                    </div>
                  )}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-left ml-2">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="reset-password">
              <a onClick={redirectToResetPassword}>Reset password?</a>
            </div>

            <div className="flex items-center my-3">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-3 text-gray-500">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="flex justify-center items-center flex-col my-5 gap-4">
              <div
                className="flex items-center cursor-pointer justify-center w-52 h-10 bg-blue-600 text-white rounded-md gap-2 hover:bg-blue-700 transition-all duration-200"
                style={{ width: "190px" }}
                onClick={handleFacebookLoginOrSignup}
              >
                Login with
                <FacebookIcon fontSize="small" />
              </div>

              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  handleGoogleLoginSuccess(credentialResponse);
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
                clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
              />
            </div>
            <button type="submit" className="login-submit-btn">
              Login
            </button>
          </form>
          <div className="login-register-link">
            <p>
              Don't have an account? <a href="/register">Register</a>
            </p>
          </div>
        </div>
      </div>

      <div className="login-curved-bottom hidden sm:block"></div>
    </div>
  );
};

export default Login;
