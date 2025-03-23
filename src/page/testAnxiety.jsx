import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import Axios from "axios";
import AxiosAIInstance from "../../utils/AxiosAIInstance";
import { getUser, getAge, extractNumber } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const jobOptions = [
  { value: "student", label: "Student" },
  { value: "engineer", label: "Engineer" },
  { value: "teacher", label: "Teacher" },
  { value: "unemployed", label: "Unemployed" },
  { value: "other", label: "Other" },
];

const yesNoOptions = [
  { value: 1, label: "Yes" },
  { value: 0, label: "No" },
];

const scale1to5Options = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" },
];

const scale1to10Options = Array.from({ length: 10 }, (_, i) => ({
  value: i + 1,
  label: (i + 1).toString(),
}));

const translations = {
  en: {
    questions: [
      {
        key: "jobRole",
        label: "1. What's your occupation?",
        type: "select",
        options: jobOptions,
      },
      {
        key: "sleepDuration",
        label: "2. How many hours do you sleep per day?",
        type: "number",
      },
      {
        key: "exerciseMinutes",
        label: "3. How many minutes do you exercise per week?",
        type: "number",
      },
      {
        key: "caffeineIntake",
        label: "4. How much caffeine in milligrams do you consume daily?",
        type: "number",
      },
      {
        key: "alcoholIntake",
        label:
          "5. How many alcoholic drinks do you consume per week (in bottles or glasses)? ",
        type: "number",
      },
      {
        key: "heartRateAnxiety",
        label:
          "6. What is your typical heart rate during an anxiety attack, in beats per minute (BPM)?",
        type: "number",
      },
      {
        key: "breathingRate",
        label:
          "7. What is your typical breathing rate during an anxiety attack, in breaths per minute?",
        type: "number",
      },
      {
        key: "sweatingSeverity",
        label:
          "8. On a scale of 1 to 5, how severe is your sweating during an anxiety attack? (1 = no sweating, 5 = extreme sweating)",
        type: "select",
        options: scale1to5Options,
      },
      {
        key: "therapySessions",
        label:
          "9. How many therapy sessions do you attend per month for anxiety?",
        type: "number",
      },
      {
        key: "smoking",
        label: "10. Do you currently have a smoking habit?",
        type: "select",
        options: yesNoOptions,
      },
      {
        key: "familyAnxiety",
        label: "11. Do you have a family history of anxiety disorders?",
        type: "select",
        options: yesNoOptions,
      },
      {
        key: "dizziness",
        label: "12. Do you experience dizziness during anxiety attacks?",
        type: "select",
        options: yesNoOptions,
      },
      {
        key: "medication",
        label: "13. Are you currently taking any medication for anxiety?",
        type: "select",
        options: yesNoOptions,
      },
      {
        key: "lifeEvents",
        label:
          "14. Have you recently experienced any major life events that may have impacted your well-being?",
        type: "select",
        options: yesNoOptions,
      },
      {
        key: "dietQuality",
        label:
          "15. On a scale of 1 to 10, how would you rate the overall quality of your diet? (1 = very unhealthy, 10 = very healthy)",
        type: "select",
        options: scale1to10Options,
      },
      {
        key: "stressLevel",
        label:
          "16. On a scale of 1 to 10, how would you rate your current stress level? (1 = very low, 10 = extremely high)",
        type: "select",
        options: scale1to10Options,
      },
    ],
    title: "AI Anxiety Test",
    next: "Next",
    submit: "Submit",
    manageMildAnxiety: "Manage Mild Anxiety",
    anxietyLevel: "Your anxiety level is:",
    techniques: "Try these techniques to manage mild anxiety:",
    mindfulness: "Practice mindfulness (e.g., meditation, deep breathing)",
    physicalActivity: "Engage in physical activity",
    balancedDiet: "Maintain a balanced diet and get enough sleep",
    limitCaffeine: "Limit caffeine and alcohol",
    connectLovedOnes: "Connect with loved ones for support",
    enjoyHobbies: "Enjoy hobbies to relax",
    seekHelp: "If anxiety persists, consider seeking professional help.",
    gotIt: "Got it!",
  },
  tg: {
    questions: [
      {
        key: "jobRole",
        label: "1. Ano ang iyong trabaho?",
        type: "select",
        options: jobOptions,
      },
      {
        key: "sleepDuration",
        label: "2. Ilang oras ka natutulog bawat araw?",
        type: "number",
      },
      {
        key: "exerciseMinutes",
        label: "3. Ilang minuto kang nag-eehersisyo bawat linggo?",
        type: "number",
      },
      {
        key: "caffeineIntake",
        label:
          "4. Gaano karaming caffeine ang iniinom mo bawat araw (milligram)?",
        type: "number",
      },
      {
        key: "alcoholIntake",
        label: "5. Ilang inuming may alkohol ang iniinom mo bawat linggo?",
        type: "number",
      },
      {
        key: "heartRateAnxiety",
        label:
          "6. Gaano kabilis ang tibok ng puso mo kapag nakakaramdam ka ng matinding pagkabalisa? (BPM)",
        type: "number",
      },
      {
        key: "breathingRate",
        label:
          "7. Gaano kabilis ang iyong paghinga ng makaramdam ng matinding pagkabalisa(Hinga bawat minuto)",
        type: "number",
      },
      {
        key: "sweatingSeverity",
        label:
          "8. Gaano kalala ang pagpapawis mo kapag may matinding pagkabalisa? Sagutin sa sukat na 1 (pinakamagaan) hanggang 5 (pinakamatindi)",
        type: "select",
        options: scale1to5Options,
      },
      {
        key: "therapySessions",
        label:
          "9. Ilang therapy session para sa pagkabalisa ang tinatake mo bawat buwan?",
        type: "number",
      },
      {
        key: "smoking",
        label: "10. ikaw ba ay naninigarilyo? ",
        type: "select",
        options: yesNoOptions,
      },
      {
        key: "familyAnxiety",
        label: "11. Mayroon bang kasaysayan ng pagkabalisa sa iyong pamilya?",
        type: "select",
        options: yesNoOptions,
      },
      {
        key: "dizziness",
        label:
          "12. Nakakaranas ka ba ng pagkahilo sa panahon ng atake ng pagkabalisa?",
        type: "select",
        options: yesNoOptions,
      },
      {
        key: "medication",
        label: "13. Umiinom ka ba ng anumang gamot para sa pagkabalisa?",
        type: "select",
        options: yesNoOptions,
      },
      {
        key: "lifeEvents",
        label:
          "14. Nakaranas ka ba ng anumang malalaking kaganapan sa buhay kamakailan?",
        type: "select",
        options: yesNoOptions,
      },
      {
        key: "dietQuality",
        label:
          "15. Sa sukat na 1 hanggang 10, gaano ka-nutritious at balanced ang iyong pagkain? (1 - Puro junk food, 10 - Masustansya at balanse)",
        type: "select",
        options: scale1to10Options,
      },
      {
        key: "stressLevel",
        label:
          "16. Gaano kataas ang iyong stress ngayon sa sukat na 1 hanggang 10? (1 - Walang stress, 10 - Matinding stress)",
        type: "select",
        options: scale1to10Options,
      },
    ],
    title: "AI Anxiety Test",
    next: "Susunod",
    submit: "Ipasa",
    manageMildAnxiety: "Pamahalaan ang Banayad na Pagkabalisa",
    anxietyLevel: "Ang antas ng iyong pagkabalisa ay:",
    techniques:
      "Subukan ang mga teknik na ito upang pamahalaan ang banayad na pagkabalisa:",
    mindfulness:
      "Magsanay ng mindfulness (hal. pagmumuni-muni, malalim na paghinga)",
    physicalActivity: "Mag-ehersisyo",
    balancedDiet: "Panatilihin ang balanseng diyeta at sapat na tulog",
    limitCaffeine: "Limitahan ang caffeine at alkohol",
    connectLovedOnes: "Makipag-ugnayan sa mga mahal sa buhay para sa suporta",
    enjoyHobbies: "Magsaya sa mga libangan upang mag-relax",
    seekHelp:
      "Kung magpatuloy ang pagkabalisa, isaalang-alang ang propesyonal na tulong.",
    gotIt: "Nakuha ko na!",
  },
};

const TestAnxiety = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [language, setLanguage] = useState("en");
  const currentQuestion =
    translations[language].questions[currentQuestionIndex];
  const [progress, setProgress] = useState(0);
  const user = getUser();
  const audioRef = useRef(null);
  const navigate = useNavigate();

  const speakQuestion = async (text) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      extractNumber;
      const languageFolder = language === "tg" ? "tg" : "en";
      const audioURL = `/voices/${languageFolder}/${extractNumber(text)}.mp3`;
      const audio = new Audio(audioURL);
      audioRef.current = audio;

      const playAudio = () => {
        audio.play();
        setAudioPlayed(true);
      };

      if (!audioPlayed) {
        document.body.addEventListener("click", playAudio, { once: true });
      } else {
        playAudio();
      }
    } catch (error) {
      console.error("TTS error:", error);
    }
  };

  useEffect(() => {
    if (currentQuestion) {
      speakQuestion(currentQuestion.label);
      setProgress(
        ((currentQuestionIndex + 1) / translations[language].questions.length) *
          100
      );
    }
  }, [currentQuestionIndex, language]);

  const handleNext = (data) => {
    setAnswers({
      ...answers,
      [currentQuestion.key]: data[currentQuestion.key],
    });
    setValue(currentQuestion.key, "");
    console.log(answers);
    if (currentQuestionIndex < translations[language].questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      let occupationEncoding = {
        Occupation_Engineer: 0,
        Occupation_Other: 0,
        Occupation_Student: 0,
        Occupation_Teacher: 0,
        Occupation_Unemployed: 0,
      };

      const selectedOccupation = answers.jobRole.value;
      if (selectedOccupation) {
        const formattedOccupation = `Occupation_${
          selectedOccupation.charAt(0).toUpperCase() +
          selectedOccupation.slice(1)
        }`;
        if (occupationEncoding.hasOwnProperty(formattedOccupation)) {
          occupationEncoding[formattedOccupation] = 1;
        }
      }

      const dob = user.dob;

      const cleanedData = {
        Age: getAge(dob),
        "Sleep Hours": answers.sleepDuration,
        "Physical Activity (hrs/week)": answers.exerciseMinutes,
        "Caffeine Intake (mg/day)": answers.caffeineIntake,
        "Alcohol Consumption (drinks/week)": answers.alcoholIntake,
        Smoking: answers.smoking.value,
        "Family History of Anxiety": answers.familyAnxiety.value,
        "Stress Level (1-10)": answers.stressLevel.value,
        "Heart Rate (bpm during attack)": answers.heartRateAnxiety,
        "Breathing Rate (breaths/min)": answers.breathingRate,
        "Sweating Level (1-5)": answers.sweatingSeverity.value,
        Dizziness: answers.dizziness.value,
        Medication: answers.medication.value,
        "Therapy Sessions (per month)": answers.therapySessions,
        "Recent Major Life Event": answers.lifeEvents.value,
        "Diet Quality (1-10)": answers.dietQuality.value,
        ...occupationEncoding,
      };

      submitData(cleanedData);
    }
  };

  const submitData = async (data) => {
    const userId = user._id;
    // console.log(data);
    const formattedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        isNaN(value) || value === "" ? value : Number(value), // Convert only valid numeric strings
      ])
    );

    // console.log(formattedData);
    await AxiosAIInstance.post(`/predict/${userId}`, formattedData).then(
      (response) => {
        const severity = Math.round(response.data.predicted_severity);
        navigate("/Result");
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b  p-6">
      <form
        onSubmit={handleSubmit(handleNext)}
        className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-xl transition-all duration-300 hover:shadow-lg"
      >
        <progress
          className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"
          value={progress}
          max="100"
        ></progress>

        {/* Language Selection */}
        <div className="mb-4">
          <label className="text-lg font-semibold text-gray-700 mb-2">
            Language / Wika
          </label>
          <Select
            options={[
              { value: "en", label: "English" },
              { value: "tg", label: "Tagalog" },
            ]}
            onChange={(selected) => setLanguage(selected.value)}
            defaultValue={{ value: "en", label: "English" }}
          />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {translations[language].title}
        </h2>

        {/* Question Field */}
        <div className="flex flex-col mb-4">
          <label className="text-lg font-semibold text-gray-700 mb-2">
            {currentQuestion.label}
          </label>

          {/* Select Field */}
          {currentQuestion.type === "select" ? (
            <div>
              <Controller
                name={currentQuestion.key}
                rules={{ required: "This field is required" }}
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={currentQuestion.options}
                    className="mt-1"
                  />
                )}
              />
              {errors[currentQuestion.key] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[currentQuestion.key].message}
                </p>
              )}
            </div>
          ) : (
            // Input Field
            <div>
              <input
                type={currentQuestion.type}
                {...register(currentQuestion.key, {
                  required: "This field is required",
                })}
                className="border border-gray-300 rounded-lg px-4 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
              />
              {errors[currentQuestion.key] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[currentQuestion.key].message}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Next Button */}
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded-lg mt-6 text-lg font-semibold hover:bg-purple-700 transition-all duration-200"
        >
          {currentQuestionIndex === translations[language].questions.length - 1
            ? translations[language].submit
            : translations[language].next}
        </button>
      </form>
    </div>
  );
};

export default TestAnxiety;
