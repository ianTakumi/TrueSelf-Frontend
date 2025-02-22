import React from "react";
import { motion } from "framer-motion";

const TermsOfService = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen  p-6 flex justify-center my-10"
    >
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-2xl p-6 md:p-10">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
          Terms of Service
        </h1>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">
          Welcome to Trueself! By accessing or using our platform, you agree to
          comply with these Terms of Service.
        </p>

        <h2 className="text-lg md:text-xl font-semibold text-gray-700 mt-4">
          1. Acceptance of Terms
        </h2>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          By using Trueself, you confirm that you are at least 18 years old or
          have obtained parental consent. Your continued use signifies agreement
          to these terms.
        </p>

        <h2 className="text-lg md:text-xl font-semibold text-gray-700 mt-4">
          2. Description of Services
        </h2>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          Trueself provides AI-based anxiety prediction, an e-diary, mood
          tracking, and a community forum designed specifically for LGBT users.
        </p>

        <h2 className="text-lg md:text-xl font-semibold text-gray-700 mt-4">
          3. User Conduct
        </h2>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          You agree not to share false, misleading, or harmful content, engage
          in harassment, hate speech, or discrimination, or violate any
          applicable laws or regulations.
        </p>

        <h2 className="text-lg md:text-xl font-semibold text-gray-700 mt-4">
          4. Privacy and Data Protection
        </h2>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          Your data is collected and processed in compliance with the Data
          Privacy Act of the Philippines and ISO standards. Please review our
          Privacy Policy for more details.
        </p>

        <h2 className="text-lg md:text-xl font-semibold text-gray-700 mt-4">
          5. Account Security
        </h2>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          You are responsible for maintaining the confidentiality of your
          account credentials. If you suspect unauthorized access, notify us
          immediately.
        </p>

        <h2 className="text-lg md:text-xl font-semibold text-gray-700 mt-4">
          6. Content Ownership and Moderation
        </h2>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          You retain ownership of your content but grant Trueself a license to
          use, display, and distribute it within the platform. We reserve the
          right to remove content that violates these Terms.
        </p>

        <h2 className="text-lg md:text-xl font-semibold text-gray-700 mt-4">
          7. Limitation of Liability
        </h2>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          Trueself is not responsible for damages arising from your use of the
          platform. Our AI predictions are for informational purposes only and
          should not replace professional medical advice.
        </p>

        <h2 className="text-lg md:text-xl font-semibold text-gray-700 mt-4">
          8. Termination
        </h2>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          We reserve the right to suspend or terminate accounts that violate
          these terms.
        </p>

        <h2 className="text-lg md:text-xl font-semibold text-gray-700 mt-4">
          9. Changes to Terms
        </h2>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          We may update these Terms from time to time. Continued use constitutes
          acceptance of any modifications.
        </p>

        <p className="text-gray-600 text-sm md:text-base text-center mt-6">
          If you have any questions, contact us at{" "}
          <span className="text-blue-500">support@trueself.app</span>.
        </p>
      </div>
    </motion.div>
  );
};

export default TermsOfService;
