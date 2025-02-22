import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

function Word({ text, delay }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [inView, controls]);

  const wordVariants = {
    hidden: { color: "#d1d5db", transition: { duration: 0.3 } },
    visible: {
      color: "#000",
      transition: {
        duration: 0.3,
        delay,
      },
    },
  };

  return (
    <motion.span
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={wordVariants}
    >
      {text}{" "}
    </motion.span>
  );
}

export default function ScrollColorText() {
  const sentence = [
    { text: "Embrace your ", important: false },
    { text: " true self 🌈", important: true, color: "#ff4081" },
    { text: "with our LGBT+ platform.", important: false },
    { text: "AI-powered anxiety test 🤖", important: true, color: "#7e57c2" },
    { text: "to predict severity,", important: false },
    { text: "track your mood 📊", important: true, color: "#42a5f5" },
    { text: "and reflect daily.", important: false },
    { text: "Join the community 🤝", important: true, color: "#66bb6a" },
    { text: "and share your journey.", important: false },
    { text: "Express freely 📝", important: true, color: "#ff7043" },
    { text: "with our journaling space.", important: false },
  ];

  return (
    <div className="h-screen flex items-center justify-center px-8">
      <h1 className="text-4xl md:text-4xl font-bold leading-relaxed text-center flex flex-wrap justify-center">
        {sentence.map((word, index) =>
          word.important ? (
            <span key={index} style={{ color: word.color }}>
              {word.text}{" "}
            </span>
          ) : (
            <Word key={index} text={word.text} delay={index * 0.1} />
          )
        )}
      </h1>
    </div>
  );
}
