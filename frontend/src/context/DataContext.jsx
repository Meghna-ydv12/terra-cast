import React, { createContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

export const DataContext = createContext();

export function DataProvider({ children }) {
  const [params, setParams] = useState({
    PM2_5_lag1: 156.0, PM10_lag1: 180.0, SO2_lag1: 10.0, NO2_lag1: 45.0, CO_lag1: 1.0, O3_lag1: 40.0,
    TEMP: 32.0, PRES: 1010.0, DEWP: 15.0, RAIN: 0.0, WSPM: 12.0,
    month: 5, hour: 10, year: 2015, day: 15, station: "Dongsi"
  });
  const [stationName, setStationName] = useState("Loading...");
  const [dataTimestamp, setDataTimestamp] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadRealData = async (stationFilter = null) => {
    try {
      setIsLoading(true);
      if (typeof stationFilter === 'string') {
        setStationName(`Loading ${stationFilter}...`);
      } else {
        setStationName(`Loading random station...`);
      }
      
      let url = "http://localhost:8000/dataset/sample";
      if (stationFilter && typeof stationFilter === 'string') {
        url += `?station=${stationFilter}`;
      }
      
      const res = await axios.get(url);
      setParams(res.data);
      setStationName(res.data.station);
      setDataTimestamp(`${res.data.year}-${String(res.data.month).padStart(2, '0')}-${String(res.data.day).padStart(2, '0')} ${String(res.data.hour).padStart(2, '0')}:00`);
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to load real data", err);
      setIsLoading(false);
    }
  };

  const isMounted = useRef(false);

  useEffect(() => {
    // Only load initial random data ONCE on initial app mount (protects against StrictMode double-mount)
    if (!isMounted.current) {
      loadRealData();
      isMounted.current = true;
    }
    
    // Listen for search selections from Header globally
    const handleLoadStation = (e) => loadRealData(e.detail);
    window.addEventListener('terracast:load_station', handleLoadStation);
    
    return () => window.removeEventListener('terracast:load_station', handleLoadStation);
  }, []);

  return (
    <DataContext.Provider value={{ params, setParams, stationName, dataTimestamp, isLoading, loadRealData }}>
      {children}
    </DataContext.Provider>
  );
}
