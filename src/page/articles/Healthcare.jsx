import React from "react";

const Healthcare = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md my-10">
      <h1 className="text-2xl font-bold text-center mb-4">
        Bridging the Healthcare Gap for LGBTQIA+ Individuals
      </h1>
      <img
        src="/articles/healthcare.png"
        alt="Stethoscope with LGBTQ+ pride ribbon"
        className="w-full rounded-lg mb-4"
      />
      <p className="text-gray-700">
        Access to quality healthcare is a fundamental right, yet LGBTQIA+
        individuals often face significant barriers in medical settings.
        Discrimination, stigma, and a lack of knowledgeable providers contribute
        to health disparities within this community. Implementing inclusive
        healthcare practices, such as LGBTQIA+ competency training for medical
        professionals, can markedly improve patient outcomes.
      </p>
      <h2 className="text-xl font-bold mt-6 mb-2">
        The Importance of LGBTQIA+ Inclusive Healthcare
      </h2>
      <p className="text-gray-700">
        Creating an inclusive healthcare environment is essential to ensure
        LGBTQIA+ individuals feel safe and respected when seeking medical care.
        Negative experiences, including discrimination and misunderstanding by
        healthcare providers, can lead to avoidance of medical services,
        resulting in delayed diagnoses and treatment. Inclusive practices foster
        trust and encourage individuals to engage in regular health
        maintenance.Inclusive healthcare involves recognizing and addressing the
        unique needs of LGBTQIA+ patients. This includes using correct pronouns,
        understanding specific health risks, and providing culturally competent
        care. Medical professionals trained in LGBTQIA+ health issues are better
        equipped to offer appropriate screenings, preventive measures, and
        treatments tailored to this population.
      </p>
      <h2 className="text-xl font-bold mt-6 mb-2">
        Common Health Disparities Faced by LGBTQIA+ Individuals
      </h2>
      <p className="text-gray-700">
        LGBTQIA+ individuals experience several health disparities compared to
        their heterosexual and cisgender counterparts:
      </p>
      <ul className="list-disc pl-5 mt-4 text-gray-700">
        <li>
          <strong>Mental Health:</strong> Higher prevalence of depression,
          anxiety, and suicidal ideation, often stemming from societal stigma
          and discrimination.{" "}
          <a
            href="https://lgbtqiahealtheducation.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            lgbtqiahealtheducation.org
          </a>
        </li>
        <li>
          <strong>Substance Use:</strong> Increased rates of smoking, alcohol
          consumption, and drug use as coping mechanisms for stress and
          discrimination.{" "}
          <a
            href="https://americanprogress.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            americanprogress.org
          </a>
        </li>
        <li>
          <strong>Chronic Conditions:</strong> Elevated risk of certain chronic
          diseases, partly due to barriers in accessing preventive care and
          screenings.{" "}
          <a
            href="https://kff.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            kff.org
          </a>
        </li>
        <li>
          <strong>Cancer Screenings:</strong> Transgender individuals may face
          challenges in receiving appropriate cancer screenings due to a lack of
          inclusive guidelines and knowledgeable providers.{" "}
          <a
            href="https://health.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            health.com
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Healthcare;
