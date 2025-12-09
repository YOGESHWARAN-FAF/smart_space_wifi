const STORAGE_KEYS = {
  VENUES: 'smart_space_venues',
  ESP_CONFIG: 'smart_space_esp_config',
};

export const getVenues = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.VENUES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading venues from storage', error);
    return [];
  }
};

export const saveVenues = (venues) => {
  try {
    localStorage.setItem(STORAGE_KEYS.VENUES, JSON.stringify(venues));
  } catch (error) {
    console.error('Error saving venues to storage', error);
  }
};

export const getEspConfig = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ESP_CONFIG);
    return data ? JSON.parse(data) : { ip: '', port: '', lastCheckedAt: null, isOnline: false };
  } catch (error) {
    console.error('Error reading ESP config from storage', error);
    return { ip: '', port: '', lastCheckedAt: null, isOnline: false };
  }
};

export const saveEspConfig = (config) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ESP_CONFIG, JSON.stringify(config));
  } catch (error) {
    console.error('Error saving ESP config to storage', error);
  }
};
