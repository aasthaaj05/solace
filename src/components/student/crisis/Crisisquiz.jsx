import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import './Crisisquiz.css';
import StudNavbar from "../StudNavbar";


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
        text: 'If you had to rename your college degree, what would it be?',
        options: [
            { value: 1, label: 'Bachelor in Sleepless Nights' },
            { value: 2, label: 'Master in Last-Minute Submissions' },
            { value: 3, label: 'PhD in Procrastination' },
            { value: 4, label: 'Diploma in Surviving Without Notes' },
            { value: 5, label: 'Certified Expert in Group Project Struggles' }
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
        text: 'What’s the best excuse to get out of a boring lecture?',
        options: [
            { value: 1, label: 'I have an urgent dentist appointment!' },
            { value: 2, label: 'My laptop crashed and I need to fix it ASAP!' },
            { value: 3, label: 'My pet fish is sick, I have to go home.' },
            { value: 4, label: 'I think I just saw a Wi-Fi router on sale, BRB!' },
            { value: 5, label: 'The professor from my other class just scheduled an emergency meeting' }
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
        text: 'Emoji Battle – "If you had to describe today’s lecture using only emojis, what would they be?',
        options: [
            { value: 1, label: '📖😴 (Too much theory, not enough coffee)' },
            { value: 2, label: '🤯📚 (Brain overload, send help!)' },
            { value: 3, label: '🏃💨 (Mentally checked out in the first 5 minutes)' },
            { value: 4, label: '😂🤦‍♂️ (Prof’s jokes were the only thing keeping me awake)' },
            { value: 5, label: '⏳🥱 (Time moved slower than a buffering video)' }
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
    const [rewardPoints, setRewardPoints] = useState(0);

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            fetchUserPoints(user.uid);
        }
    }, []);

    const fetchUserPoints = async (userId) => {
        const coinRef = doc(db, 'coins', userId);
        const coinDoc = await getDoc(coinRef);
        if (coinDoc.exists()) {
            setRewardPoints(coinDoc.data().rewardPoints || 0);
        }
    };

    const handleAnswer = (value) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questions[currentQuestionIndex].id]: value,
        }));

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        }
    };

    const handleSubmit = async () => {
        const user = auth.currentUser;
        if (!user) {
            alert('You must be logged in to submit responses.');
            return;
        }

        setLoading(true);
        let totalScore = Object.values(answers).reduce((sum, value) => sum + value, 0);

        try {
            await addDoc(collection(db, 'responses'), {
                userId: user.uid,
                answers,
                totalScore,
                maxPossibleScore: questions.length * 5,
                submittedAt: serverTimestamp()
            });

            // Update coins (add 10 coins)
            const coinRef = doc(db, 'coins', user.uid);
            const coinDoc = await getDoc(coinRef);

            if (coinDoc.exists()) {
                const currentCoins = coinDoc.data().coins || 0;
                await updateDoc(coinRef, {
                    coins: currentCoins + 10,
                    lastUpdated: serverTimestamp()
                });
                setRewardPoints(currentCoins + 10); // Updating UI to reflect new coin balance
            } else {
                await setDoc(coinRef, {
                    coins: 10,
                    createdAt: serverTimestamp(),
                    lastUpdated: serverTimestamp()
                });
                setRewardPoints(10);
            }

            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting questionnaire:', error);
            alert('There was an error submitting your response. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setCurrentQuestionIndex(0);
        setAnswers({});
        setSubmitted(false);
    };

    if (submitted) {
        return (
            <>


            {/* Navbar */}
            <StudNavbar />
            <div className="container questionnaire">
                <h1>Thank You!</h1>
                <p>Your responses have been submitted successfully.</p>
                <div className="reward-message">
                    <p>You earned <span className="points-highlight">10 reward points</span>!</p>
                    <p>Your current balance: <span className="points-highlight">{rewardPoints} points</span></p>
                </div>
                <button className="secondary" onClick={handleReset}>Take Another Assessment</button>
            </div>
            </>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const hasAnsweredAllQuestions = Object.keys(answers).length === questions.length;

    return (
        <>


         {/* Navbar */}
         <StudNavbar />

        <div className="container">
         
            <div className="questionnaire">
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
                        <button className="back-btn secondary" onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}>
                            Back
                        </button>
                    )}

                    {isLastQuestion && hasAnsweredAllQuestions && (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    )}
                </div>
            </div>
        </div>
        </>
    );
}

export default Crisisquiz;