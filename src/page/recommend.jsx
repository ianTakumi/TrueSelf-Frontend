import { useState, useEffect, useRef } from "react";
import { CircularProgress } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import osm_providers from "../../utils/osm/osm_providers";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { renderToStaticMarkup } from "react-dom/server";

const Recommend = () => {
  const [coordinates, setCoordinates] = useState({
    lat: 14.5995,
    lng: 120.9842,
  });
  const ZOOM_LEVEL = 9;
  const mapRef = useRef(null);
  const [error, setError] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [visibleHospitals, setVisibleHospitals] = useState(4);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(
            "User coordinates:",
            position.coords.latitude,
            position.coords.longitude
          );
          const userCoordinates = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
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
            userCoordinates[0],
            userCoordinates[1],
            details.Coordinates.Latitude,
            details.Coordinates.Longitude
          );
          hospitalList.push({ name, ...details, distance });
        });
      });

      hospitalList.sort((a, b) => a.distance - b.distance);
      setHospitals(hospitalList);
      console.log(hospitalList);
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

  const hospitalIconHTML = renderToStaticMarkup(
    <LocalHospitalIcon style={{ color: "red", fontSize: "24px" }} />
  );

  const hospitalIcon = new L.divIcon({
    className: "hospital-marker",
    html: hospitalIconHTML,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  const zoomToHospital = (lat, lng) => {
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 15, { animate: true });
    }
  };

  return (
    <div className="relative h-screen w-full">
      <MapContainer
        center={coordinates}
        zoom={ZOOM_LEVEL}
        ref={mapRef}
        style={{ height: "600px", width: "70%" }}
      >
        <TileLayer
          url={osm_providers.maptiler.url}
          attribution={osm_providers.maptiler.attribution}
        />
        {/* 🔴 Marker for User Location */}
        <Marker position={coordinates}>
          <Popup>📍 You are here!</Popup>
        </Marker>

        {/* 🏥 Markers for Hospitals */}
        {hospitals.map((hospital, index) => (
          <Marker
            key={index}
            position={[
              hospital.Coordinates.Latitude,
              hospital.Coordinates.Longitude,
            ]}
            icon={hospitalIcon}
          >
            <Popup>
              <strong>{hospital.name}</strong>
              <br />
              {hospital.Address}
              <br />
              📍 {hospital.distance} km away
              <br />
              <div className="flex justify-between items-center mt-1">
                <a
                  href={`https://maps.app.goo.gl/7HXhKcdGSrg5GQRt9`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View on Google Maps
                </a>
                <a href="#" className="text-blue-500 hover:underline ml-4">
                  View details
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="absolute top-4 right-0 bg-white ml-5 p-5 rounded-2xl shadow-lg max-w-md max-h-[600px] overflow-y-auto border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          🏥 Recommended Hospitals
        </h2>

        {loading ? (
          <div className="flex justify-center py-5">
            <CircularProgress color="secondary" />
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-300">
              {hospitals.slice(0, visibleHospitals).map((hospital, index) => (
                <div
                  key={index}
                  className="py-4 hover:bg-gray-100 px-3 rounded-lg transition"
                  onClick={() =>
                    zoomToHospital(
                      hospital.Coordinates.Latitude,
                      hospital.Coordinates.Longitude
                    )
                  }
                >
                  <p className="text-lg font-medium text-gray-900">
                    {hospital.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {hospital.Address} •{" "}
                    <span className="font-semibold">
                      {hospital.distance} km away
                    </span>
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${hospital.name}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-1 text-blue-500 hover:text-blue-700 hover:underline transition"
                  >
                    View on Google Maps →
                  </a>
                </div>
              ))}
            </div>

            {visibleHospitals < hospitals.length && (
              <button
                className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                onClick={() => setVisibleHospitals(visibleHospitals + 3)}
              >
                See more hospitals
              </button>
            )}
          </>
        )}

        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default Recommend;
