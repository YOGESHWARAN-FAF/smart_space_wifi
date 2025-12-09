import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSmartSpace } from '../context/SmartSpaceContext';
import { Home, Settings, Wifi, WifiOff } from 'lucide-react';

const Navbar = () => {
  const { espConfig } = useSmartSpace();
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          Smart Space
        </Link>
        
        <div className="navbar-actions">
          <div className={`status-badge ${espConfig.isOnline ? 'online' : 'offline'}`}>
            {espConfig.isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
            <span>{espConfig.isOnline ? 'Connected' : 'Offline'}</span>
          </div>

          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            <Home size={20} />
          </Link>
          <Link to="/connect" className={`nav-link ${location.pathname === '/connect' ? 'active' : ''}`}>
            <Settings size={20} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
