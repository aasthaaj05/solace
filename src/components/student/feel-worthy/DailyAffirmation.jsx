import React, { useState, useEffect } from 'react';
import FadeIn from './FadeIn';
import { RefreshCw } from 'lucide-react';
import { useToast } from "../../../hooks/use-toast";

const affirmations = [
  "I am worthy of love and respect.",
  "My value is not determined by others' opinions.",
  "I embrace my uniqueness and celebrate my journey.",
  "I am enough exactly as I am.",
  "My accomplishments are valuable, no matter how small.",
  "I deserve to take up space in this world.",
  "I am not defined by my mistakes or failures.",
  "I am growing and evolving every day.",
  "I choose to focus on my progress, not perfection.",
  "I am capable of achieving my goals.",
  "I release the need to compare myself to others.",
  "I honor my own pace and journey.",
  "I am proud of who I am becoming.",
  "I trust myself and my decisions.",
  "My self-worth is not tied to my productivity.",
  "I deserve to celebrate my achievements.",
  "I am resilient and can overcome challenges.",
  "I treat myself with kindness and patience.",
  "I acknowledge my strength in vulnerability.",
  "I am exactly where I need to be right now."
];

const DailyAffirmation = () => {
  const [currentAffirmation, setCurrentAffirmation] = useState('');
  const [isChanging, setIsChanging] = useState(false);
  const [cooldownActive, setCooldownActive] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const { toast } = useToast();
  
  const COOLDOWN_DURATION = 30; // Cooldown period in seconds
  const AUTO_CHANGE_INTERVAL = 5000; // Auto-change every 5 seconds
  
  const getRandomAffirmation = () => {
    const savedAffirmation = localStorage.getItem('currentAffirmation');
    
    if (savedAffirmation) {
      return savedAffirmation;
    } else {
      const randomIndex = Math.floor(Math.random() * affirmations.length);
      return affirmations[randomIndex];
    }
  };
  
  useEffect(() => {
    setCurrentAffirmation(getRandomAffirmation());
  }, []);
  
  useEffect(() => {
    if (currentAffirmation) {
      localStorage.setItem('currentAffirmation', currentAffirmation);
    }
  }, [currentAffirmation]);
  
  useEffect(() => {
    let timer;
    if (cooldownActive && cooldownTime > 0) {
      timer = setTimeout(() => {
        setCooldownTime(prevTime => {
          if (prevTime <= 1) {
            setCooldownActive(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [cooldownActive, cooldownTime]);
  
  // Auto-change affirmation every 5 seconds
  useEffect(() => {
    const autoChangeTimer = setInterval(() => {
      if (!isChanging) {
        setIsChanging(true);
        
        setTimeout(() => {
          let newAffirmation;
          do {
            const randomIndex = Math.floor(Math.random() * affirmations.length);
            newAffirmation = affirmations[randomIndex];
          } while (newAffirmation === currentAffirmation);
          
          setCurrentAffirmation(newAffirmation);
          setIsChanging(false);
        }, 500);
      }
    }, AUTO_CHANGE_INTERVAL);
    
    return () => clearInterval(autoChangeTimer);
  }, [currentAffirmation, isChanging]);
  
  const handleNewAffirmation = () => {
    if (cooldownActive) {
      toast({
        title: "Please wait",
        description: `Take a moment to reflect (${cooldownTime} seconds remaining)`,
        variant: "default",
      });
      return;
    }
    
    setIsChanging(true);
    
    setTimeout(() => {
      let newAffirmation;
      do {
        const randomIndex = Math.floor(Math.random() * affirmations.length);
        newAffirmation = affirmations[randomIndex];
      } while (newAffirmation === currentAffirmation);
      
      setCurrentAffirmation(newAffirmation);
      setIsChanging(false);
      
      // Start cooldown
      setCooldownActive(true);
      setCooldownTime(COOLDOWN_DURATION);
    }, 500);
  };
  
  return (
    <section className="py-20 bg-feelworthy-teal/10">
      <div className="container mx-auto px-6 md:px-10">
        <FadeIn delay={200}>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-feelworthy-teal/20 text-slate-800 inline-block mb-4">
                DAILY REMINDER
              </span>
              <h2 className="text-3xl font-bold text-slate-800">Your Affirmation for Today</h2>
            </div>
            
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden border border-slate-100">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-feelworthy-pink/10 -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-feelworthy-mint/20 translate-y-1/3 -translate-x-1/3"></div>
              
              <div className="relative text-center">
                <div 
                  className={`text-2xl md:text-3xl font-medium text-slate-800 mb-8 min-h-[120px] flex items-center justify-center transition-opacity duration-500 ${isChanging ? 'opacity-0' : 'opacity-100'}`}
                >
                  "{currentAffirmation}"
                </div>
                
                <button 
                  onClick={handleNewAffirmation}
                  className={`px-5 py-3 rounded-lg font-medium inline-flex items-center gap-2 
                    transition-colors ${cooldownActive 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-feelworthy-teal/10 text-feelworthy-teal hover:bg-feelworthy-teal/20'}`}
                  disabled={isChanging}
                >
                  <RefreshCw size={18} className={`transition-transform duration-300 ${isChanging ? 'animate-spin' : ''}`} />
                  <span>
                    {cooldownActive 
                      ? `Reflect (${cooldownTime}s)` 
                      : 'New Affirmation'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default DailyAffirmation;
