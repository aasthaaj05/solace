import React from 'react';
import Hero from '../components/Hero';
import AchievementJournal from '../components/AchievementJournal';
import DailyAffirmation from '../components/DailyAffirmation';
import GratitudeSpace from '../components/GratitudeSpace';
import { ChevronUp } from 'lucide-react';

const Index = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <AchievementJournal />
      <DailyAffirmation />
      <GratitudeSpace />
      
      {/* Footer */}
      <footer className="bg-white py-12 px-6 border-t border-slate-100">
        <div className="container mx-auto text-center">
          <p className="text-slate-500 mb-6">
            Your journey to self-appreciation and inner peace starts here.
          </p>
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full bg-feelworthy-teal/10 text-feelworthy-teal flex items-center justify-center mx-auto
              hover:bg-feelworthy-teal/20 transition-colors"
            aria-label="Scroll to top"
          >
            <ChevronUp size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Index;
