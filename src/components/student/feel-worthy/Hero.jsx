import React from 'react';
import FadeIn from './FadeIn';

const Hero = () => {
  const scrollToAchievements = () => {
    const achievementSection = document.getElementById('achievement-journal');
    if (achievementSection) {
      achievementSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-feelworthy-cream min-h-[85vh] flex items-center">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-feelworthy-pink/20 blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-32 left-[5%] w-80 h-80 rounded-full bg-feelworthy-mint/30 blur-3xl animate-pulse-slow"></div>
      
      <div className="container mx-auto px-6 md:px-10 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn delay={300} duration={800}>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-feelworthy-teal/20 text-slate-800 inline-block mb-6">
              PERSONAL GROWTH
            </span>
          </FadeIn>
          
          <FadeIn delay={500} duration={800}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-slate-800">
              Celebrate Your <span className="text-feelworthy-teal">Feelworthy</span> Moments
            </h1>
          </FadeIn>
          
          <FadeIn delay={700} duration={800}>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
              A space to remind yourself of your achievements, boost your self-esteem, 
              and overcome comparison anxiety.
            </p>
          </FadeIn>
          
          <FadeIn delay={900} duration={800}>
            <button 
              onClick={scrollToAchievements}
              className="px-8 py-4 rounded-lg bg-feelworthy-teal text-green-800 font-medium 
                shadow-lg shadow-feelworthy-teal/20 transform transition-all 
                hover:shadow-xl hover:shadow-feelworthy-teal/30 hover:scale-[1.02] 
                active:scale-[0.98] active:shadow-md">
              Start Your Journey
            </button>
          </FadeIn>
        </div>
      </div>
      
      {/* Decorative floating shapes */}
      <div className="absolute bottom-[20%] right-[15%] w-16 h-16 rounded-xl bg-feelworthy-pink/80 backdrop-blur-md 
        border border-white/20 shadow-xl animate-float" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute top-[25%] left-[10%] w-12 h-12 rounded-full bg-feelworthy-mint/80 backdrop-blur-md 
        border border-white/20 shadow-xl animate-float" style={{ animationDelay: '1.2s' }}></div>
      <div className="absolute top-[35%] right-[25%] w-10 h-10 rounded-md bg-feelworthy-cream/80 backdrop-blur-md 
        border border-white/20 shadow-xl animate-float" style={{ animationDelay: '0.8s' }}></div>
    </section>
  );
};

export default Hero;
