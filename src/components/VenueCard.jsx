import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ChevronRight } from 'lucide-react';
import { useSmartSpace } from '../context/SmartSpaceContext';

const VenueCard = ({ venue }) => {
  const navigate = useNavigate();
  const { deleteVenue } = useSmartSpace();

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${venue.name}"?`)) {
      deleteVenue(venue.id);
    }
  };

  return (
    <div className="card venue-card" onClick={() => navigate(`/venue/${venue.id}`)}>
      <div className="venue-info">
        <h3>{venue.name}</h3>
        <p>{venue.devices.length} Devices</p>
      </div>
      <div className="venue-actions">
        <button className="btn-icon danger" onClick={handleDelete}>
          <Trash2 size={18} />
        </button>
        <button className="btn-icon">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default VenueCard;
