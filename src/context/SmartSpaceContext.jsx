import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { getVenues, saveVenues, getEspConfig, saveEspConfig } from '../utils/storage';

const SmartSpaceContext = createContext();

const initialState = {
  venues: [],
  espConfig: { ip: '', port: '', lastCheckedAt: null, isOnline: false },
  toasts: [], // { id, message, type: 'success' | 'error' | 'info' }
};

const ACTIONS = {
  INIT_STATE: 'INIT_STATE',
  ADD_VENUE: 'ADD_VENUE',
  DELETE_VENUE: 'DELETE_VENUE',
  ADD_DEVICE: 'ADD_DEVICE',
  DELETE_DEVICE: 'DELETE_DEVICE',
  UPDATE_DEVICE_STATE: 'UPDATE_DEVICE_STATE',
  SET_ESP_CONFIG: 'SET_ESP_CONFIG',
  ADD_TOAST: 'ADD_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
};

function reducer(state, action) {
  let newState;
  switch (action.type) {
    case ACTIONS.INIT_STATE:
      return {
        ...state,
        venues: action.payload.venues,
        espConfig: action.payload.espConfig,
      };

    case ACTIONS.ADD_VENUE:
      newState = {
        ...state,
        venues: [...state.venues, action.payload],
      };
      saveVenues(newState.venues);
      return newState;

    case ACTIONS.DELETE_VENUE:
      newState = {
        ...state,
        venues: state.venues.filter((v) => v.id !== action.payload),
      };
      saveVenues(newState.venues);
      return newState;

    case ACTIONS.ADD_DEVICE: {
      const { venueId, device } = action.payload;
      newState = {
        ...state,
        venues: state.venues.map((v) =>
          v.id === venueId ? { ...v, devices: [...v.devices, device] } : v
        ),
      };
      saveVenues(newState.venues);
      return newState;
    }

    case ACTIONS.DELETE_DEVICE: {
      const { venueId, deviceId } = action.payload;
      newState = {
        ...state,
        venues: state.venues.map((v) =>
          v.id === venueId
            ? { ...v, devices: v.devices.filter((d) => d.id !== deviceId) }
            : v
        ),
      };
      saveVenues(newState.venues);
      return newState;
    }

    case ACTIONS.UPDATE_DEVICE_STATE: {
      const { venueId, deviceId, updates } = action.payload;
      newState = {
        ...state,
        venues: state.venues.map((v) =>
          v.id === venueId
            ? {
                ...v,
                devices: v.devices.map((d) =>
                  d.id === deviceId ? { ...d, ...updates } : d
                ),
              }
            : v
        ),
      };
      saveVenues(newState.venues);
      return newState;
    }

    case ACTIONS.SET_ESP_CONFIG:
      newState = {
        ...state,
        espConfig: action.payload,
      };
      saveEspConfig(newState.espConfig);
      return newState;

    case ACTIONS.ADD_TOAST:
      return {
        ...state,
        toasts: [...state.toasts, { id: Date.now(), ...action.payload }],
      };

    case ACTIONS.REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.payload),
      };

    default:
      return state;
  }
}

export const SmartSpaceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load initial state from storage
  useEffect(() => {
    const venues = getVenues();
    const espConfig = getEspConfig();
    dispatch({ type: ACTIONS.INIT_STATE, payload: { venues, espConfig } });
  }, []);

  const addVenue = (name) => {
    const newVenue = {
      id: crypto.randomUUID(),
      name,
      devices: [],
    };
    dispatch({ type: ACTIONS.ADD_VENUE, payload: newVenue });
    addToast(`Venue "${name}" created`, 'success');
  };

  const deleteVenue = (id) => {
    dispatch({ type: ACTIONS.DELETE_VENUE, payload: id });
    addToast('Venue deleted', 'info');
  };

  const addDevice = (venueId, name, type) => {
    const newDevice = {
      id: crypto.randomUUID(),
      name,
      type,
      state: type === 'NORMAL' ? 'off' : undefined,
      value: type === 'REGULATABLE' ? 0 : undefined,
    };
    dispatch({ type: ACTIONS.ADD_DEVICE, payload: { venueId, device: newDevice } });
    addToast(`Device "${name}" added`, 'success');
  };

  const deleteDevice = (venueId, deviceId) => {
    dispatch({ type: ACTIONS.DELETE_DEVICE, payload: { venueId, deviceId } });
    addToast('Device deleted', 'info');
  };

  const updateDeviceLocal = (venueId, deviceId, updates) => {
    dispatch({ type: ACTIONS.UPDATE_DEVICE_STATE, payload: { venueId, deviceId, updates } });
  };

  const setEspConfig = (config) => {
    dispatch({ type: ACTIONS.SET_ESP_CONFIG, payload: config });
  };

  const addToast = (message, type = 'info') => {
    dispatch({ type: ACTIONS.ADD_TOAST, payload: { message, type } });
  };

  const removeToast = (id) => {
    dispatch({ type: ACTIONS.REMOVE_TOAST, payload: id });
  };

  return (
    <SmartSpaceContext.Provider
      value={{
        ...state,
        addVenue,
        deleteVenue,
        addDevice,
        deleteDevice,
        updateDeviceLocal,
        setEspConfig,
        addToast,
        removeToast,
      }}
    >
      {children}
    </SmartSpaceContext.Provider>
  );
};

export const useSmartSpace = () => {
  const context = useContext(SmartSpaceContext);
  if (!context) {
    throw new Error('useSmartSpace must be used within a SmartSpaceProvider');
  }
  return context;
};
