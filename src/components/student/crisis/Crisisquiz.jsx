import React, { useState } from 'react';
import { db } from '../../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './Crisisquiz.css';

const questions = [
    {
      id: 'situation1',
      text: 'You have an important exam tomorrow, but you feel unprepared. How do you react?',
      options: [
        { value: 1, label: 'Panic and avoid studying' },
        { value: 2, label: 'Cram all night without rest' },
        { value: 3, label: 'Make a quick revision plan' },
        { value: 4, label: 'Stay calm and review key concepts' },
        { value: 5, label: 'Follow a structured study schedule' }
      ]
    },
    {
      id: 'situation2',
      text: 'You receive a low grade on an assignment you worked hard on. How do you respond?',
      options: [
        { value: 1, label: 'Feel hopeless and give up' },
        { value: 2, label: 'Blame the professor or others' },
        { value: 3, label: 'Feel disappointed but move on' },
        { value: 4, label: 'Seek feedback and improve' },
        { value: 5, label: 'Analyze mistakes and plan better' }
      ]
    },
    {
      id: 'situation3',
      text: 'You see a classmate struggling with mental health issues. What do you do?',
      options: [
        { value: 1, label: 'Ignore and focus on yourself' },
        { value: 2, label: 'Avoid them because it’s uncomfortable' },
        { value: 3, label: 'Listen but don’t take action' },
        { value: 4, label: 'Encourage them to seek help' },
        { value: 5, label: 'Offer support and suggest resources' }
      ]
    },
    {
      id: 'situation4',
      text: 'You have multiple deadlines coming up. How do you manage your time?',
      options: [
        { value: 1, label: 'Procrastinate until the last minute' },
        { value: 2, label: 'Prioritize one task and ignore others' },
        { value: 3, label: 'Make a rough plan but feel overwhelmed' },
        { value: 4, label: 'Use a planner to organize tasks' },
        { value: 5, label: 'Follow a strict schedule with breaks' }
      ]
    },
    {
      id: 'situation5',
      text: 'A personal crisis (family issue, health problem) is affecting your studies. How do you cope?',
      options: [
        { value: 1, label: 'Ignore it and let stress build up' },
        { value: 2, label: 'Avoid talking about it' },
        { value: 3, label: 'Try to balance but struggle' },
        { value: 4, label: 'Seek support from friends/family' },
        { value: 5, label: 'Use counseling or self-care strategies' }
      ]
    },
    {
      id: 'situation6',
      text: 'A classmate spreads false rumors about you. How do you handle it?',
      options: [
        { value: 1, label: 'Get angry and confront them' },
        { value: 2, label: 'Ignore and let it affect you' },
        { value: 3, label: 'Talk to a close friend about it' },
        { value: 4, label: 'Calmly clarify the truth if needed' },
        { value: 5, label: 'Report it if it’s serious harassment' }
      ]
    },
    {
      id: 'situation7',
      text: 'During a group project, your teammates are not contributing. What do you do?',
      options: [
        { value: 1, label: 'Do all the work alone and resent them' },
        { value: 2, label: 'Complain but take no action' },
        { value: 3, label: 'Talk to them but accept the situation' },
        { value: 4, label: 'Encourage teamwork and divide tasks' },
        { value: 5, label: 'Seek help from the professor if needed' }
      ]
    }
  ];
  

  
function Crisisquiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');

  const handleAnswer = (value) => {
    const newAnswers = { ...answers };
    newAnswers[questions[currentQuestionIndex].id] = value;
    setAnswers(newAnswers);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
  };

  const handleSubmit = async () => {
    if (!userId.trim()) {
      alert('Please enter your ID to submit the questionnaire');
      return;
    }

    setLoading(true);
    
    // Calculate total score
    let totalScore = 0;
    for (const questionId in answers) {
      totalScore += answers[questionId];
    }
    
    try {
      await addDoc(collection(db, 'responses'), {
        userId,
        answers,
        totalScore,
        maxPossibleScore: questions.length * 5,
        submittedAt: serverTimestamp()
      });
      
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      alert('There was an error submitting your response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSubmitted(false);
    setUserId('');
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasAnsweredAllQuestions = Object.keys(answers).length === questions.length;

  if (submitted) {
    return (
      <div className="container crisisquiz">
        <h1>Thank You!</h1>
        <p>Your responses have been submitted successfully.</p>
        <p>We appreciate your participation in our crisis simulation quiz.</p>
        <button className="secondary" onClick={handleReset}>Take Another Quiz</button>
      </div>
    );
  }

  return (
    <div className="container crisisquiz">
      <h1>Crisis Simulation quiz</h1>
      <div className="progress-bar">
        <div 
          className="progress" 
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>
      <p className="question-counter">Question {currentQuestionIndex + 1} of {questions.length}</p>
      
      <div className="question">
        <h2>{currentQuestion.text}</h2>
        <div className="options">
          {currentQuestion.options.map((option) => (
            <button
              key={option.value}
              className={`option ${answers[currentQuestion.id] === option.value ? 'selected' : ''}`}
              onClick={() => handleAnswer(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="navigation">
        {currentQuestionIndex > 0 && (
          <button className="back-btn secondary" onClick={handleBack}>
            Back
          </button>
        )}
        
        {isLastQuestion && hasAnsweredAllQuestions && (
          <div className="user-id-form">
            <label htmlFor="userId">Please enter your ID:</label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={handleUserIdChange}
              placeholder="Your ID"
              required
            />
            <button 
              onClick={handleSubmit} 
              disabled={loading || !userId.trim()}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Crisisquiz;