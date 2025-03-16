import { motion, useScroll, useInView } from "framer-motion";
import Brain from "../components/user/brain";
import React, { useRef } from "react";

const teamMembers = [
  {
    name: "Barcelona, Anna Martine",
    role: "Graphics Designer and Documentation",
    image: "/team/anna2.png",
  },
  {
    name: "Calica, Ian Gabriel",
    role: "Full-Stack Developer and Machine Learning Developer",
    image: "/team/ian2.jpg",
  },
  {
    name: "Candelario, Jhan Kyle",
    role: "Documentation",
    image: "/team/kyle2.png",
  },
  {
    name: "Castronuevo, Gelain",
    role: "UI/UX Designer and Frontend Developer",
    image: "/team/gelain2.jpg",
  },
  {
    name: "Madriaga, Pops V.  MSCS",
    role: "Thesis Adviser",
    image: "/team/advisor.jpg",
  },
];

const AboutPage = () => {
  const containRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const missionRef = useRef(null);
  const isMissionRefInView = useInView(missionRef, { once: true });
  const visionRef = useRef(null);
  const isVisionRefInView = useInView(visionRef, { once: true });
  const teamRef = useRef(null);
  const isTeamRefInView = useInView(teamRef, { once: true });
  const storyRef = useRef(null);
  const isStoryRefInView = useInView(storyRef, { once: true });
  const goaslRef = useRef(null);
  const isGoalsRefInView = useInView(goaslRef, { once: true });
  const skillRef = useRef(null);
  const isSkillRefInView = useInView(skillRef, { once: true });
  const experienceRef = useRef(null);
  const isExperienceRefInView = useInView(experienceRef, { once: true });

  return (
    <div className="h-full overflow-scroll flex" ref={containRef}>
      {/* Text container */}
      <div className="p-4 sm:p-8 md:p-12 lg:p-20 xl:p-48 flex flex-col gap-24 md:gap-32 lg:gap-48 xl:gap-64 lg:w-2/3 lg:pr-0 xl:w-1/2">
        {/* Biography container */}
        <div className="flex flex-col gap-12 justify-center">
          {/* Biography title */}
          <h1 className="font-bold text-2xl">About Us</h1>
          {/* Biography description */}
          <p className="text-lg">
            At TrueSelf, we understand the unique challenges that LGBTQ
            individuals face when accessing healthcare. The barriers are often
            overwhelming—ranging from prejudice and discrimination to a shortage
            of trained healthcare professionals, compounded by limited
            resources.
          </p>
          {/* quote */}
          {/* <span>quote</span> */}
          {/* Scroll svg */}
          <motion.svg
            initial={{ opacity: 0.2, y: 0 }}
            animate={{ opacity: 1, y: "10px" }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width={50}
            height={50}
          >
            <path
              d="M5 15C5 16.8565 5.73754 18.6371 7.05029 19.9498C8.36305 21.2626 10.1435 21.9999 12 21.9999C13.8565 21.9999 15.637 21.2626 16.9498 19.9498C18.2625 18.6371 19 16.8565 19 15V9C19 7.14348 18.2625 5.36305 16.9498 4.05029C15.637 2.73754 13.8565 2 12 2C10.1435 2 8.36305 2.73754 7.05029 4.05029C5.73754 5.36305 5 7.14348 5 9V15Z"
              stroke="#000000"
              strokeWidth="1"
            ></path>
            <path d="M12 6V14" stroke="#000000" strokeWidth="1"></path>
            <path d="M15 11L12 14L9 11" stroke="#000000" strokeWidth="1"></path>
          </motion.svg>
        </div>

        {/* Mission Container */}
        <div className="flex flex-col gap-12 justify-center" ref={missionRef}>
          {/* Biography title */}
          <motion.h1
            className="font-bold text-2xl"
            initial={{ x: "-300px" }}
            animate={isMissionRefInView ? { x: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            MISSION
          </motion.h1>
          {/* Biography description */}
          <motion.p
            className="text-lg"
            initial={{ x: "-600px" }}
            animate={isMissionRefInView ? { x: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            At TrueSelf, we are dedicated to designing an inclusive, accessible,
            and intuitive platform that prioritizes mental well-being. Our
            mission is to empower users with seamless mood tracking, journaling,
            and AI-driven insights, ensuring a smooth and engaging experience
            tailored to their needs.
          </motion.p>
          {/* quote */}
          {/* <span>quote</span> */}
          {/* Scroll svg */}
          <motion.svg
            initial={{ opacity: 0.2, y: 0 }}
            animate={{ opacity: 1, y: "10px" }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width={50}
            height={50}
          >
            <path
              d="M5 15C5 16.8565 5.73754 18.6371 7.05029 19.9498C8.36305 21.2626 10.1435 21.9999 12 21.9999C13.8565 21.9999 15.637 21.2626 16.9498 19.9498C18.2625 18.6371 19 16.8565 19 15V9C19 7.14348 18.2625 5.36305 16.9498 4.05029C15.637 2.73754 13.8565 2 12 2C10.1435 2 8.36305 2.73754 7.05029 4.05029C5.73754 5.36305 5 7.14348 5 9V15Z"
              stroke="#000000"
              strokeWidth="1"
            ></path>
            <path d="M12 6V14" stroke="#000000" strokeWidth="1"></path>
            <path d="M15 11L12 14L9 11" stroke="#000000" strokeWidth="1"></path>
          </motion.svg>
        </div>

        {/* Vision Container */}
        <div className="flex flex-col gap-12 justify-center" ref={visionRef}>
          {/* Biography title */}
          <motion.h1
            className="font-bold text-2xl"
            initial={{ x: "-300px" }}
            animate={isVisionRefInView ? { x: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            VISION
          </motion.h1>
          {/* Biography description */}
          <motion.p
            className="text-lg"
            initial={{ x: "-600px" }}
            animate={isVisionRefInView ? { x: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            We envision TrueSelf as a leader in mental health technology, where
            **UX design meets empathy**. By leveraging **human-centered
            design**, our goal is to create a safe and interactive space where
            users feel heard, supported, and motivated to improve their mental
            well-being through an intuitive and aesthetically pleasing digital
            experience.
          </motion.p>
          {/* quote */}
          {/* <span>quote</span> */}
          {/* Scroll svg */}
          <motion.svg
            initial={{ opacity: 0.2, y: 0 }}
            animate={{ opacity: 1, y: "10px" }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width={50}
            height={50}
          >
            <path
              d="M5 15C5 16.8565 5.73754 18.6371 7.05029 19.9498C8.36305 21.2626 10.1435 21.9999 12 21.9999C13.8565 21.9999 15.637 21.2626 16.9498 19.9498C18.2625 18.6371 19 16.8565 19 15V9C19 7.14348 18.2625 5.36305 16.9498 4.05029C15.637 2.73754 13.8565 2 12 2C10.1435 2 8.36305 2.73754 7.05029 4.05029C5.73754 5.36305 5 7.14348 5 9V15Z"
              stroke="#000000"
              strokeWidth="1"
            ></path>
            <path d="M12 6V14" stroke="#000000" strokeWidth="1"></path>
            <path d="M15 11L12 14L9 11" stroke="#000000" strokeWidth="1"></path>
          </motion.svg>
        </div>

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

      <div className="hidden lg:block lg:w-1/3 fixed right-0 top-0 h-screen">
        <Brain scrollYProgress={scrollYProgress} />
      </div>
    </div>
  );
};

export default AboutPage;
