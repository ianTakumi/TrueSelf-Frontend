import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="sidebar w-80 bg-[#63579F] text-white p-5 h-screen sticky top-0 overflow-y-auto transition-all duration-300">
      <Link to={"/"}>
        <div className="flex flex-col  items-center">
          <img
            src="/logo/trueself5.png"
            alt=""
            className="h-20 w-20 object-cover"
          />
          <h2 className="sidebar-title text-2xl font-bold text-center">
            True Self
          </h2>
        </div>
      </Link>

      <div className="divider w-full border-t border-gray-500 my-5"></div>

      {/* Topics */}
      <h3 className="text-sm mb-2.5">Topics</h3>

      <nav className="sidebar-nav">
        <ul className="list-none p-0">
          {[
            { name: "Q&As", icon: "FAQ.png" },
            { name: "Identity and Labels", icon: "identitylabels.png" },
            { name: "Relationships", icon: "relationships.png" },
            { name: "Pride and Activism", icon: "prideactivism.png" },
            { name: "Community and Support", icon: "communitysupport.png" },
          ].map((item) => (
            <li key={item.name} className="flex items-center gap-2.5 my-2.5">
              <Link
                to="#"
                className="flex items-center justify-between text-white text-sm no-underline p-2.5 "
              >
                <img
                  src={`/icons/${item.icon}`}
                  alt={`${item.name} Icon`}
                  className="sidebar-icon w-5 h-5 mr-2.5"
                />
                {item.name}
                <img
                  src="/icons/Chevron Down.png"
                  alt="Dropdown Icon"
                  className="dropdown-icon w-4 h-4 ml-2.5 order-3"
                />
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="divider w-full border-t border-gray-500 my-5"></div>

      {/* Resources */}
      <div className="resources">
        <h3 className="text-sm mb-2.5">Resources</h3>
        <ul className="list-none p-0">
          {[
            { name: "About True Self", icon: "abouttrueself.png" },
            {
              name: "Communities",
              icon: "communities.png",
              link: "/community/communities",
            },
            // { name: "Topics", icon: "topics.png" },
          ].map((item) => (
            <li key={item.name} className="flex items-center gap-2.5 my-2.5">
              <Link
                to={item.link || "#"}
                className="flex items-center text-white text-sm no-underline p-2.5"
              >
                <img
                  src={`/icons/${item.icon}`}
                  alt={`${item.name} Icon`}
                  className="sidebar-icon w-5 h-5 mr-2.5"
                />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
