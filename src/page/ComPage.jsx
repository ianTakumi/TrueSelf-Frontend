import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AxiosInstance from "../../utils/AxiosInstance";

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
    <div className="com-container flex flex-wrap justify-between items-start font-sans bg-gray-100">
      {/* Main Content */}
      <main className="main-content flex-grow p-5">
        <div className="top-section flex gap-2.5 flex-wrap mb-5">
          <div className="flex-1 min-w-[200px] min-h-[250px] bg-white rounded-lg p-2.5 text-center flex flex-col justify-between relative">
            <img
              src="/page/community/1.png"
              alt="Community"
              className="rounded-lg w-full h-full object-cover"
            />
            <p className="absolute bottom-5 left-4 text-black text-lg font-bold  px-2 py-1 rounded-lg">
              Be yourself
            </p>
          </div>

          <div className=" flex-1 min-w-[200px] min-h-[250px] bg-white rounded-lg p-2.5 text-center flex flex-col justify-between">
            <img
              src="/page/community/2.png"
              alt="Community"
              className="rounded-lg"
            />
            <p>Lorem ipsum dolor sit amet...</p>
          </div>
        </div>

        <div className="posts bg-white p-3.5 rounded-lg">
          <div className="post bg-white mb-3.5 p-2.5 rounded-lg shadow-md">
            <h4 className="m-0 text-sm">tr/Relationships • 3 hr. ago</h4>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <div className="image-placeholder bg-gray-400 h-40 mt-2.5 rounded-lg"></div>
            <div className="post-actions flex justify-between pt-2.5">
              <span className="text-xs">👍 361</span>
              <span className="text-xs">💬 353</span>
              <button className="bg-purple-400 border-none text-white py-1 px-2.5 rounded-md cursor-pointer">
                Share
              </button>
            </div>
          </div>

          <div className="post bg-white mb-3.5 p-2.5 rounded-lg shadow-md">
            <h4 className="m-0 text-sm">tr/Relationships • 3 hr. ago</h4>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <div className="image-placeholder bg-gray-400 h-40 mt-2.5 rounded-lg"></div>
            <div className="post-actions flex justify-between pt-2.5">
              <span className="text-xs">👍 361</span>
              <span className="text-xs">💬 353</span>
              <button className="bg-purple-400 border-none text-white py-1 px-2.5 rounded-md cursor-pointer">
                Share
              </button>
            </div>
          </div>
        </div>
      </main>

      <div className="right-sidebar flex-grow mt-5 w-7.5">
        <div className="card1 flex-1 min-w-[200px] min-h-[250px] bg-white rounded-lg p-2.5 text-center flex">
          <img
            src="/page/community/3.png"
            alt="Community"
            className="rounded-lg"
          />
          <p>Lorem ipsum dolor sit amet...</p>
        </div>

        <div className="popular-communities bg-white mt-5 p-5 rounded-lg shadow-md">
          <h3 className="text-lg mb-2.5">Popular Communities</h3>
          <ul className="list-none p-0">
            <li className="py-1.5">tr/Relationships (3,330,200 members)</li>
            <li className="py-1.5">tr/LifeAdvices (10,200 members)</li>
            <li className="py-1.5">tr/MentalHealth (100,200 members)</li>
            <li className="py-1.5">tr/MentalHealth (1,000,200 members)</li>
            <li className="py-1.5">
              <Link to="#" className="text-purple-400 font-bold no-underline">
                See more
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ComPage;
