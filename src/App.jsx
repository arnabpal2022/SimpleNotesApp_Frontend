import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import NotesList from './components/NotesList';
import SharedNote from './components/SharedNote';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div>
        {isAuthenticated && (
          <div style={{ padding: '10px', backgroundColor: '#f0f0f0', textAlign: 'right' }}>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
        
        <Routes>
          <Route path="/shared/:shareId" element={<SharedNote />} />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <NotesList />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
