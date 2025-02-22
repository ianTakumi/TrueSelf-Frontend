import React, { useState } from "react";
import PhMap from "/page/philippines.svg"; // Import the SVG as a React component

const mockData = {
  Luzon: 120,
  Visayas: 80,
  Mindanao: 95,
};

const InteractiveMap = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);

  const handleRegionClick = (regionName) => {
    setSelectedRegion(regionName);
  };

  return (
    <div className="bg-white shadow-md p-4 rounded-md">
      <h1 className="text-4xl text-center font-bold mb-4">User Activity</h1>
      <div className="flex justify-center relative">
        <img
          src={PhMap}
          alt="Philippines Map"
          className="w-full max-w-lg"
          useMap="#philippines-map"
        />
        <map name="philippines-map">
          <area
            shape="poly"
            coords="100,200,150,250,200,200"
            alt="Luzon"
            onClick={() => handleRegionClick("Luzon")}
          />
          <area
            shape="poly"
            coords="300,400,350,450,400,400"
            alt="Visayas"
            onClick={() => handleRegionClick("Visayas")}
          />
          <area
            shape="poly"
            coords="500,600,550,650,600,600"
            alt="Mindanao"
            onClick={() => handleRegionClick("Mindanao")}
          />
        </map>
      </div>
      {selectedRegion && (
        <div className="mt-4 text-center text-xl font-semibold">
          Selected Region: {selectedRegion} <br />
          User Activity: {mockData[selectedRegion] || 0} users
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
