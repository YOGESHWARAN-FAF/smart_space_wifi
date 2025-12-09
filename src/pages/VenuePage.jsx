import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSmartSpace } from '../context/SmartSpaceContext';
import DeviceCard from '../components/DeviceCard';
import Modal from '../components/Modal';
import { ArrowLeft, Plus } from 'lucide-react';

const VenuePage = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const { venues, addDevice } = useSmartSpace();
  
  const venue = venues.find(v => v.id === venueId);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('NORMAL');

  if (!venue) {
    return (
      <div className="page">
        <div className="container">
          <p>Venue not found.</p>
          <button className="btn" onClick={() => navigate('/')}>Go Home</button>
        </div>
      </div>
    );
  }

  const handleAddDevice = (e) => {
    e.preventDefault();
    if (deviceName.trim()) {
      addDevice(venueId, deviceName.trim(), deviceType);
      setDeviceName('');
      setDeviceType('NORMAL');
      setIsModalOpen(false);
    }
  };

  return (
    <div className="page venue-page">
      <div className="container">
        <header className="page-header with-back">
          <button className="btn-icon back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={24} />
          </button>
          <h1>{venue.name}</h1>
          <button className="btn btn-primary btn-icon-text" onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            Add Device
          </button>
        </header>

        <div className="devices-grid">
          {venue.devices.length === 0 ? (
            <div className="empty-state">
              <p>No devices in this venue.</p>
            </div>
          ) : (
            venue.devices.map((device) => (
              <DeviceCard key={device.id} device={device} venueId={venueId} />
            ))
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Device"
      >
        <form onSubmit={handleAddDevice}>
          <div className="form-group">
            <label>Device Name</label>
            <input
              type="text"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              placeholder="e.g. Ceiling Light"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Device Type</label>
            <select value={deviceType} onChange={(e) => setDeviceType(e.target.value)}>
              <option value="NORMAL">Normal (On/Off)</option>
              <option value="REGULATABLE">Regulatable (0-100)</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-text" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={!deviceName.trim()}>Add Device</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default VenuePage;
