import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(
      collection(db, 'responses'),
      orderBy('submittedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const responsesData = [];
      querySnapshot.forEach((doc) => {
        responsesData.push({
          id: doc.id,
          ...doc.data(),
          submittedAt: doc.data().submittedAt?.toDate()
        });
      });
      setResponses(responsesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  // Function to calculate category scores
  const calculateCategoryScores = (answers) => {
    if (!answers) return {};
    
    const categories = {
      situation1: ['situation1'],
      situation2: ['situation2'],
      situation3: ['situation3'],
      situation4: ['situation4'],
      situation5: ['situation5'],
      situation6: ['situation6'],
      situation7: ['situation7']
    };
    
    const scores = {};
    for (const [category, fields] of Object.entries(categories)) {
      let total = 0;
      let count = 0;
      
      fields.forEach(field => {
        if (answers[field] !== undefined) {
          total += answers[field];
          count++;
        }
      });
      
      scores[category] = count > 0 ? (total / count).toFixed(1) : 'N/A';
    }
    
    return scores;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  };

  return (
    <div className="container admin-dashboard">
      <div className="header">
        <h1>Admin Dashboard</h1>
        <div className="user-info">
          <span>Logged in as: {currentUser?.email}</span>
          <button className="logout-btn secondary" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <h2>Questionnaire Responses</h2>
      
      {loading ? (
        <p>Loading...</p>
      ) : responses.length === 0 ? (
        <p>No responses yet.</p>
      ) : (
        <div className="response-list">
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Date Submitted</th>
                <th>Overall Score</th>
                <th>Mood Score</th>
                <th>Wellbeing Score</th>
                <th>Stress Score</th>
                <th>Social Score</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((response) => {
                const categoryScores = calculateCategoryScores(response.answers);
                const scorePercentage = response.totalScore && response.maxPossibleScore
                  ? ((response.totalScore / response.maxPossibleScore) * 100).toFixed(1)
                  : 'N/A';
                
                return (
                  <tr key={response.id}>
                    <td>{response.userId || 'Anonymous'}</td>
                    <td>{formatDate(response.submittedAt)}</td>
                    <td>
                      <div className="score-cell">
                        <span>{response.totalScore || 0}/{response.maxPossibleScore || 0}</span>
                        <div className="score-bar">
                          <div 
                            className="score-progress" 
                            style={{ 
                              width: `${scorePercentage}%`,
                              backgroundColor: getScoreColor(scorePercentage)
                            }}
                          ></div>
                        </div>
                        <span className="score-percentage">{scorePercentage}%</span>
                      </div>
                    </td>
                    <td>{categoryScores.mood}</td>
                    <td>{categoryScores.wellbeing}</td>
                    <td>{categoryScores.stress}</td>
                    <td>{categoryScores.social}</td>
                    <td>
                      <button 
                        className="view-details-btn"
                        onClick={() => alert(JSON.stringify(response.answers, null, 2))}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Function to determine color based on score
function getScoreColor(percentage) {
  if (percentage === 'N/A') return '#ccc';
  
  const score = parseFloat(percentage);
  if (score < 40) return '#f44336'; // red
  if (score < 60) return '#ff9800'; // orange
  if (score < 80) return '#2196f3'; // blue
  return '#4caf50'; // green
}

export default AdminDashboard;