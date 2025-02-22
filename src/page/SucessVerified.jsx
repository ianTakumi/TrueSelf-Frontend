import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AxiosInstance from "../../utils/AxiosInstance";
import { notifyError } from "../../utils/helpers";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";

const SuccessVerified = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useParams();

  useEffect(() => {
    const verifyEmail = async () => {
      console.log(token);
      if (!token) {
        notifyError("Invalid verification link");
      }

      await AxiosInstance.get(`/auth/verifyEmail/${token}`)
        .then((res) => {
          if (res.status === 200) {
            setLoading(false);
          }
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    };

    verifyEmail();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFFACD] text-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <img
          src="/page/loving.svg"
          alt="Success"
          className="w-32 h-32 mx-auto mb-4"
        />
        {loading ? (
          <div className="flex flex-col items-center">
            <CircularProgress color="secondary" />
            <p className="text-[#B0E0E6] mt-4">Verifying your email...</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-[#C8A2C8] mb-2">
              Email Verified Successfully!
            </h1>
            <p className="text-[#B0E0E6] mb-4">
              Your email has been successfully verified. You can now access all
              features.
            </p>
            <Link to="/login">
              <button className="bg-[#B5EAD7] text-white px-6 py-2 rounded-lg hover:bg-[#FFDAB9] transition">
                Continue
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default SuccessVerified;
