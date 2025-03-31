import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "../components/user/Navbar";
import Footer from "../components/user/Footer";
import { Link } from "react-router-dom";
import React, { useRef, useEffect } from "react";
import ScrollColorText from "../components/user/ScrollColorText";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const items = [
  {
    id: 1,
    color: "from-red-300 to-blue-300",
    title: "Journaling",
    desc: "Reflect on your daily thoughts, emotions, and experiences with ease. Our journaling feature helps you gain clarity, set personal goals, and track your growth over time.",
    img: "/page/home/journal.png",
  },
  {
    id: 2,
    color: "from-blue-300 to-violet-300",
    title: "Mood Tracking",
    desc: "Stay in tune with your emotions by tracking your daily moods. Identify patterns, triggers, and gain insights that help you better understand your mental well-being.",
    img: "/page/home/mood.png",
  },
  {
    id: 3,
    color: "from-violet-300 to-purple-300",
    title: "AI-Powered Anxiety Test",
    desc: "Discover personalized insights about your anxiety levels through our AI-driven assessment tool. Get helpful feedback and recommendations to guide your mental health journey.",
    img: "/page/home/ai.png",
  },
  {
    id: 4,
    color: "from-purple-300 to-red-300",
    title: "Community Forum",
    desc: "Connect with others who understand your journey. Share experiences, offer support, and grow together in a safe, inclusive, and uplifting space.",
    img: "/page/home/community.png",
  },
];

const testimonials = [
  {
    name: "Aiden",
    rating: 5,
    feedback: "Napakalaking tulong ng journaling feature sa mental health ko!",
    description:
      "Bilang isang non-binary person, minsan mahirap i-express ang nararamdaman ko sa mga taong hindi lubos na nakakaunawa. Pero dahil sa journaling feature ng app na ito, nagkaroon ako ng ligtas na paraan para ilabas ang emotions ko. Ang AI anxiety prediction din ay sobrang nakatulong sa akin para malaman kung kailan ko dapat bigyan ng pahinga ang sarili ko.",
    image: "/testimonials/1.jpg",
  },
  {
    name: "Riley",
    rating: 4,
    feedback: "Napaka-warm at welcoming ng community forum!",
    description:
      "Bilang isang trans person, napakahirap humanap ng safe space kung saan puwede kong ibahagi ang struggles ko nang hindi hinuhusgahan. Pero sa community forum ng app na ito, nakahanap ako ng mga taong tunay na nakakaintindi at sumusuporta. Ang pakiramdam na hindi ako nag-iisa ay sobrang laki ng naitulong sa mental health ko.",
    image: "/testimonials/2.jpg",
  },
  {
    name: "Sky",
    rating: 5,
    feedback: "Ang AI mood tracking ay sobrang life-changing!",
    description:
      "Dahil sa app na ito, mas natutunan kong intindihin ang emotional patterns ko bilang isang queer person na dumaan sa maraming struggles. Ang AI mood tracking feature ay sobrang nakatulong sa akin para malaman kung kailan ako dapat mag-step back at alagaan ang sarili ko. Sobrang valuable ng tool na ito sa aking self-care journey!",
    image: "/testimonials/3.jpg",
  },
  {
    name: "Jace",
    rating: 5,
    feedback: "Hindi ko akalain na may ganitong supportive na platform!",
    description:
      "Bilang isang gay man na matagal nang lumalaban sa anxiety, ang AI-powered journaling at mood tracking feature ng app na ito ay naging malaking tulong sa akin. Mas naintindihan ko ang triggers ko at natutunan kong alagaan ang mental health ko sa tamang paraan.",
    image: "/testimonials/4.jpg",
  },
  {
    name: "Mika",
    rating: 4,
    feedback: "Mas madali kong naiintindihan ang emotions ko ngayon!",
    description:
      "Bilang isang bisexual na individual, madalas akong nagkakaroon ng identity struggles. Ang guided journaling feature ng app na ito ay nakatulong sa akin para magkaroon ng clarity sa aking thoughts at feelings. Isang malaking hakbang ito sa self-acceptance ko!",
    image: "/testimonials/5.jpg",
  },
  {
    name: "Luna",
    rating: 5,
    feedback: "Finally, may mental health app na inclusive para sa LGBTQ+!",
    description:
      "Napakahirap humanap ng mental health app na may tunay na inclusivity para sa LGBTQ+. Dito, hindi ko naramdamang nag-iisa ako. Ang AI mood tracking at community support ay naging lifeline ko sa panahon ng matinding anxiety at self-doubt.",
    image: "/testimonials/6.jpg",
  },
  {
    name: "Ezra",
    rating: 4,
    feedback: "Napaka-helpful ng meditation exercises!",
    description:
      "Bilang isang genderfluid person, madalas akong nakakaranas ng stress dahil sa pressure ng lipunan. Pero dahil sa guided meditation feature ng app na ito, natutunan kong i-ground ang sarili ko at magkaroon ng inner peace kahit sa gitna ng stress.",
    image: "/testimonials/7.jpg",
  },
  {
    name: "Kai",
    rating: 5,
    feedback: "LGBTQ+ representation sa mental health? Finally!",
    description:
      "Laking tuwa ko nang makita kong may isang app na hindi lang pangkaraniwan ang approach sa mental health, kundi may representation din para sa LGBTQ+. Ramdam ko ang suporta at malasakit, at talagang natulungan ako ng mood tracking at journaling features.",
    image: "/testimonials/8.jpg",
  },
  {
    name: "Theo",
    rating: 5,
    feedback: "Ang safe space na matagal ko nang hinahanap!",
    description:
      "Bilang isang pansexual, palaging may pangamba na baka hindi ako tanggap sa iba't ibang spaces. Pero dito, ramdam ko ang tunay na community. Ang supportive forum at mental health tools ay talagang nakatulong sa akin para magkaroon ng peace of mind.",
    image: "/testimonials/9.jpg",
  },
  {
    name: "Zion",
    rating: 4,
    feedback: "Sobrang nakatulong sa pag-manage ng anxiety ko!",
    description:
      "Bilang isang queer person na may social anxiety, napakahirap makahanap ng tool na talagang makakatulong sa akin. Pero ang app na ito, with its AI anxiety prediction at journaling, ay talagang nakatulong sa akin na mas maintindihan ang emotions ko.",
    image: "/testimonials/10.jpg",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

const PortfolioPage = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);

  return (
    <motion.div
      className="h-full"
      initial={{ y: "-200vh" }}
      animate={{ y: "0%" }}
      transition={{ duration: 1 }}
    >
      <Navbar />
      {/* Main Scrolling Section */}
      <div className="h-[600vh] relative" ref={ref}>
        <div className="w-screen h-screen overflow-hidden relative">
          <video className="w-full h-full object-cover" autoPlay loop muted>
            <source src={`/page/home/montage.mp4`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Card Message */}
          <div className="absolute bottom-10 left-10 bg-white bg-opacity-80 rounded-2xl shadow-lg p-4 max-w-sm">
            <h2 className="text-xl font-bold text-gray-800">
              Hello, We're True Self
            </h2>
            <p className="text-gray-700 mt-2">
              Our mission is to empower and support LGBTQ+ individuals by
              promoting inclusivity, providing vital resources, and fostering a
              community where everyone can embrace their true selves.
            </p>
          </div>
        </div>

        {/* Scrolling Items */}
        <div className="sticky top-0 flex h-screen gap-4 items-center overflow-hidden">
          <motion.div style={{ x }} className="flex">
            <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-purple-300 to-red-300" />
            {items.map((item) => (
              <div
                className={`h-screen w-screen flex items-center justify-center bg-gradient-to-r ${item.color}`}
                key={item.id}
              >
                <div className="flex flex-col gap-8 text-white items-center">
                  <h1 className="text-2xl font-bold md:text-4xl lg:text-6xl xl:text-8xl">
                    {item.title}
                  </h1>
                  <div className="relative w-80 h-32 md:w-96 md:h-64 lg:w-[500px] lg:h-[350px] xl:w-[600px] xl:h-[420px]">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="rounded-lg w-full h-full object-contain"
                    />
                  </div>
                  <p className="w-80 md:w-96 lg:w-[500px] lg:text-lg xl:w-[600px] text-center">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Quote Section */}
      <div className="my-20">
        <ScrollColorText />
      </div>

      <motion.div
        className="h-screen w-screen max-w-6xl mx-auto"
        initial={fadeUp.initial}
        whileInView={fadeUp.whileInView}
        transition={fadeUp.transition}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-bold text-center mb-8">
          What Our lients Say About Us
        </h2>
        <Swiper
          modules={[Navigation, Pagination]}
          initialSlide={1}
          spaceBetween={50}
          slidesPerView={1.3}
          centeredSlides={true}
          navigation={true}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1.5 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <motion.div
                className={`border rounded-2xl shadow-lg p-5 bg-white ${
                  index === 1 ? "border-blue-500" : ""
                }`}
                initial={fadeUp.initial}
                whileInView={fadeUp.whileInView}
                transition={fadeUp.transition}
                viewport={{ once: true }}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">
                    {testimonial.feedback}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {testimonial.description}
                  </p>
                </div>
                <div className="mt-4 flex">
                  {Array.from({ length: testimonial.rating }).map((_, idx) => (
                    <svg
                      key={idx}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-5 h-5 text-yellow-500"
                    >
                      <path d="M12 .587l3.668 7.429L24 9.747l-6 5.847L19.336 24 12 20.128 4.664 24 6 15.594 0 9.747l8.332-1.731L12 .587z" />
                    </svg>
                  ))}
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>

      <Footer />
    </motion.div>
  );
};

export default PortfolioPage;
