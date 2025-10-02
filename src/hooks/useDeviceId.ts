import { useEffect, useState } from 'react';

export const useDeviceId = () => {
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    // Check if device_id exists in localStorage
    let id = localStorage.getItem('device_id');
    
    if (!id) {
      // Generate new UUID
      id = crypto.randomUUID();
      localStorage.setItem('device_id', id);
    }
    
    setDeviceId(id);
  }, []);

  return deviceId;
};