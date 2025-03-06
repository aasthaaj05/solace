import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import AnimatedBackground from "../components/student/exam/AnimatedBackground"; 
import Header from "../components/student/exam/Header";
import ExamForm from "../components/student/exam/ExamForm";
import ExamTimeline from "../components/student/exam/ExamTimeline";
import AffirmationCard from "../components/student/exam/AffirmationCard";
import { getCurrentPhase, isExamSoon } from "../utils/dateUtils";
import { toast } from "sonner";
import { cn } from "../lib/utils";

const ExamIndex = () => {
  const [exams, setExams] = useState([]);
  const [activeExam, setActiveExam] = useState(null);

  useEffect(() => {
    // Load exams from localStorage on component mount
    const savedExams = localStorage.getItem("exams");
    if (savedExams) {
      try {
        const parsedExams = JSON.parse(savedExams).map((exam) => ({
          ...exam,
          date: new Date(exam.date),
        }));
        setExams(parsedExams);
      } catch (error) {
        console.error("Failed to parse saved exams:", error);
      }
    }
  }, []);

  useEffect(() => {
    // Save exams to localStorage whenever they change
    const examsToSave = exams.map(exam => ({
      ...exam,
      date: exam.date.toISOString(),
    }));
    localStorage.setItem("exams", JSON.stringify(examsToSave));

    // Find the most relevant exam (closest upcoming or most recent)
    if (exams.length > 0) {
      const now = new Date();
      const relevantExams = exams.filter(exam => isExamSoon(exam.date));
      
      if (relevantExams.length > 0) {
        // Sort by closeness to today
        relevantExams.sort((a, b) => {
          const distanceA = Math.abs(a.date.getTime() - now.getTime());
          const distanceB = Math.abs(b.date.getTime() - now.getTime());
          return distanceA - distanceB;
        });
        
        setActiveExam(relevantExams[0]);
      } else {
        setActiveExam(null);
      }
    } else {
      setActiveExam(null);
    }
  }, [exams]);

  const handleAddExam = (name, date) => {
    const newExam = {
      id: uuidv4(),
      name,
      date,
    };
    
    setExams([...exams, newExam]);
    toast("Exam added", {
      description: `${name} on ${date.toLocaleDateString()}`,
    });
  };

  const handleDeleteExam = (id) => {
    setExams(exams.filter(exam => exam.id !== id));
    toast("Exam removed");
  };

  const currentPhase = activeExam ? getCurrentPhase(activeExam.date) : null;

  return (
    <div className="min-h-screen w-full pb-12">
      <AnimatedBackground />
      
      <Header />
      
      <main className="container max-w-5xl px-4 mx-auto mt-6">
        <div className="flex flex-col items-center justify-center mb-8 text-center animate-fade-in">
          <div className="inline-block px-3 py-1 mb-3 text-xs font-medium rounded-full bg-pastel-teal/20 text-gray-700">
            Mental Health Support During Exams
          </div>
          <h1 className="text-3xl font-medium mb-3 tracking-tight md:text-4xl">Exam Harmony</h1>
          <p className="text-gray-600 max-w-lg">
            Helping you stay balanced and focused throughout your exam journey with timely support messages.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className={cn(
            "space-y-6 order-2 lg:order-1",
            activeExam ? "opacity-100" : "opacity-80"
          )}>
            <ExamTimeline 
              exams={exams} 
              onDeleteExam={handleDeleteExam} 
              className="animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            />
            
            <ExamForm 
              onAddExam={handleAddExam} 
              className="animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            />
          </div>
          
          <div className="order-1 lg:order-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            {currentPhase ? (
              <AffirmationCard 
                phaseName={currentPhase.name}
                color={currentPhase.color}
              />
            ) : (
              <div className="glass-morphism rounded-2xl p-6 w-full max-w-md mx-auto text-center">
                <h3 className="text-lg font-medium mb-3">No Active Exams</h3>
                <p className="text-gray-600 mb-4">
                  Add an exam that's within a week to receive supportive messages.
                </p>
                <div className="grid grid-cols-2 gap-3 mt-6">
                  {EXAM_PHASES.map((phase, index) => (
                    <div 
                      key={index}
                      className="p-3 rounded-lg text-xs"
                      style={{ backgroundColor: `${phase.color}30` }}
                    >
                      <p className="font-medium mb-1">{phase.name}</p>
                      <p className="text-gray-600 text-[10px]">{phase.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const EXAM_PHASES = [
  {
    name: "Preparation",
    description: "Weekly motivational affirmations",
    color: "#F4F8D3", // Yellow
    daysBeforeExam: 7,
  },
  {
    name: "Pre-Exam",
    description: "Calming quotes for the night before",
    color: "#A6F1E0", // Teal
    daysBeforeExam: 1,
  },
  {
    name: "Exam Day",
    description: "Uplifting messages for exam day",
    color: "#F7CFD8", // Pink
    daysBeforeExam: 0,
  },
  {
    name: "Recovery",
    description: "Gentle post-exam reminders",
    color: "#73C7C7", // Blue
    daysBeforeExam: -1, // After exam
  },
];

export default ExamIndex;
