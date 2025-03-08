import React from "react";
import { cn } from "../../lib/utils";
import { Heart } from "lucide-react";

const Header = ({ className }) => {
  return (
    <header className={cn("w-full z-10 flex items-center justify-center py-6", className)}>
  <div className="glass-morphism px-5 py-3 rounded-full flex items-center gap-2 shadow-sm animate-fade-in">
    <Heart size={30} className="text-pastel-pink" />
    <h1 className="text-xl font-medium tracking-tight">Exam Harmony</h1>
  </div>
</header>
  );
};

export default Header;
