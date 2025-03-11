import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AxiosInstance from "../../utils/AxiosInstance";
import { motion } from "framer-motion";
import { ThumbUp, ThumbDown, ChatBubbleOutline } from "@mui/icons-material";

const ComPage = () => {
  const [topCommunities, setTopCommunities] = useState([]);

  const fetchTopCommunities = async () => {
    try {
      const res = await AxiosInstance.get("/community/top");
      setTopCommunities(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTopCommunities();
  }, []);

  return (
    <div className="com-container flex flex-col lg:flex-row justify-between items-start font-sans bg-gray-100">
      {/* Main Content */}
      <main className="main-content flex-grow p-5">
        <div className="top-section grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 mb-5">
          <Link
            to={"/community/67c833d69fdac0bf83ddc589"}
            className="cursor-pointer"
          >
            <motion.div
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
              }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-xl overflow-hidden shadow-lg text-center flex flex-col justify-between group"
            >
              {/* Image with Gradient Overlay */}
              <div className="relative">
                <img
                  src="https://res.cloudinary.com/dco6n59if/image/upload/v1741173719/spaces/p1hmnos609i2leydgglx.jpg"
                  alt="Community"
                  className="rounded-t-xl h-[200px] object-cover w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Text & CTA */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  Who We Are
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Join our community and connect!
                </p>

                {/* Call to Action Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium shadow-md"
                >
                  Explore Now
                </motion.button>
              </div>
            </motion.div>
          </Link>

          <Link
            to={"/community/67c83855e670d3676c687169"}
            className="cursor-pointer"
          >
            <motion.div
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
              }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-xl overflow-hidden shadow-lg text-center flex flex-col justify-between group"
            >
              {/* Image with Gradient Overlay */}
              <div className="relative">
                <img
                  src="https://res.cloudinary.com/dco6n59if/image/upload/v1741174548/spaces/me6soiubs5nicsmfzl9f.jpg"
                  alt="Community"
                  className="rounded-lg h-[200px] object-cover w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Text & CTA */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  <p className="text-sm font-medium mt-2">Spectrum Voices</p>
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Join our community and connect!
                </p>

                {/* Call to Action Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium shadow-md"
                >
                  Explore Now
                </motion.button>
              </div>
            </motion.div>
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 mb-4">
          {/* Upvote Section */}
          <div className="flex items-center gap-3 mb-2">
            <button className="text-gray-500 hover:text-blue-500">
              <ThumbUp fontSize="small" />
            </button>
            <span className="text-gray-700 font-medium">120</span>
            <button className="text-gray-500 hover:text-red-500">
              <ThumbDown fontSize="small" />
            </button>
          </div>

          {/* Post Content */}
          <h3 className="text-lg font-semibold text-gray-900">
            Exciting New Community Features!
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            We just launched a new feature set for our community. Let us know
            your thoughts!
          </p>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-2">
            <button className="text-gray-600 hover:text-blue-600 flex items-center">
              <ChatBubbleOutline fontSize="small" className="mr-1" />
              24 Comments
            </button>
          </div>
        </div>
      </main>
      <aside className="w-full lg:w-[300px] bg-white shadow-md rounded-lg p-4 lg:ml-5 lg:self-start">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Popular Communities
        </h3>
        <ul>
          <li className="mb-2">
            <Link
              to="/community/tech"
              className="text-blue-600 hover:underline"
            >
              r/Technology
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/community/gaming"
              className="text-blue-600 hover:underline"
            >
              r/Gaming
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/community/movies"
              className="text-blue-600 hover:underline"
            >
              r/Movies
            </Link>
          </li>
          <li>
            <Link
              to="/community/science"
              className="text-blue-600 hover:underline"
            >
              r/Science
            </Link>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default ComPage;
