import React from "react";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { Link } from "react-router-dom";

const Result = ({ data }) => {
  const normalRanges = {
    heartRate: "60-100 bpm",
    breathingRate: "12-20 breaths per minute",
    caffeineIntake: "0-400 mg per day",
    alcoholConsumption: "0-14 bottles/glass per week",
    sleepHours: "7-9 hours",
    physicalActivity: "At least 150 min/week",
  };

  const groupedData = [
    {
      title: "Vitals",
      items: [
        {
          label: "Heart Rate",
          value: `${data.heartRate} bpm`,
          normal: normalRanges.heartRate,
          isCritical: data.heartRate > normalRanges.heartRate,
        },
        {
          label: "Breathing Rate",
          value: `${data.breathingRate} breaths/min`,
          normal: normalRanges.breathingRate,
          isCritical: data.breathingRate > normalRanges.breathingRate,
        },
      ],
    },
    {
      title: "Lifestyle",
      items: [
        {
          label: "Sleep Hours",
          value: `${data.sleepHours} hrs`,
          normal: normalRanges.sleepHours,
          isCritical: data.sleepHours < normalRanges.sleepHours,
        },
        {
          label: "Physical Activity",
          value: `${data.physicalActivity} hrs/week`,
          normal: normalRanges.physicalActivity,
          isCritical: data.physicalActivity < normalRanges.physicalActivity,
        },
        {
          label: "Caffeine Intake",
          value: `${data.caffeineIntake} mg`,
          normal: normalRanges.caffeineIntake,
          isCritical: data.caffeineIntake > normalRanges.caffeineIntake,
        },
        {
          label: "Alcohol Consumption",
          value: `${data.alcoholConsumption} units/week`,
          normal: normalRanges.alcoholConsumption,
          isCritical: data.alcoholConsumption > normalRanges.alcoholConsumption,
        },
        {
          label: "Smoking",
          value: data.smoking ? "Yes" : "No",
          isCritical: data.smoking,
        },
      ],
    },
    {
      title: "Wellness",
      items: [
        {
          label: "Stress Level",
          value: `${data.stressLevel}/5`,
          isCritical: data.stressLevel > 3,
        },
        {
          label: "Dizziness",
          value: data.dizziness ? "Yes" : "No",
          isCritical: data.dizziness,
        },
        { label: "Therapy Sessions", value: data.therapySessions },
        {
          label: "Diet Quality",
          value: `${data.dietQuality}/5`,
          isCritical: data.dietQuality < 3,
        },
        { label: "Occupation", value: data.occupation },
      ],
    },
  ];

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r p-4">
      <img src={"/svg/result/doc.svg"} alt="" className="h-3/4 w-auto" />
      <div className="flex-1 h-3/4 flex items-center p-4">
        <div className="w-full p-5 bg-white text-gray-800 shadow-xl rounded-xl border border-gray-300">
          <h2 className="text-xl font-extrabold text-center mb-4">
            Anxiety Assessment Result
          </h2>
          <div className="text-center">
            <h3 className="text-lg font-semibold">Anxiety Severity Score</h3>
            <p
              className={`text-xl font-bold ${
                data.severityScore > 5 ? "text-red-600" : "text-green-600"
              }`}
            >
              {Math.floor(data.severityScore)} -{" "}
              {data.severityScore > 5 ? "Severe Anxiety" : "Mild Anxiety"}
            </p>
          </div>

          {groupedData.map((section, index) => (
            <div key={index} className="mb-3">
              <h3 className="text-md font-bold text-gray-600 mb-2">
                {section.title}
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm font-medium">
                {section.items.map((item, i) => (
                  <p
                    key={i}
                    className={item.isCritical ? "text-red-600 font-bold" : ""}
                  >
                    <strong>{item.label}:</strong> {item.value}
                    {item.normal !== undefined && (
                      <span className="text-gray-500">
                        {" "}
                        (Normal: {item.normal})
                      </span>
                    )}
                  </p>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-4 flex justify-between">
            <button className="border-2 border-blue-600 text-blue-600 px-4 py-1 text-sm font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1">
              <RestartAltIcon className="w-4 h-4" /> Take Again
            </button>
            <Link to={"/recommend"}>
              <button className="border-2 border-green-600 text-green-600 px-4 py-1 text-sm font-bold rounded-lg hover:bg-green-600 hover:text-white transition-all flex items-center gap-1">
                <LocalHospitalIcon className="w-4 h-4" /> View Recommended
                Hospital
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const mockData = {
  severityScore: 5,
  sleepHours: 9.8,
  physicalActivity: 8.1,
  caffeineIntake: 140,
  alcoholConsumption: 19,
  smoking: 1,
  familyHistory: 0,
  stressLevel: 2,
  heartRate: 81,
  breathingRate: 33,
  sweatingLevel: 2,
  dizziness: 0,
  medication: 0,
  therapySessions: 8,
  recentMajorLifeEvent: 0,
  dietQuality: 1,
  occupation: "Student",
};

const App = () => {
  return <Result data={mockData} />;
};

export default App;
