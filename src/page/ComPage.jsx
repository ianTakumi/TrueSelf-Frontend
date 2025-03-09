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
        <div className="top-section grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 mb-5">
          {/* Card 1 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-md p-2.5 text-center flex flex-col justify-between">
            <img
              src="https://res.cloudinary.com/dco6n59if/image/upload/v1741173720/spaces/dydclsietbv6bfe35zpe.jpg"
              alt="Community"
              className="rounded-lg h-[200px] object-cover w-full"
            />
            <p className="text-sm font-medium mt-2">Who we are</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-md p-2.5 text-center flex flex-col justify-between">
            <img
              src="https://res.cloudinary.com/dco6n59if/image/upload/v1741174870/spaces/po4qtiz9pec5y4xodkcb.jpg"
              alt="Community"
              className="rounded-lg h-[200px] object-cover w-full"
            />
            <p className="text-sm font-medium mt-2">Connections Corner</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-lg overflow-hidden shadow-md p-2.5 text-center flex flex-col justify-between">
            <img
              src="https://res.cloudinary.com/dco6n59if/image/upload/v1741193803/spaces/hapa5e2mv41yo89frymw.jpg"
              alt="Community"
              className="rounded-lg h-[200px] object-cover w-full"
            />
            <p className="text-sm font-medium mt-2">Spectrum Voices</p>
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
