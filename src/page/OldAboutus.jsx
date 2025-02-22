import React from "react";
import { motion } from "framer-motion";
import "./Aboutus.css";

const teamMembers = [
  {
    name: "Barcelona, Anna Martine",
    role: "Graphics Designer and Documentation",
    image: "/team/anna.png",
  },
  {
    name: "Calica, Ian Gabriel",
    role: "Full-Stack Developer and Machine Learning Developer",
    image: "/team/ian.png",
  },
  {
    name: "Candelario, Jhan Kyle",
    role: "Documentation",
    image: "/team/kyle.png",
  },
  {
    name: "Castronuevo, Gelain",
    role: "UI/UX Designer and Frontend Developer",
    image: "/team/gelain.png",
  },
];

const Aboutus = () => {
  return (
    <div className="about-container">
      {/* About Section */}
      <motion.div
        className="about-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="about-content">
          <motion.div
            className="about-text"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2>
              <strong>
                At <span className="highlight">True Self</span>,
              </strong>
            </h2>
            <p>
              At TrueSelf, we understand the unique challenges that LGBTQ
              individuals face when accessing healthcare. The barriers are often
              overwhelming—ranging from prejudice and discrimination to a
              shortage of trained healthcare professionals, compounded by
              limited resources.
            </p>
          </motion.div>
          <motion.div
            className="about-image"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img src="/page/aboutus.png" alt="Illustration" />
          </motion.div>
        </div>
      </motion.div>

      {/* Mission and Vision Section */}
      <motion.div
        className="mission-vision-section py-12 bg-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Mission & Vision Title Animation */}
          <motion.h1
            className="text-3xl font-bold mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Our Mission & Vision
          </motion.h1>

          {/* Mission Block Animation */}
          <motion.div
            className="bg-white shadow-md rounded-lg p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <h2 className="text-2xl font-semibold text-[#D1B1D3] mb-3">
              Mission
            </h2>
            <p className="text-gray-600">
              At TrueSelf, we are dedicated to designing an inclusive,
              accessible, and intuitive platform that prioritizes mental
              well-being. Our mission is to empower users with seamless mood
              tracking, journaling, and AI-driven insights, ensuring a smooth
              and engaging experience tailored to their needs.
            </p>
          </motion.div>

          {/* Vision Block Animation */}
          <motion.div
            className="bg-white shadow-md rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2 className="text-2xl font-semibold text-[#D1B1D3] mb-3">
              Vision
            </h2>
            <p className="text-gray-600">
              We envision TrueSelf as a leader in mental health technology,
              where **UX design meets empathy**. By leveraging **human-centered
              design**, our goal is to create a safe and interactive space where
              users feel heard, supported, and motivated to improve their mental
              well-being through an intuitive and aesthetically pleasing digital
              experience.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Team Section */}
      <motion.div
        className="team-section py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
      >
        {/* Team Title Animation */}
        <motion.h1
          className="text-3xl font-bold text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          Meet The Team
        </motion.h1>

        {/* Team Cards Animation */}
        <motion.div
          className="flex flex-wrap justify-center gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className="bg-white shadow-lg rounded-lg flex flex-col items-center p-6 w-64"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 * index }}
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 object-cover rounded-full mb-4"
              />
              <p className="font-bold text-lg text-center">{member.name}</p>
              <p className="text-gray-500 text-center">{member.role}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Aboutus;
