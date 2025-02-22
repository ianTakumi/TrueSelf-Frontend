import React from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#63579F] text-[#F8F8F8] py-10 px-6 md:px-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-6">
        {/* Logo */}
        <Link to={"/"}>
          <div className="flex flex-col items-center text-center">
            <img
              src="/logo/trueself5.png"
              alt="Logo"
              className="w-36 h-36 mb-2"
            />
            <h1 className="text-2xl font-bold">TrueSelf</h1>
          </div>
        </Link>

        {/* Learn More */}
        <nav>
          <h3 className="font-bold font-mono mb-3">LEARN MORE</h3>
          <ul className="space-y-2">
            <Link to={"/about"}>
              <li className="hover:text-gray-300 transition-colors duration-200 text-sm cursor-pointer mb-1">
                About True Self
              </li>
            </Link>

            <li className="hover:text-gray-300 transition-colors duration-200  text-sm cursor-pointer mb-2">
              Articles
            </li>
            <Link to={"/terms-of-service"}>
              <li className="hover:text-gray-300 transition-colors duration-200 text-sm cursor-pointer mb-2">
                Terms of Service
              </li>
            </Link>

            <Link to="/privacy-policy">
              <li className="hover:text-gray-300 transition-colors duration-200 text-sm cursor-pointer mb-2">
                Privacy Policy
              </li>
            </Link>

            <Link to={"/contact"}>
              <li className="hover:text-gray-300 transition-colors duration-200 text-sm cursor-pointer mb-2">
                Contact Us
              </li>
            </Link>
          </ul>
        </nav>

        {/* Community Forum */}
        <nav>
          <h3 className="font-semibold mb-3">Community Forum</h3>
          <ul className="space-y-2">
            <li className="hover:text-gray-300 transition-colors duration-200 cursor-pointer mb-2 text-sm">
              All Communities
            </li>
            <li className="hover:text-gray-300 transition-colors duration-200 cursor-pointer mb-2 text-sm">
              Search Communities
            </li>
          </ul>
        </nav>

        {/* Mental Health Resources (instead of duplicate Community Forum) */}
        <nav>
          <h3 className="font-semibold mb-3">Mental Health Resources</h3>
          <ul className="space-y-2">
            <Link to={"/test-anxiety"}>
              <li className="hover:text-gray-300 transition-colors duration-200 cursor-pointer mb-2 text-sm">
                Anxiety Severity Test (AI-Powered)
              </li>
            </Link>

            <li className="hover:text-gray-300 transition-colors duration-200 cursor-pointer mb-2 text-sm">
              Journaling
            </li>
            <Link to={"/mood"}>
              <li className="hover:text-gray-300 transition-colors duration-200 cursor-pointer mb-2 text-sm">
                Mood Tracker
              </li>
            </Link>
            <Link to="/myDiary">
              <li className="hover:text-gray-300 transition-colors duration-200 cursor-pointer mb-2 text-sm">
                My Journal
              </li>
            </Link>

            <Link to="/crisis-support">
              <li className="hover:text-gray-300 transition-colors duration-200 cursor-pointer mb-2 text-sm">
                Crisis Support Hotlines
              </li>
            </Link>
          </ul>
        </nav>
      </div>

      {/* Social Media & Copyright */}
      <div className="max-w-6xl mx-auto mt-8 flex flex-col md:flex-row justify-between items-center border-t border-white pt-4">
        <div className="flex space-x-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FacebookIcon className="hover:text-gray-300 cursor-pointer" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon className="hover:text-gray-300 cursor-pointer" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TwitterIcon className="hover:text-gray-300 cursor-pointer" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <YouTubeIcon className="hover:text-gray-300 cursor-pointer" />
          </a>
        </div>
        <p className="text-sm mt-4 md:mt-0">
          &copy; 2025 TrueSelf | All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
