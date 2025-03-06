import React from "react";

const SexualHealth = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md my-10">
      <h1 className="text-2xl font-bold text-center mb-4">
        LGBTQIA+ Sexual Health Awareness
      </h1>
      <img
        src="/articles/sexualHealth.png"
        alt="Stethoscope with LGBTQ+ pride ribbon"
        className="w-full rounded-lg mb-4"
      />
      <p className="text-gray-700">
        Sexual health education serves as a cornerstone for individual
        well-being, yet traditional curricula often overlook the unique needs of
        LGBTQIA+ individuals. Addressing issues such as safe sex practices, STI
        prevention, and reproductive health through inclusive education ensures
        that LGBTQIA+ individuals receive the comprehensive care they deserve.
      </p>
      <h2 className="text-xl font-bold mt-6 mb-2">
        Importance of Inclusive Sexual Health Education
      </h2>
      <p className="text-gray-700">
        Inclusive sexual health education acknowledges and respects the diverse
        experiences of LGBTQIA+ individuals. By incorporating information
        relevant to all sexual orientations and gender identities, such programs
        foster a more accepting environment and equip students with accurate
        knowledge. Research indicates that access to LGBTQ-inclusive sexual
        health education is associated with improved health outcomes and reduced
        impacts from stigma among LGBTQ youth, including lower rates of
        depression and bullying.
        <a
          href="https://www.childtrends.org/"
          className="text-blue-500 underline"
        >
          Child Trends
        </a>
      </p>
      <p className="text-gray-700 mt-5">
        Despite these benefits, a significant gap persists in the implementation
        of inclusive curricula. As of recent studies, only 17 states and the
        District of Columbia report LGBTQ-inclusive sex education in at least
        half of their schools.
        <a
          href="https://www.childtrends.org/"
          className="text-blue-500 underline"
        >
          Child Trends
        </a>
      </p>
      <h2 className="text-xl font-bold mt-6 mb-2">
        Common Misconceptions About LGBTQIA+ Sexual Health
      </h2>
      <p className="text-gray-700">
        Misconceptions surrounding LGBTQIA+ sexual health can lead to inadequate
        education and healthcare services. Common myths include:
      </p>
      <ul className="list-disc pl-5 mt-4 text-gray-700">
        <li>
          <strong>
            LGBTQIA+ Individuals Don't Need Sexual Health Education:
          </strong>{" "}
          Assuming that LGBTQIA+ individuals are not at risk ignores the reality
          that they can and do engage in sexual activities, necessitating
          education on safe practices.
        </li>
        <li>
          <strong>STIs Are Only a Concern for Specific Groups:</strong>{" "}
          Believing that only certain populations are at risk for sexually
          transmitted infections overlooks the fact that anyone, regardless of
          orientation or identity, can be affected.
        </li>
        <li>
          <strong>
            Reproductive Health Isn't Relevant to LGBTQIA+ People:
          </strong>{" "}
          This misconception fails to recognize that many LGBTQIA+ individuals
          may pursue parenthood and require information on reproductive options.
        </li>
      </ul>
      <p className="text-gray-700">
        Dispelling these myths through comprehensive education is vital for
        promoting the health and well-being of LGBTQIA+ communities.
      </p>
      <h2 className="text-xl font-bold mt-6 mb-2">
        Access to Affirming Healthcare Providers
      </h2>
      <p className="text-gray-700">
        Finding healthcare providers who are knowledgeable and sensitive to
        LGBTQIA+ health needs is crucial for effective care. Affirming providers
        create environments where patients feel safe discussing their sexual
        health without fear of judgment or discrimination.
      </p>
      <p className="text-gray-700 mt-5">
        Resources such as the{" "}
        <a
          href="https://www.lgbtqhealthcaredirectory.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          LGBTQ+ Healthcare Directory
        </a>{" "}
        offer free, searchable databases to help individuals locate affirming
        doctors and medical professionals across the United States and Canada.
      </p>

      <p className="text-gray-700 mt-5">
        Similarly, the{" "}
        <a
          href="https://www.outcarehealth.org/outlist/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          OutList directory
        </a>{" "}
        connects LGBTQIA+ individuals with friendly and affirming healthcare
        providers.
      </p>
    </div>
  );
};

export default SexualHealth;
