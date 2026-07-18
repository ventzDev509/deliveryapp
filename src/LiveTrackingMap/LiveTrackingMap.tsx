import  { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

// --- INTERFACES ---
interface Coords { lat: number; lng: number; }
type VehicleType = 'MOTORCYCLE' | 'BICYCLE' | 'CAR' | 'TRUCK';

interface Driver {
  id: string;
  name: string;
  currentCoords: Coords;
  status: string;
  vehicleType: VehicleType;
}

const MAP_BOUNDS = {
  minLat: 19.430, maxLat: 19.470,
  minLng: -72.700, maxLng: -72.650
};

const SOCKET_URL = 'http://localhost:3000';

export default function TrackingDeliveryMap() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const getPosition = (coords: Coords) => {
    const totalLat = MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat;
    const totalLng = MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng;
    const x = ((coords.lng - MAP_BOUNDS.minLng) / totalLng) * 100;
    const y = ((MAP_BOUNDS.maxLat - coords.lat) / totalLat) * 100;
    return { x, y };
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'Disponib';
      case 'IN_TRAFFIC': return 'Nan Trafik';
      case 'ON_DELIVERY': return 'Nan Livrezon';
      case 'BROKEN_DOWN': return 'An Pàn';
      default: return status;
    }
  };






  const getVehicleIcon = (type: VehicleType) => {
    switch (type) {
      case 'MOTORCYCLE': return '🏍️';
      case 'BICYCLE': return '🚲';
      case 'CAR': return '🚗';
      case 'TRUCK': return '🚚';
      default: return '📍';
    }
  };

  useEffect(() => {
    fetch(`${SOCKET_URL}/drivers`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((d: any) => ({
          ...d,
          currentCoords: (d.currentLat && d.currentLng)
            ? { lat: parseFloat(d.currentLat), lng: parseFloat(d.currentLng) }
            : { lat: 19.450, lng: -72.680 }
        }));
        setDrivers(formatted);
      });

    socketRef.current?.on('driverMoved', (data: { driverId: string, lat: number, lng: number }) => {
      console.log("Mesaj resevwa nan socket:", data); // SI SA PA PARÈT, PWÒBLÈM LAN SE NAN BACKEND LA
      setDrivers(prev => prev.map(d =>
        d.id === data.driverId
          ? { ...d, currentCoords: { lat: data.lat, lng: data.lng } }
          : d
      ));
    });

    return () => { socketRef.current?.disconnect(); };

  }, []);

  useEffect(() => {
    // 1. Inisyalize koneksyon an
    socketRef.current = io(SOCKET_URL);

    // 2. Koute evènman 'connect' la pou asire socket la pare
    socketRef.current.on('connect', () => {
      console.log("✅ Konekte ak sèvè! Socket ID:", socketRef.current?.id);

      // Koulye a, li an sekirite pou emèt
      socketRef.current?.emit('updateLocation', {
        driverId: '74067122-7c52-4e0d-9569-c26a10288c4d',
        lat: 19.460,
        lng: -72.67
      });
      console.log("🚀 Mesaj updateLocation voye!");
    });

    // 3. Koute mizajou (driverMoved)
    socketRef.current.on('driverMoved', (data: { driverId: string, lat: number, lng: number }) => {
      console.log("📥 Mesaj resevwa nan socket:", data);
      setDrivers(prev => prev.map(d =>
        d.id === data.driverId
          ? { ...d, currentCoords: { lat: data.lat, lng: data.lng } }
          : d
      ));
    });

    // Netwayaj lè paj la fèmen
    return () => {
      socketRef.current?.disconnect();
    };
  }, []); // [] sa a dwe rete la pou kòd la kouri yon sèl fwa
  // --------------------------------seller-----------------------------------

  return (
    <div style={{ padding: '20px', background: '#09090b', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '20px' }}>Live Fleet Tracker - Gonayiv</h2>

      <div style={{
        height: '500px',
        width: '100%',
        background: '#0e1117',
        borderRadius: '12px',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid #3f3f46',
        backgroundImage: 'radial-gradient(#27272a 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)'
      }}>
        {drivers.map((d) => {
          const { x, y } = getPosition(d.currentCoords);

          return (
            <div
              key={d.id}
              style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                transition: 'all 0.5s ease',
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <div style={{
                background: d.status === 'AVAILABLE' ? '#16a34a' : '#0891b2',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '5px',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                {d.name} -  <span style={{ color: d.status === 'AVAILABLE' ? '#4ade80' : '#22d3ee' }}>
                  {translateStatus(d.status)}
                </span>
              </div>
              <div style={{
                fontSize: '13px',
                background: 'white',
                borderRadius: '50%',
                padding: '2px',
                border: '2px solid #22d3ee'
              }}>
                {getVehicleIcon(d.vehicleType)}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}