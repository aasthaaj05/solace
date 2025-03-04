import React, { useState, useEffect } from "react";
import { cn } from "../lib/utils";
import { getAffirmationForPhase } from "../utils/affirmations";
import { Heart, Quote } from "lucide-react";

const AffirmationCard = ({
  phaseName,
  className,
  color = "#F7CFD8",
}) => {
  const [affirmation, setAffirmation] = useState({ 
    text: "", 
    author: "" 
  });
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const newAffirmation = getAffirmationForPhase(phaseName);
    setAffirmation({
      text: newAffirmation.text,
      author: newAffirmation.author || ""
    });
  }, [phaseName]);

  const handleNewAffirmation = () => {
    setIsFlipped(true);
    setTimeout(() => {
      const newAffirmation = getAffirmationForPhase(phaseName);
      setAffirmation({
        text: newAffirmation.text,
        author: newAffirmation.author || ""
      });
      setIsFlipped(false);
    }, 500);
  };

  const cardStyle = {
    backgroundColor: `${color}20`, // 20% opacity
    borderColor: `${color}40`, // 40% opacity
  };

  return (
    <div
      className={cn(
        "glass-morphism rounded-2xl p-6 w-full max-w-md mx-auto transition-all duration-300 transform hover:shadow-md",
        isFlipped ? "opacity-0 scale-95" : "opacity-100 scale-100",
        className
      )}
      style={cardStyle}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-full" style={{ backgroundColor: `${color}40` }}>
          <Quote size={16} className="text-gray-700" />
        </div>
        <h3 className="font-medium text-sm">{phaseName} Message</h3>
      </div>
      
      <p className="text-xl font-light mb-2 text-balance leading-relaxed">
        "{affirmation.text}"
      </p>
      
      {affirmation.author && (
        <p className="text-sm text-gray-600 italic mb-4">— {affirmation.author}</p>
      )}
      
      <button
        onClick={handleNewAffirmation}
        className="flex items-center gap-2 text-sm mt-2 px-4 py-2 rounded-full transition-colors duration-300 hover:bg-black/5"
      >
        <Heart size={14} className="text-pastel-pink" />
        <span>New message</span>
      </button>
    </div>
  );
};

export default AffirmationCard;
