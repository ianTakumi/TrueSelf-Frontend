import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function JournalCard({ id, title, content, createdAt, onEdit, handleDelete }) {
  // Function to strip HTML tags and truncate text
  const getPreviewText = (htmlContent, maxLength) => {
    const div = document.createElement("div");
    div.innerHTML = htmlContent;
    const text = div.textContent || div.innerText || "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // Format createdAt date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const previewText = getPreviewText(content, 100); // Adjust maxLength as needed

  return (
    <div className="relative max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl my-4 transition-transform transform hover:scale-105 hover:shadow-lg">
      {/* Icons */}
      <div className="absolute top-2 right-2 flex space-x-2">
        <button onClick={onEdit} className="text-blue-500 hover:text-blue-700">
          <EditIcon fontSize="small" />
        </button>
        <button
          onClick={() => handleDelete(id)}
          className="text-red-500 hover:text-red-700"
        >
          <DeleteIcon fontSize="small" />
        </button>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-400">{formatDate(createdAt)}</p>
        <p className="mt-2 text-gray-500">{previewText}</p>
      </div>
    </div>
  );
}

export default JournalCard;
