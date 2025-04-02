import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AxiosInstance from "../../utils/AxiosInstance";
import { motion } from "framer-motion";
import { notifyError } from "../../utils/helpers";
import Posts from "../components/user/Posts";

const ComPage = () => {
  const [otherCommunities, setOtherCommunities] = useState([]);

  const fetchOtherCommunities = async () => {
    await AxiosInstance.get("/spaces/others")
      .then((res) => {
        if (res.status === 200) {
          setOtherCommunities(res.data.data);
        }
      })
      .catch((err) => {
        notifyError("Failed to fetch other communities");
      });
  };

  useEffect(() => {
    fetchOtherCommunities();
  }, []);

  return (
    <div className="com-container flex flex-col lg:flex-row justify-between items-start font-sans bg-gray-100">
      {/* Main Content */}
      <main className="main-content flex-grow p-5">
        <div className="top-section grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 mb-5">
          {/* First Card */}
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
                <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-300 group-hover:text-[#4F438C]">
                  Who We Are
                </h3>

                <p className="text-sm text-gray-600 mt-1">
                  Join our community and connect!
                </p>

                {/* Call to Action Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 px-4 py-2 text-[#63579F] border border-[#63579F] hover:bg-[#63579F] hover:text-white rounded-lg text-sm font-medium shadow-md"
                >
                  Explore Now
                </motion.button>
              </div>
            </motion.div>
          </Link>

          {/*  Second Card */}
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
                <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-300 group-hover:text-[#4F438C]">
                  <p className="text-sm font-medium mt-2">Spectrum Voices</p>
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Join our community and connect!
                </p>

                {/* Call to Action Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 px-4 py-2 text-[#63579F] border border-[#63579F] hover:bg-[#63579F] hover:text-white rounded-lg text-sm font-medium shadow-md"
                >
                  Explore Now
                </motion.button>
              </div>
            </motion.div>
          </Link>

          {/* Third Card */}
          <Link
            to={"/community/67c839d7e670d3676c68717b"}
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
                  src="https://res.cloudinary.com/dco6n59if/image/upload/v1741175256/spaces/vht8mvhtwkewrdmnbejr.png"
                  alt="Community"
                  className="rounded-lg h-[200px] object-cover w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Text & CTA */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-300 group-hover:text-[#4F438C]">
                  <p className="text-sm font-medium mt-2">Equality Alliance</p>
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Join our community and connect!
                </p>

                {/* Call to Action Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 px-4 py-2 text-[#63579F] border border-[#63579F] hover:bg-[#63579F] hover:text-white rounded-lg text-sm font-medium shadow-md"
                >
                  Explore Now
                </motion.button>
              </div>
            </motion.div>
          </Link>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Latest Posts
          </h2>
          <Posts />
        </div>
      </main>

      <aside className="w-full lg:w-[400px] bg-white shadow-lg rounded-2xl p-6 lg:ml-5 lg:self-start">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Other Communities
        </h3>
        <ul>
          {otherCommunities.map((community) => (
            <Link
              key={community._id}
              to={`/community/${community._id}`}
              className="block"
            >
              <li className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 transition duration-300 cursor-pointer">
                <img
                  src={community.profile.url}
                  alt={community.name}
                  className="w-12 h-12 rounded-full border border-gray-300 shadow-sm"
                />
                <p className="truncate w-full">{community.name}</p>
              </li>
            </Link>
          ))}
        </ul>
      </aside>
    </div>
  );
};

export default ComPage;
