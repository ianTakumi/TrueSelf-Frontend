import React from "react";
import { Link } from "react-router-dom";
// import "./ComPage.css";

const ComPage = () => {
  return (
    <div className="com-container flex flex-wrap justify-between items-start font-sans bg-gray-100">
      {/* Sidebar */}
      <aside className="sidebar w-80 bg-purple-400 text-white p-5 h-screen sticky top-0 overflow-y-auto transition-all duration-300">
        <h2 className="sidebar-title text-2xl font-bold text-center mt-5 mb-15">
          True Self
        </h2>

        <div className="divider w-full border-t border-gray-500 my-5"></div>

        {/* Topics */}
        <h3 className="text-sm mb-2.5">Topics</h3>

        <nav className="sidebar-nav">
          <ul className="list-none p-0">
            <li className="flex items-center gap-2.5 my-2.5">
              <Link
                to="#"
                className="flex items-center justify-between text-white text-sm no-underline p-2.5 hover:bg-white hover:bg-opacity-20"
              >
                <img
                  src="/icons/FAQ.png"
                  alt="FAQ Icon"
                  className="sidebar-icon w-5 h-5 mr-2.5"
                />
                Q&As
                <img
                  src="/icons/Chevron Down.png"
                  alt="Dropdown Icon"
                  className="dropdown-icon w-4 h-4 ml-2.5 order-3"
                />
              </Link>
            </li>
            <li className="flex items-center gap-2.5 my-2.5">
              <Link
                to="#"
                className="flex items-center justify-between text-white text-sm no-underline p-2.5 hover:bg-white hover:bg-opacity-20"
              >
                <img
                  src="/icons/identitylabels.png"
                  alt="Identity Labels Icon"
                  className="sidebar-icon w-5 h-5 mr-2.5"
                />
                Identity and Labels
                <img
                  src="/icons/Chevron Down.png"
                  alt="Dropdown Icon"
                  className="dropdown-icon w-4 h-4 ml-2.5 order-3"
                />
              </Link>
            </li>
            <li className="flex items-center gap-2.5 my-2.5">
              <Link
                to="#"
                className="flex items-center justify-between text-white text-sm no-underline p-2.5 hover:bg-white hover:bg-opacity-20"
              >
                <img
                  src="/icons/relationships.png"
                  alt="Relationships Icon"
                  className="sidebar-icon w-5 h-5 mr-2.5"
                />
                Relationships
                <img
                  src="/icons/Chevron Down.png"
                  alt="Dropdown Icon"
                  className="dropdown-icon w-4 h-4 ml-2.5 order-3"
                />
              </Link>
            </li>
            <li className="flex items-center gap-2.5 my-2.5">
              <Link
                to="#"
                className="flex items-center justify-between text-white text-sm no-underline p-2.5 hover:bg-white hover:bg-opacity-20"
              >
                <img
                  src="/icons/prideactivism.png"
                  alt="Pride Icon"
                  className="sidebar-icon w-5 h-5 mr-2.5"
                />
                Pride and Activism
                <img
                  src="/icons/Chevron Down.png"
                  alt="Dropdown Icon"
                  className="dropdown-icon w-4 h-4 ml-2.5 order-3"
                />
              </Link>
            </li>
            <li className="flex items-center gap-2.5 my-2.5">
              <Link
                to="#"
                className="flex items-center justify-between text-white text-sm no-underline p-2.5 hover:bg-white hover:bg-opacity-20"
              >
                <img
                  src="/icons/communitysupport.png"
                  alt="Community Icon"
                  className="sidebar-icon w-5 h-5 mr-2.5"
                />
                Community and Support
                <img
                  src="/icons/Chevron Down.png"
                  alt="Dropdown Icon"
                  className="dropdown-icon w-4 h-4 ml-2.5 order-3"
                />
              </Link>
            </li>
          </ul>
        </nav>

        {/* Divider line */}
        <div className="divider w-full border-t border-gray-500 my-5"></div>

        <div className="resources">
          <h3 className="text-sm mb-2.5">Resources</h3>
          <ul className="list-none p-0">
            <li className="flex items-center gap-2.5 my-2.5">
              <Link
                to="#"
                className="flex items-center text-white text-sm no-underline p-2.5 hover:bg-white hover:bg-opacity-20"
              >
                <img
                  src="/icons/abouttrueself.png"
                  alt="About Icon"
                  className="sidebar-icon w-5 h-5 mr-2.5"
                />
                About True Self
              </Link>
            </li>
            <li className="flex items-center gap-2.5 my-2.5">
              <Link
                to="#"
                className="flex items-center text-white text-sm no-underline p-2.5 hover:bg-white hover:bg-opacity-20"
              >
                <img
                  src="/icons/communities.png"
                  alt="Communities Icon"
                  className="sidebar-icon w-5 h-5 mr-2.5"
                />
                Communities
              </Link>
            </li>
            <li className="flex items-center gap-2.5 my-2.5">
              <Link
                to="#"
                className="flex items-center text-white text-sm no-underline p-2.5 hover:bg-white hover:bg-opacity-20"
              >
                <img
                  src="/icons/topics.png"
                  alt="Topics Icon"
                  className="sidebar-icon w-5 h-5 mr-2.5"
                />
                Topics
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content flex-grow p-5">
        <div className="top-section flex gap-2.5 flex-wrap mb-5">
          <div className="card flex-1 min-w-[200px] min-h-[250px] bg-white rounded-lg p-2.5 text-center flex flex-col justify-between">
            <img
              src="/page/community/1.png"
              alt="Community"
              className="rounded-lg"
            />
            <p>Be yourself</p>
          </div>
          <div className="card flex-1 min-w-[200px] min-h-[250px] bg-white rounded-lg p-2.5 text-center flex flex-col justify-between">
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
