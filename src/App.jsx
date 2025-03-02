import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Questionnaire from './Questionnaire';
import AdminDashboard from './AdminDashboard';
import Login from './Login';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from './AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Questionnaire />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/admin" 
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
