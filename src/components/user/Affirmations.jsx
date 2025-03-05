import React, { useState } from "react";
import { affirmations } from "../../../utils/helpers";

const Affirmations = () => {
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(affirmations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAffirmations = affirmations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Affirmations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedAffirmations.map((affirmation) => (
          <div
            key={affirmation.id}
            className="bg-gradient-to-b from-pink-200 via-purple-200 to-blue-200 text-gray-900 font-semibold py-4 px-6 rounded-xl shadow-lg h-full flex flex-col justify-between"
          >
            <img
              src={affirmation.image}
              alt={affirmation.title}
              className="w-full h-40 object-cover rounded-t-xl"
            />
            <div className="p-4 flex flex-col flex-grow justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {affirmation.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4 min-h-[100px]">
                  {affirmation.description}
                </p>
              </div>
              <a
                href={affirmation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-blue-400 hover:bg-blue-500 text-white py-2 rounded-lg transition"
              >
                Listen
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-400 hover:bg-blue-500 text-white"
          }`}
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-gray-200 rounded-lg">
          {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-400 hover:bg-blue-500 text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Affirmations;
