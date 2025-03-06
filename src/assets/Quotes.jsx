import React, { useEffect, useState } from "react";

const quotes = [
  "Believe in yourself and all that you are!",
  "The only way to do great work is to love what you do. – Steve Jobs",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "Your limitation—it's only your imagination.",
  "Push yourself, because no one else is going to do it for you.",
];

const Quotes = () => {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <div className="bg-gradient-to-r from-[#F7CFD8] via-[#F4F8D3] to-[#A6F1E0] text-[#073C7C] p-4 rounded-lg shadow-md text-center">
      <h2 className="text-lg font-semibold">{quote}</h2>
    </div>
  );
};

export default Quotes;
