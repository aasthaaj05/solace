import React from "react";
import { cn } from "../../lib/utils";
import { Calendar, Clock } from "lucide-react";
import { formatExamDate, getDaysUntilExam, getCurrentPhase, isToday, EXAM_PHASES } from "../../../utils/dateUtils";

const ExamTimeline = ({
  exams,
  onDeleteExam,
  className,
  style,
}) => {
  // Sort exams by date
  const sortedExams = [...exams].sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <div className={cn("w-full max-w-md mx-auto", className)} style={style}>
      <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
        <Calendar size={18} className="text-pastel-blue" />
        <span>Your Exams</span>
      </h2>
      
      {sortedExams.length === 0 ? (
        <div className="glass-morphism rounded-xl p-6 text-center">
          <p className="text-gray-500">Add an exam to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedExams.map((exam) => {
            const phase = getCurrentPhase(exam.date);
            const today = isToday(exam.date);
            
            return (
              <div
                key={exam.id}
                className={cn(
                  "glass-morphism rounded-xl p-4 transition-all duration-300 animate-fade-in",
                  today ? "border-2 border-pastel-pink" : ""
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-balance">{exam.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <Clock size={14} />
                      <span>{formatExamDate(exam.date)}</span>
                    </div>
                    
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-black/5">
                        {getDaysUntilExam(exam.date)}
                      </span>
                      
                      {phase && (
                        <span 
                          className="text-xs px-2.5 py-1 rounded-full text-gray-700"
                          style={{ backgroundColor: `${phase.color}50` }}
                        >
                          {phase.name}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onDeleteExam(exam.id)}
                    className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={14} className="text-gray-400 hover:text-gray-600" />
                  </button>
                </div>
                
                {phase && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: phase.color }}></div>
                        <span>{phase.name}</span>
                      </div>
                      <span>•</span>
                      <span>{phase.description}</span>
                    </div>
                    
                    <div className="bg-white/60 rounded-lg p-2">
                      <div className="flex space-x-1">
                        {EXAM_PHASES.map((p, index) => (
                          <div 
                            key={index} 
                            className={cn(
                              "h-1.5 flex-1 rounded-full transition-all",
                              p.name === phase.name 
                                ? "bg-opacity-100" 
                                : "bg-opacity-30"
                            )}
                            style={{ backgroundColor: p.color }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExamTimeline;

// Internal component
const X = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
