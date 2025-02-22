import { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";

const Recommend = () => {
  const [coordinates, setCoordinates] = useState(null);
  const [error, setError] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [visibleHospitals, setVisibleHospitals] = useState(3);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setCoordinates(userCoordinates);
          fetchHospitals(userCoordinates);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  }, []);

  const fetchHospitals = async (userCoordinates) => {
    try {
      const response = await fetch("/merged_hospital_data.json");
      const data = await response.json();
      let hospitalList = [];

      Object.entries(data).forEach(([city, hospitals]) => {
        Object.entries(hospitals).forEach(([name, details]) => {
          const distance = getDistance(
            userCoordinates.latitude,
            userCoordinates.longitude,
            details.Coordinates.Latitude,
            details.Coordinates.Longitude
          );
          hospitalList.push({ name, ...details, distance });
        });
      });

      hospitalList.sort((a, b) => a.distance - b.distance);
      setHospitals(hospitalList);
    } catch (error) {
      console.error("Error fetching hospital data:", error);
      setError("Failed to load hospital data.");
    } finally {
      setLoading(false);
    }
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex w-full max-w-5xl p-10 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center items-center flex-shrink-0">
          <img
            src="/page/doctor.png"
            alt="Doctor Illustration"
            className="w-40 h-40"
          />
        </div>
        <div className="ml-6 flex-grow">
          <h2 className="text-xl font-bold mb-4">Recommended Hospitals</h2>
          {loading ? (
            <div className="flex justify-center items-center">
              <CircularProgress color="secondary" />
            </div>
          ) : (
            <>
              {hospitals.slice(0, visibleHospitals).map((hospital, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-3 mb-3 transition duration-300 ease-in-out transform hover:bg-gray-100 hover:shadow-lg p-3 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-lg">{hospital.name}</p>
                    <p className="text-gray-500 text-sm">
                      {hospital.Address} • {hospital.distance} km away
                    </p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${hospital.Coordinates.Latitude},${hospital.Coordinates.Longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View on Google Maps
                    </a>
                  </div>
                </div>
              ))}
              {visibleHospitals < hospitals.length && (
                <p
                  className="font-bold text-black mt-4 cursor-pointer"
                  onClick={() => setVisibleHospitals(visibleHospitals + 3)}
                >
                  See more
                </p>
              )}
              {error && <p className="text-red-500 mt-2">Error: {error}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recommend;
