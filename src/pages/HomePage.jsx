import React, { useState } from 'react';
import { useSmartSpace } from '../context/SmartSpaceContext';
import VenueCard from '../components/VenueCard';
import Modal from '../components/Modal';
import { Plus } from 'lucide-react';

const HomePage = () => {
  const { venues, addVenue } = useSmartSpace();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVenueName, setNewVenueName] = useState('');

  const handleAddVenue = (e) => {
    e.preventDefault();
    if (newVenueName.trim()) {
      addVenue(newVenueName.trim());
      setNewVenueName('');
      setIsModalOpen(false);
    }
  };

  return (
    <div className="page home-page">
      <div className="container">
        <header className="page-header">
          <h1>My Venues</h1>
          <button className="btn btn-primary btn-icon-text" onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            Add Venue
          </button>
        </header>

        <div className="venues-grid">
          {venues.length === 0 ? (
            <div className="empty-state">
              <p>No venues yet. Create one to get started!</p>
            </div>
          ) : (
            venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Venue"
      >
        <form onSubmit={handleAddVenue}>
          <div className="form-group">
            <label>Venue Name</label>
            <input
              type="text"
              value={newVenueName}
              onChange={(e) => setNewVenueName(e.target.value)}
              placeholder="e.g. Living Room"
              autoFocus
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-text" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={!newVenueName.trim()}>Create</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default HomePage;
