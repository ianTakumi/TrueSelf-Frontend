import React, { useState, useEffect } from "react";
import AxiosInstance from "../../../utils/AxiosInstance";
import { notifyError, getUser } from "../../../utils/helpers";
import { useNavigate } from "react-router-dom";
import { ThumbUp, ThumbDown, ChatBubbleOutline } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress"; // Import the spinner

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3); // Initially show 3 posts
  const user = getUser();
  const userId = user._id;
  const navigate = useNavigate();

  const fetchPosts = async () => {
    setLoading(true);
    await AxiosInstance.get(`/posts`) // API call to fetch posts
      .then((res) => {
        if (res.status === 200) {
          setPosts(res.data.posts); // Store posts with comment count
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        notifyError("Failed to fetch posts");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts(); // Call fetchPosts on component mount
  }, []);

  const handleViewMore = () => {
    setVisibleCount((prevCount) => prevCount + 3); // Show 3 more posts when clicked
  };

  return (
    <div>
      {loading && (
        <div className="flex justify-center items-center h-64">
          {/* Display CircularProgress spinner while loading */}
          <CircularProgress />
        </div>
      )}

      {!loading && posts.length === 0 && <div>No posts available</div>}

      {/* Map through posts and display each one */}
      {posts.slice(0, visibleCount).map((post) => (
        <div
          key={post._id}
          className="bg-white shadow-md rounded-lg p-4 mb-4"
          onClick={() => navigate(`/community/${post.communityId._id}`)}
        >
          {/* User Info */}
          <div className="flex items-center gap-3 mb-2">
            {post.user?.profileUrl && (
              <img
                src={post.user.profileUrl}
                alt={post.user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {post.user?.name || "Unknown User"}
              </p>
              <p className="text-xs text-gray-500">
                in {post.communityId?.name}
              </p>
            </div>
          </div>

          {/* Post Content */}
          <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>

          {post.type === "text" && (
            <p
              className="text-sm text-gray-600 mt-1"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}

          {post.type === "image" && (
            <div
              className={`mt-2 ${
                post.images.length === 1
                  ? "w-full"
                  : "grid grid-cols-1 md:grid-cols-2 gap-4"
              }`}
            >
              {post.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`Post Image ${index + 1}`}
                  className="w-full max-h-[300px] object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          {post.type === "video" && (
            <video
              controls
              className="w-full h-auto mt-2 rounded-lg"
              src={post.video.url}
            ></video>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 mt-2">
            {/* Upvote Section */}
            <div className="flex items-center gap-3 mb-2">
              <button className="text-gray-500 hover:text-blue-500">
                <ThumbUp fontSize="small" />
              </button>
              <span className="text-gray-700 font-medium">
                {post.likes.length}
              </span>
              <button className="text-gray-500 hover:text-red-500">
                <ThumbDown fontSize="small" />
              </button>
            </div>
            <button
              className="text-gray-600 hover:text-blue-600 flex items-center"
              onClick={() => navigate(`/post/${post._id}`)}
            >
              <ChatBubbleOutline fontSize="small" className="mr-1" />
              {post.commentCount} Comments
            </button>
          </div>
        </div>
      ))}

      {/* View More Button */}
      {posts.length > visibleCount && (
        <button
          onClick={handleViewMore}
          className="mt-4 px-4 py-2 border border-[#63579F] text-[#63579F] rounded-lg hover:bg-[#63579F] hover:text-white transition duration-200"
        >
          View More
        </button>
      )}
    </div>
  );
}
