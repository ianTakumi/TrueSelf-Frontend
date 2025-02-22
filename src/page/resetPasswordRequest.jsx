import React from "react";
import { useForm } from "react-hook-form";
import { notifyError, notifySuccess } from "../../utils/helpers";
import AxiosInstance from "../../utils/AxiosInstance";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await AxiosInstance.post(
        "/auth/resetPasswordRequest",
        data
      );
      if (response.status === 200) {
        notifySuccess("A password reset link has been sent to your email.");
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
        <h1 className="text-xl font-serif font-semibold text-center mb-4">
          Reset Password
        </h1>
        <p className="text-sm text-gray-600  mb-4">
          Enter your email to receive a password reset link.
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            placeholder="Enter your email"
            className="w-full p-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mb-2">{errors.email.message}</p>
          )}
          <button
            type="submit"
            className="w-full bg-[#C8A2C8] text-white py-2 rounded-lg hover:bg-[#d9a9d9]"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
