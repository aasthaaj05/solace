import React, { useState } from "react";
import { Calendar, GraduationCap, Plus, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { format } from "date-fns";

const ExamForm = ({ 
  onAddExam, 
  className,
  style 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (examName.trim() && examDate) {
      onAddExam(examName.trim(), new Date(examDate));
      setExamName("");
      setExamDate(format(new Date(), "yyyy-MM-dd"));
      setIsOpen(false);
    }
  };

  return (
    <div className={cn("w-full max-w-md mx-auto", className)} style={style}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full glass-morphism rounded-xl p-4 flex items-center justify-center gap-2 text-sm font-medium transition-all duration-300 hover:shadow-md hover:bg-white/50 text-gray-800"
        >
          <Plus size={16} />
          <span>Add Exam</span>
        </button>
      ) : (
        <div className="glass-morphism rounded-xl p-5 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-800">Add New Exam</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-black/5 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="flex items-center gap-2 text-sm mb-2 text-gray-800">
                <GraduationCap size={14} />
                <span>Exam Name</span>
              </label>
              <input
                type="text"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-pastel-teal/50 transition-all text-gray-800"
                placeholder="e.g., Mathematics Final"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm mb-2 text-gray-600">
                <Calendar size={14} />
                <span>Exam Date</span>
              </label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-pastel-teal/50 transition-all text-gray-800"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-pastel-blue/80 hover:bg-pastel-blue transition-colors text-gray-800 font-medium"
            >
              Save Exam
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ExamForm;
