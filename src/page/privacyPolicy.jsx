import React from "react";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen  p-6 flex justify-center my-10"
    >
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-2xl p-6 md:p-10">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
          Privacy Policy
        </h1>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">
          At Trueself, we value your privacy. This Privacy Policy explains how
          we collect, use, and protect your personal information.
        </p>

        <h2 className="text-lg md:text-xl font-semibold text-gray-700 mt-4">
          1. Information We Collect
        </h2>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          We collect personal information such as name, email, and data related
          to your mood tracking and AI-based anxiety predictions.
        </p>

        <h2 className="text-lg md:text-xl font-semibold text-gray-700 mt-4">
          2. How We Use Your Information
        </h2>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          Your information is used to provide personalized insights, improve our
          AI models, and ensure community safety within the forum.
        </p>

        <h2 className="text-lg md:text-xl font-semibold text-gray-700 mt-4">
          3. Data Security
        </h2>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          We implement strict security measures to protect your data in
          compliance with the Data Privacy Act of the Philippines and ISO
          standards.
        </p>

        <h2 className="text-lg md:text-xl font-semibold text-gray-700 mt-4">
          4. Sharing of Information
        </h2>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          We do not sell or share your personal data with third parties, except
          when required by law or to provide essential services.
        </p>

        <h2 className="text-lg md:text-xl font-semibold text-gray-700 mt-4">
          5. User Rights
        </h2>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          You have the right to access, modify, or delete your personal data.
          Contact us if you wish to exercise these rights.
        </p>

        <h2 className="text-lg md:text-xl font-semibold text-gray-700 mt-4">
          6. Changes to this Policy
        </h2>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          We may update this policy from time to time. Continued use of our
          services implies acceptance of changes.
        </p>

        <p className="text-gray-600 text-sm md:text-base text-center mt-6">
          If you have any questions, contact us at{" "}
          <span className="text-blue-500">support@trueself.app</span>.
        </p>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicy;
