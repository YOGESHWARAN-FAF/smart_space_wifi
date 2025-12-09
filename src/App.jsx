import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SmartSpaceProvider } from './context/SmartSpaceContext';
import Navbar from './components/Navbar';
import ToastContainer from './components/ToastContainer';
import HomePage from './pages/HomePage';
import ConnectPage from './pages/ConnectPage';
import VenuePage from './pages/VenuePage';

function App() {
  return (
    <SmartSpaceProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/connect" element={<ConnectPage />} />
              <Route path="/venue/:venueId" element={<VenuePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <ToastContainer />
        </div>
      </Router>
    </SmartSpaceProvider>
  );
}

export default App;
