import React from "react";

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-pastel-pink/30 via-white to-pastel-blue/30"></div>
      
      {/* Animated shapes */}
      <div className="absolute top-[10%] left-[10%] w-60 h-60 rounded-full bg-pastel-yellow/20 animate-float" 
           style={{ animationDelay: "0s" }}></div>
      <div className="absolute top-[40%] right-[15%] w-80 h-80 rounded-full bg-pastel-teal/20 animate-float"
           style={{ animationDelay: "1s" }}></div>
      <div className="absolute bottom-[10%] left-[20%] w-72 h-72 rounded-full bg-pastel-pink/20 animate-float"
           style={{ animationDelay: "2s" }}></div>
      <div className="absolute top-[60%] right-[25%] w-40 h-40 rounded-full bg-pastel-blue/20 animate-float"
           style={{ animationDelay: "1.5s" }}></div>
      
      {/* Additional subtle elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent to-white/30 opacity-50"></div>
    </div>
  );
};

export default AnimatedBackground;