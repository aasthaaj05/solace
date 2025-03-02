import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';
import Crisisquiz from './components/Crisisquiz';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Crisisquiz />} />
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
