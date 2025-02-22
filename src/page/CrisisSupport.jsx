import React from "react";
import { motion } from "framer-motion";

const hotlines = [
  {
    name: "NCMH Crisis Hotline",
    landline: "1553",
    mobile: "0917-899-8727",
    imagePath: "/page/CrisisSupport/NCMH.png",
  },
  {
    name: "Hopeline Philippines",
    landline: "(02) 8804-4673",
    mobile: "0917-558-4673",
    imagePath: "/page/CrisisSupport/hopeLine.jpg",
  },
  {
    name: "Manila Lifeline Centre",
    landline: "(02) 896-9191",
    mobile: "0917-854-9191",
    imagePath: "/page/CrisisSupport/Lifeline.webp",
  },
  {
    name: "In Touch Community Services",
    landline: "(02) 893-7603",
    mobile: "0917-800-1123 / 0922-893-8944",
    imagePath: "/page/CrisisSupport/inTouch.png",
  },
  {
    name: "Western Visayas Suicide Prevention Hotline",
    landline: "1-800-10-333-8336",
    mobile: "0998-532-4047",
    imagePath: "/page/CrisisSupport/westernVisayas.png",
  },
];

const CrisisSupport = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-powder-blue min-h-screen flex flex-col mt-10 items-center"
    >
      <h1 className="text-xl font-bold text-lilac mb-4">
        Crisis Support Hotlines (Philippines)
      </h1>
      <p className="text-soft-green text-center mb-6">
        If you or someone you know is in distress, please reach out to these
        helplines. You are not alone.
      </p>
      <ul className="w-full max-w-md bg-lemon-chiffon p-4 rounded-lg shadow-lg">
        {hotlines.map((hotline, index) => (
          <li
            key={index}
            className="flex items-center gap-4 mb-4 p-3 border-b border-light-pink last:border-none"
          >
            {hotline.imagePath && (
              <img
                src={hotline.imagePath}
                alt={hotline.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-peach"
              />
            )}
            <div>
              <p className="text-lg font-semibold text-peach">{hotline.name}</p>
              <p className="text-base text-gray-700">
                Landline: {hotline.landline}
              </p>
              <p className="text-base text-gray-700">
                Mobile: {hotline.mobile}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-red-600 font-bold">
        In case of emergency, dial <span className="text-xl">911</span>.
      </p>
    </motion.div>
  );
};

export default CrisisSupport;
