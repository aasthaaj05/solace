import React, { useState } from 'react';
import { db } from '../../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './Questionnaire.css';

const questions = [
  {
    id: 'mood',
    text: 'How would you rate your overall mood today?',
    options: [
      { value: 1, label: 'Very Poor' },
      { value: 2, label: 'Poor' },
      { value: 3, label: 'Neutral' },
      { value: 4, label: 'Good' },
      { value: 5, label: 'Very Good' }
    ]
  },
  {
    id: 'stress',
    text: 'How would you rate your stress level today?',
    options: [
      { value: 5, label: 'No Stress' },
      { value: 4, label: 'Mild Stress' },
      { value: 3, label: 'Moderate Stress' },
      { value: 2, label: 'High Stress' },
      { value: 1, label: 'Severe Stress' }
    ]
  },
  {
    id: 'sleep',
    text: 'How well did you sleep last night?',
    options: [
      { value: 1, label: 'Very Poorly' },
      { value: 2, label: 'Poorly' },
      { value: 3, label: 'Average' },
      { value: 4, label: 'Well' },
      { value: 5, label: 'Very Well' }
    ]
  },
  {
    id: 'energy',
    text: 'How would you rate your energy level today?',
    options: [
      { value: 1, label: 'Very Low' },
      { value: 2, label: 'Low' },
      { value: 3, label: 'Moderate' },
      { value: 4, label: 'High' },
      { value: 5, label: 'Very High' }
    ]
  },
  {
    id: 'focus',
    text: 'How would you rate your ability to focus today?',
    options: [
      { value: 1, label: 'Very Poor' },
      { value: 2, label: 'Poor' },
      { value: 3, label: 'Average' },
      { value: 4, label: 'Good' },
      { value: 5, label: 'Very Good' }
    ]
  },
  {
    id: 'anxiety',
    text: 'How would you rate your anxiety level today?',
    options: [
      { value: 5, label: 'No Anxiety' },
      { value: 4, label: 'Mild Anxiety' },
      { value: 3, label: 'Moderate Anxiety' },
      { value: 2, label: 'High Anxiety' },
      { value: 1, label: 'Severe Anxiety' }
    ]
  },
  {
    id: 'social',
    text: 'How satisfied are you with your social interactions today?',
    options: [
      { value: 1, label: 'Very Unsatisfied' },
      { value: 2, label: 'Unsatisfied' },
      { value: 3, label: 'Neutral' },
      { value: 4, label: 'Satisfied' },
      { value: 5, label: 'Very Satisfied' }
    ]
  }
];

function Questionnaire() {
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
      <div className="container questionnaire">
        <h1>Thank You!</h1>
        <p>Your responses have been submitted successfully.</p>
        <p>We appreciate your participation in our mental health well-being assessment.</p>
        <button className="secondary" onClick={handleReset}>Take Another Assessment</button>
      </div>
    );
  }

  return (
    <div className="container questionnaire">
      <h1>Mental Health Well-being Assessment</h1>
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

export default Questionnaire;