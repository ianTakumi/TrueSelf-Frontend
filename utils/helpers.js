import { toast } from "react-toastify";

export const getRecommendations = (data) => {
  const recommendations = [];

  // Sleep Hours
  if (data.sleepHours < 6) {
    recommendations.push(
      "Try to get at least 7-9 hours of sleep per night. Poor sleep can increase anxiety levels."
    );
  } else if (data.sleepHours > 10) {
    recommendations.push(
      "Excessive sleep might be linked to fatigue or depression. Consider maintaining a balanced sleep schedule."
    );
  }

  // Physical Activity
  if (data.physicalActivity < 2) {
    recommendations.push(
      "Engage in at least 150 minutes of moderate exercise per week to help manage anxiety."
    );
  }

  // Caffeine Intake
  if (data.caffeineIntake > 400) {
    recommendations.push(
      "High caffeine intake can contribute to anxiety. Try reducing coffee or energy drink consumption."
    );
  }

  // Alcohol Consumption
  if (data.alcoholConsumption > 14) {
    recommendations.push(
      "Excessive alcohol consumption can negatively impact mental health. Consider reducing intake."
    );
  }

  // Smoking
  if (data.smoking) {
    recommendations.push(
      "Smoking may increase anxiety and stress over time. Consider seeking support to quit smoking."
    );
  }

  // Stress Level
  if (data.stressLevel > 3) {
    recommendations.push(
      "Practice relaxation techniques such as meditation, deep breathing, or yoga to manage stress."
    );
  }

  // Dizziness
  if (data.dizziness) {
    recommendations.push(
      "Frequent dizziness may be a sign of dehydration or anxiety-related hyperventilation. Stay hydrated and consult a doctor if persistent."
    );
  }

  // Diet Quality
  if (data.dietQuality < 3) {
    recommendations.push(
      "Improve your diet by including more fruits, vegetables, and whole foods for better mental health."
    );
  }

  return recommendations;
};

export const randomRange = (min, max) => Math.random() * (max - min) + min;
export const extractNumber = (text) => {
  const match = text.match(/^(\d+)\./); // Hanapin ang number sa simula ng text
  return match ? match[1] : null; // Kung may nahanap, ibalik ang number; kung wala, return null
};

[
  {
    quote:
      "The only limit to our realization of tomorrow is our doubts of today.",
    author: "Franklin D. Roosevelt",
  },
  {
    quote: "Do what you can, with what you have, where you are.",
    author: "Theodore Roosevelt",
  },
  {
    quote:
      "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    quote: "Life is what happens when you're busy making other plans.",
    author: "John Lennon",
  },
  {
    quote: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
  },
  {
    quote: "You must be the change you wish to see in the world.",
    author: "Mahatma Gandhi",
  },
  {
    quote: "In the middle of every difficulty lies opportunity.",
    author: "Albert Einstein",
  },
  { quote: "Happiness depends upon ourselves.", author: "Aristotle" },
  {
    quote: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
  },
  {
    quote: "Do what you love and you'll never work a day in your life.",
    author: "Marc Anthony",
  },
  {
    quote: "Opportunities don't happen. You create them.",
    author: "Chris Grosser",
  },
  {
    quote:
      "Your time is limited, so don't waste it living someone else's life.",
    author: "Steve Jobs",
  },
  {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    quote:
      "If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success.",
    author: "James Cameron",
  },
  {
    quote: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
  },
  {
    quote:
      "Keep your face always toward the sunshine—and shadows will fall behind you.",
    author: "Walt Whitman",
  },
  { quote: "Everything you can imagine is real.", author: "Pablo Picasso" },
  {
    quote:
      "Do what you feel in your heart to be right—for you'll be criticized anyway.",
    author: "Eleanor Roosevelt",
  },
  {
    quote: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
  {
    quote: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
  },
  {
    quote: "Start where you are. Use what you have. Do what you can.",
    author: "Arthur Ashe",
  },
  {
    quote: "You miss 100% of the shots you don't take.",
    author: "Wayne Gretzky",
  },
  {
    quote:
      "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
    author: "Ralph Waldo Emerson",
  },
  {
    quote: "I find that the harder I work, the more luck I seem to have.",
    author: "Thomas Jefferson",
  },
  {
    quote:
      "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart.",
    author: "Roy T. Bennett",
  },
  {
    quote: "Nothing is impossible, the word itself says ‘I’m possible’!",
    author: "Audrey Hepburn",
  },
  {
    quote: "Do what you can with all you have, wherever you are.",
    author: "Theodore Roosevelt",
  },
  {
    quote: "Act as if what you do makes a difference. It does.",
    author: "William James",
  },
  {
    quote: "Be yourself; everyone else is already taken.",
    author: "Oscar Wilde",
  },
  {
    quote:
      "You have power over your mind – not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius",
  },
  {
    quote: "Don't let yesterday take up too much of today.",
    author: "Will Rogers",
  },
  {
    quote: "I have not failed. I've just found 10,000 ways that won't work.",
    author: "Thomas Edison",
  },
  {
    quote: "Change your thoughts and you change your world.",
    author: "Norman Vincent Peale",
  },
  { quote: "Either you run the day or the day runs you.", author: "Jim Rohn" },
  { quote: "If you can dream it, you can do it.", author: "Walt Disney" },
  {
    quote:
      "Perfection is not attainable, but if we chase perfection we can catch excellence.",
    author: "Vince Lombardi",
  },
  {
    quote: "Quality means doing it right when no one is looking.",
    author: "Henry Ford",
  },
  {
    quote: "I attribute my success to this: I never gave or took any excuse.",
    author: "Florence Nightingale",
  },
  {
    quote:
      "Limitations live only in our minds. But if we use our imaginations, our possibilities become limitless.",
    author: "Jamie Paolinetti",
  },
];

export const affirmations = [
  {
    id: 1,
    title: "Overall Health Affirmations",
    description:
      "A powerful collection of affirmations designed to promote physical, mental, and emotional well-being, reinforcing a healthy and balanced lifestyle.",
    url: "https://youtu.be/lLMVefQKyaE?si=eq59oIe04BSzIqjc",
    image:
      "/affirmations/a-powerful-collection-of-affirmations-designed-to.png",
  },
  {
    id: 2,
    title: "Trauma Healing Affirmations",
    description:
      "A soothing set of affirmations aimed at fostering emotional resilience, healing past wounds, and promoting inner peace.",
    url: "https://youtu.be/9H5Bre278BU?si=LWZTlcyiuyG4Lkqh",
    image:
      "/affirmations/a-soothing-set-of-affirmations-aimed-at-fostering.png",
  },
  {
    id: 3,
    title: "Confidence, Success, and Wealth Affirmations",
    description:
      "Motivational affirmations to boost self-confidence, attract success, and cultivate a mindset of abundance and financial prosperity.",
    url: "https://youtu.be/GvAl2Q5Oj8k?si=m2iwmamJiPBZbhlj",
    image:
      "/affirmations/motivational-affirmations-to-boost-self-confidence.png",
  },
  {
    id: 4,
    title: "Happiness and Blissful Life Affirmations",
    description:
      "A series of uplifting affirmations to invite joy, gratitude, and fulfillment into daily life, enhancing overall happiness.",
    url: "https://youtu.be/eMkNUWDylUY?si=mUnj9h4PBkFiVqJM",
    image: "/affirmations/a-series-of-uplifting-affirmations-to-invite-joy.png",
  },
  {
    id: 5,
    title: "Positive Thinking 'I AM' Affirmations",
    description:
      "Empowering 'I AM' statements designed to reshape thoughts, encourage self-belief, and cultivate a strong, positive mindset.",
    url: "https://youtu.be/14G0pl1-IRQ?si=C5i4EZFXdr1wo8MM",
    image:
      "/affirmations/empowering--i-am--statements-designed-to-reshape-t.png",
  },
  {
    id: 6,
    title: "Abundance Affirmations",
    description:
      "A set of affirmations to attract prosperity, financial success, and a life filled with unlimited possibilities and opportunities.",
    url: "https://youtu.be/HmjrC-A5l7o?si=1aPid1T2ZiWUZBKJ",
    image:
      "/affirmations/a-set-of-affirmations-to-attract-prosperity--finan.png",
  },
  {
    id: 7,
    title: "Self Love Affirmations",
    description:
      "Affirmations that nurture self-acceptance, compassion, and appreciation, fostering a deep sense of love and respect for oneself.",
    url: "https://youtu.be/_eU3nHz_e34?si=w_1Hole-erO2C0x1",
    image:
      "/affirmations/affirmations-that-nurture-self-acceptance--compass.png",
  },
  {
    id: 8,
    title: "Self Worth, Value, and Respect Affirmations",
    description:
      "Encouraging affirmations to reinforce personal worth, set healthy boundaries, and inspire self-respect and dignity.",
    url: "https://youtu.be/e35HHbd25ho?si=rCI9n2xDD-gckuWh",
    image:
      "/affirmations/encouraging-affirmations-to-reinforce-personal-wor.png",
  },
  {
    id: 9,
    title: "Self Concept Affirmations",
    description:
      "Affirmations crafted to help reshape self-identity, enhance self-esteem, and align personal beliefs with confidence and success.",
    url: "https://youtu.be/-wKJB-bSpL4?si=TZ8Qa1LwJgZe10kz",
    image:
      "/affirmations/affirmations-crafted-to-help-reshape-self-identity.png",
  },
  {
    id: 10,
    title: "Mental Clarity Affirmations",
    description:
      "Focused affirmations to improve concentration, clear mental fog, and promote a sharp, peaceful, and organized mind.",
    url: "https://youtu.be/U1bl5QslMLk?si=zoYw-HuKfueS9aSN",
    image:
      "/affirmations/focused-affirmations-to-improve-concentration--cle.png",
  },
];

export const songs = [
  { title: "400HZ", src: "/music/400HZ.mp3" },
  { title: "432HZ", src: "/music/432HZMeditation.mp3" },
  { title: "Calming Music", src: "/music/CalmingMusic.mp3" },
  { title: "Classical Music", src: "/music/ClassicalMusic.mp3" },
  { title: "Deep Music", src: "/music/DeepMusic.mp3" },
  { title: "Meditation Music", src: "/music/MeditationMusic.mp3" },
  { title: "Meditation Piano", src: "/music/MeditationPiano.mp3" },
  { title: "Most Relaxing Piano", src: "/music/MostRelaxingPiano.mp3" },
  { title: "Music Mindfullness", src: "/music/MusicMindfulness.mp3" },
  {
    title: "Peaceful Instrumental Piano ",
    src: "/music/PeacefulInstrumentalPiano.mp3",
  },
  {
    title: "Relaxing Acoustic Guitar",
    src: "/music/RelaxingAcousticGuitar.mp3",
  },
  {
    title: "Relaxing Background Music",
    src: "/music/RelaxingBackgroundMusic.mp3",
  },
  { title: "Relaxing Classic Guitar", src: "RelaxingClassicGuitar.mp3" },
  {
    title: "Relaxing Music and Alarm",
    src: "/music/RelaxingMusicAndAlarm.mp3",
  },
  { title: "Relaxing Power Nap", src: "/music/RelaxingPowerNap.mp3" },
  { title: "Relaxing Romantic Music", src: "/music/RelaxingRomanticMusic.mp3" },
  { title: "Soft Music", src: "/music/SoftMusic.mp3" },
  { title: "Soft Piano", src: "/music/SoftPiano.mp3" },
  { title: "Super Deep Meditation", src: "/music/SuperDeepMeditation.mp3" },
  { title: "Walk with him", src: "/music/WalkWithHim.mp3" },
];

export const moodData = [
  {
    id: 1,
    name: "Neutral",
    color: "bg-gray-400",
    icon: "/moods/neutral.png",
    suggestions: [
      "Enjoy the present moment and take a deep breath.",
      "Take some time to relax, maybe listen to calming music.",
      "Engage in a simple, calming activity like stretching or journaling.",
      "Reflect on things you're grateful for or things you've accomplished.",
      "Embrace the peace, focus on being in the here and now.",
      "Spend some time outdoors to recharge your energy.",
    ],
  },
  {
    id: 2,
    name: "Happy",
    color: "bg-yellow-400",
    icon: "/moods/smiley.png",
    suggestions: [
      "Keep spreading positivity!",
      "Celebrate small wins.",
      "Share your happiness with others.",
      "Take a moment to enjoy the good things in life.",
      "Practice gratitude to amplify your joy.",
      "Keep that smile going, it brightens up the world!",
    ],
  },
  {
    id: 3,
    name: "Anxious",
    color: "bg-teal-400",
    icon: "/moods/anxious.png",
    suggestions: [
      "Channel your energy into something creative!",
      "Celebrate your excitement with others!",
      "Make a plan to accomplish something you've been wanting to do.",
      "Use your excitement to motivate you to reach your goals.",
      "Find ways to keep your enthusiasm going.",
      "Share your excitement with friends or family!",
    ],
  },
  {
    id: 4,
    name: "Sad",
    color: "bg-blue-400",
    icon: "/moods/sad.png",
    suggestions: [
      "Take some time for self-care.",
      "Talk to someone you trust about your feelings.",
      "Journaling can help process your emotions.",
      "Do something that relaxes you, like reading or walking.",
      "Consider watching something that makes you laugh.",
      "Practice mindfulness or meditation to find peace.",
    ],
  },
  {
    id: 5,
    name: "Angry",
    color: "bg-red-400",
    icon: "/moods/angry.png",
    suggestions: [
      "Try some deep breathing exercises.",
      "Take a walk to cool off and reset.",
      "Reflect on what triggered your anger and how to address it.",
      "Practice mindfulness or meditation to calm your mind.",
      "Write down your feelings as a form of release.",
      "Engage in a physical activity to release tension.",
    ],
  },
];

export const getPreviewText = (htmlContent, maxLength) => {
  const div = document.createElement("div");
  div.innerHTML = htmlContent;
  const text = div.textContent || div.innerText || "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

export const getPreviewHtml = (htmlContent, maxLength) => {
  const div = document.createElement("div");
  div.innerHTML = htmlContent;
  return div.innerHTML.length > maxLength
    ? div.innerHTML.substring(0, maxLength) + "..."
    : div.innerHTML;
};

export const sexualOrientationOptions = [
  { value: "Lesbian", label: "Lesbian" },
  { value: "Gay", label: "Gay" },
  { value: "Bisexual", label: "Bisexual" },
  { value: "Pansexual", label: "Pansexual" },
  { value: "Asexual", label: "Asexual" },
  { value: "Aromantic", label: "Aromantic" },
  { value: "Demisexual", label: "Demisexual" },
  { value: "Demiromantic", label: "Demiromantic" },
  { value: "Heterosexual", label: "Heterosexual" },
  { value: "Homosexual", label: "Homosexual" },
  { value: "Queer", label: "Queer" },
  { value: "Questioning", label: "Questioning" },
  { value: "Polysexual", label: "Polysexual" },
  { value: "Androsexual", label: "Androsexual" },
  { value: "Gynosexual", label: "Gynosexual" },
  { value: "Skoliosexual", label: "Skoliosexual" },
  { value: "Omnisexual", label: "Omnisexual" },
  { value: "Graysexual", label: "Graysexual" },
  { value: "Grayromantic", label: "Grayromantic" },
  { value: "Allosexual", label: "Allosexual" },
];

export const genderIdentityOptions = [
  { value: "Cisgender", label: "Cisgender" },
  { value: "Transgender", label: "Transgender" },
  { value: "Nonbinary", label: "Nonbinary" },
  { value: "Genderqueer", label: "Genderqueer" },
  { value: "Agender", label: "Agender" },
  { value: "Bigender", label: "Bigender" },
  { value: "Demiboy", label: "Demiboy" },
  { value: "Demigirl", label: "Demigirl" },
  { value: "Two-spirit", label: "Two-spirit" },
  { value: "Androgynous", label: "Androgynous" },
  { value: "Pangender", label: "Pangender" },
  { value: "Xenogender", label: "Xenogender" },
  { value: "Questioning", label: "Questioning" },
  { value: "Third Gender", label: "Third Gender" },
  { value: "Intersex", label: "Intersex" },
];

export const pronounsOptions = [
  { value: "He/Him/His", label: "He/Him/His" },
  { value: "She/Her/Hers", label: "She/Her/Hers" },
  { value: "They/Them/Theirs", label: "They/Them/Theirs" },
  { value: "Ze/Zir/Zirs", label: "Ze/Zir/Zirs" },
  { value: "Xe/Xem/Xyrs", label: "Xe/Xem/Xyrs" },
  { value: "Ve/Vir/Vis", label: "Ve/Vir/Vis" },
  { value: "E/Em/Eirs", label: "E/Em/Eirs" },
  { value: "Ey/Em/Eir", label: "Ey/Em/Eir (Spivak Pronouns)" },
  { value: "Other", label: "Other" },
  { value: "Prefer not to say", label: "Prefer not to say" },
];

export const moodColors = {
  Happy: "#FDC700",
  Sad: "#51A2FF",
  Angry: "#FF6467",
  Neutral: "#99A1AF",
  Anxious: "#00D5BE",
};

export const authenticate = (data, next) => {
  if (window !== "undefined") {
    sessionStorage.setItem("token", JSON.stringify(data.token));
    sessionStorage.setItem("user", JSON.stringify(data.user));
  }
  next();
};

export const getUser = () => {
  if (window !== "undefined") {
    if (sessionStorage.getItem("user")) {
      return JSON.parse(sessionStorage.getItem("user"));
    } else {
      return false;
    }
  }
};

export const setUser = (data) => {
  if (window !== "undefined") {
    sessionStorage.setItem("user", JSON.stringify(data.user));
  }
};

export const logout = (next) => {
  if (window !== "undefined") {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  }
  next();
};

const getToastPosition = () => {
  return window.innerWidth < 768 ? "top-center" : "bottom-right";
};

export const notifySuccess = (message) => {
  toast.success(message, {
    position: getToastPosition(),
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  });
};

// Notify error message using Toastify
export const notifyError = (message) => {
  toast.error(message, {
    position: getToastPosition(),
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  });
};

export const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatDateTime = (dateString) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Enables 12-hour format with AM/PM
  };
  return new Date(dateString).toLocaleString(undefined, options);
};

export const getAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

export const getRandomColor = () => {
  const colors = ["#C8A2C8", "#FFDAB9", "#B0E0E6", "#B5EAD7", "#F4DAD1"];
  return colors[Math.floor(Math.random() * colors.length)];
};
