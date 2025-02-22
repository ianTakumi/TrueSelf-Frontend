import React from "react";
import { useForm } from "react-hook-form";
import { notifyError, notifySuccess } from "../../utils/helpers";
import AxiosInstance from "../../utils/AxiosInstance";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");

      const response = await AxiosInstance.post(
        `/auth/resetPassword/${token}`,
        data
      );
      if (response.status === 200) {
        navigate("/login", {
          replace: true,
          state: { message: "Successfully reset password!", status: "success" },
        });
      }
    } catch (error) {
      notifyError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-96">
        <h1 className="text font-serif font-semibold text-center mb-4">
          Change Password
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="password" className="m-0">
              New Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password", { required: "Password is required" })}
              placeholder="Enter your password"
              className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mb-2">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="m-0">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Enter your password"
              {...register("confirmPassword", {
                required: "Password is required",
              })}
              className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mb-2">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#C8A2C8] text-white py-2 rounded-lg hover:bg-[#d9a9d9]"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
