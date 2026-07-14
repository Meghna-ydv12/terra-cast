import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function LiveMap({ aqi, pm25, stationName }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  const getAqiColor = (val) => {
    if (val > 200) return '#EF4444';
    if (val > 100) return '#F59E0B';
    return '#10B981';
  };

  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapRef.current) {
      // Initialize map (Centered on Beijing)
      const map = L.map(containerRef.current, {
        center: [39.9042, 116.4074], // Beijing
        zoom: 10,
        scrollWheelZoom: false
      });
      
      // Dark theme tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CartoDB</a>'
      }).addTo(map);

      mapRef.current = map;
    }

    const map = mapRef.current;

    // Clear old layers before adding new ones (to handle prop updates)
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
        map.removeLayer(layer);
      }
    });

    // Generate scatter of stations across Beijing (Matching PRSA Dataset)
    const stations = [
      { name: "Aotizhongxin", lat: 39.982, lng: 116.397, multiplier: 1.15 },
      { name: "Guanyuan", lat: 39.929, lng: 116.339, multiplier: 1.1 },
      { name: "Dongsi", lat: 39.929, lng: 116.417, multiplier: 1.2 },
      { name: "Tiantan", lat: 39.886, lng: 116.407, multiplier: 1.25 },
      { name: "Nongzhanguan", lat: 39.937, lng: 116.461, multiplier: 0.8 },
      { name: "Wanliu", lat: 39.987, lng: 116.287, multiplier: 0.95 },
      { name: "Gucheng", lat: 39.914, lng: 116.184, multiplier: 1.05 },
      { name: "Shunyi", lat: 40.126, lng: 116.645, multiplier: 1.3 },
      { name: "Changping", lat: 40.216, lng: 116.231, multiplier: 1.4 },
      { name: "Huairou", lat: 40.328, lng: 116.628, multiplier: 0.85 },
      { name: "Dingling", lat: 40.292, lng: 116.220, multiplier: 1.18 },
      { name: "Wanshouxigong", lat: 39.878, lng: 116.352, multiplier: 1.08 }
    ];

    stations.forEach(station => {
      const isSelected = stationName && station.name.toLowerCase() === stationName.toLowerCase();
      const stationAqi = isSelected ? Math.round(aqi) : Math.round(aqi * station.multiplier);
      const color = getAqiColor(stationAqi);
      
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="
              background-color: ${color};
              color: ${color === '#FBBF24' ? '#000' : '#FFF'};
              width: ${isSelected ? '56px' : '44px'};
              height: ${isSelected ? '56px' : '44px'};
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 800;
              font-size: ${isSelected ? '18px' : '14px'};
              font-family: sans-serif;
              box-shadow: 0 4px 10px rgba(0,0,0,0.5), 0 0 ${isSelected ? '25px' : '15px'} ${color}80;
              border: ${isSelected ? '3px solid #FFF' : '2px solid rgba(255,255,255,0.2)'};
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              cursor: pointer;
            ">${stationAqi}</div>
            <div style="
              margin-top: 6px;
              background-color: rgba(0,0,0,0.7);
              padding: 2px 8px;
              border-radius: 10px;
              font-size: 10px;
              font-weight: bold;
              color: white;
              white-space: nowrap;
              border: 1px solid rgba(255,255,255,0.2);
            ">${station.name}</div>
          </div>
        `,
        iconSize: isSelected ? [80, 80] : [70, 70],
        iconAnchor: isSelected ? [40, 28] : [35, 22]
      });

      const marker = L.marker([station.lat, station.lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family:sans-serif; text-align:center;">
          <div style="font-size:12px; font-weight:bold; color:#64748b; text-transform:uppercase; margin-bottom:4px;">${station.name}</div>
          <div style="font-size:20px; font-weight:bold; color:${color};">AQI: ${stationAqi}</div>
        </div>
      `);
      
      if (isSelected) {
        map.setView([station.lat, station.lng], 11, { animate: true, duration: 1 });
      }
    });

  }, [aqi, pm25, stationName]); // Re-run when AQI or selected station updates

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative z-0">
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
