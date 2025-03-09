import React from "react";
import StudNavbar from "../../student/StudNavbar";

const Helpline = () => {
  // List of helpline numbers
  const helplineNumbers = [
    {
      name: "National Suicide Prevention Lifeline",
      number: "1-800-273-TALK (8255)",
      description: "Available 24/7 for emotional support and suicide prevention.",
    },
    {
      name: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "Free, 24/7 support for those in crisis via text messaging.",
    },
    {
      name: "National Domestic Violence Hotline",
      number: "1-800-799-SAFE (7233)",
      description: "Confidential support for domestic violence victims.",
    },
    {
      name: "Substance Abuse and Mental Health Services Administration (SAMHSA)",
      number: "1-800-662-HELP (4357)",
      description: "24/7 helpline for substance abuse and mental health issues.",
    },
    {
      name: "Trevor Project (LGBTQ+ Support)",
      number: "1-866-488-7386",
      description: "24/7 support for LGBTQ+ youth in crisis.",
    },
    {
      name: "Childhelp National Child Abuse Hotline",
      number: "1-800-4-A-CHILD (1-800-422-4453)",
      description: "24/7 support for child abuse and neglect.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F8D3] flex flex-col">
      {/* Navbar */}
      <StudNavbar />

      {/* Main Content */}
      <div className="flex-1 p-6 sm:p-8 md:p-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#73C7C7] mb-6 sm:mb-8 text-center">
          Helpline Numbers
        </h1>

        {/* Helpline Numbers List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {helplineNumbers.map((helpline, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <h2 className="text-xl sm:text-2xl font-semibold text-[#73C7C7] mb-2">
                {helpline.name}
              </h2>
              <p className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                {helpline.number}
              </p>
              <p className="text-sm sm:text-base text-gray-600">
                {helpline.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Helpline;