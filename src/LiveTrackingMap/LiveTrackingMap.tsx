import React, { useState, useEffect } from 'react';

// ==========================================
// TYPES & INTERFACES
// ==========================================
interface Coords {
  lat: number;
  lng: number;
}

interface NodeItem {
  id: string;
  name: string;
  type: 'restoran' | 'kliyan';
  coords: Coords;
}

interface DeliveryTarget {
  id: string;          // Kòmand ID
  clientName: string;
  coords: Coords;
}

interface Driver {
  id: string;
  name: string;
  speed: number;       // Degre avansman pa tik (0.01 jiska 0.05)
  currentCoords: Coords;
  status: 'idling' | 'going_to_restaurant' | 'going_to_client' | 'completed';
  restaurantCoords?: Coords;
  restaurantName?: string;
  routeQueue: DeliveryTarget[]; // Lis destinasyon ki rete yo (ka gen 1 oswa 2 kliyan)
  currentDeliveries: string[];  // ID kòmand chofè a ap pote kounye a
  etaMinutes: number;           // ETA kalkile live
}

interface StatTotals {
  enRoute: number;
  completed: number;
  revenue: number;
  batchedCount: number; // Kantite double livrezon ki fèt
}

// Bònn jewografik pou zòn simulation (Egz: Zòn Pétion-Ville / P-au-P)
const MAP_BOUNDS = {
  maxLat: 18.545,
  minLat: 18.505,
  minLng: -72.315,
  maxLng: -72.265,
};

// Pri fiks pou baz livrezon ($HTG oswa $USD) + Pri pa distans
const BASE_DELIVERY_FEE = 50;

export default function TrackingDeliveryMap() {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [nodes, setNodes] = useState<NodeItem[]>([
    { id: 'R-1', name: 'Muncheez Pétion-Ville', type: 'restoran', coords: { lat: 18.531, lng: -72.292 } },
    { id: 'R-2', name: 'Pizza Garden', type: 'restoran', coords: { lat: 18.518, lng: -72.280 } },
    { id: 'K-1', name: 'Woody Ventz', type: 'kliyan', coords: { lat: 18.540, lng: -72.305 } },
  ]);

  const [drivers, setDrivers] = useState<Driver[]>([
    { id: 'D-1', name: 'Jean Livrè', speed: 0.015, currentCoords: { lat: 18.520, lng: -72.300 }, status: 'idling', routeQueue: [], currentDeliveries: [], etaMinutes: 0 },
    { id: 'D-2', name: 'Marco Moto', speed: 0.025, currentCoords: { lat: 18.512, lng: -72.270 }, status: 'idling', routeQueue: [], currentDeliveries: [], etaMinutes: 0 },
  ]);

  const [stats, setStats] = useState<StatTotals>({
    enRoute: 0,
    completed: 0,
    revenue: 0,
    batchedCount: 0,
  });

  // Fòmilè Kontwòl
  const [selectedRestoId, setSelectedRestoId] = useState(nodes[0]?.id || '');
  const [clientLat, setClientLat] = useState('18.525');
  const [clientLng, setClientLng] = useState('-72.285');
  const [clientName, setClientName] = useState('Kliyan Live');
  const [isDoubleOrder, setIsDoubleOrder] = useState(false);

  // Dezyèm kliyan si opsyon "Double Livrezon" aktive
  const [clientLat2, setClientLat2] = useState('18.535');
  const [clientLng2, setClientLng2] = useState('-72.295');
  const [clientName2, setClientName2] = useState('Dezyèm Kliyan (Batch)');

  // ==========================================
  // UTILS & KALKIL JEWOGRAFIIK
  // ==========================================
  const convertCoordsToXY = (coords: Coords) => {
    const totalLat = MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat;
    const totalLng = MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng;

    const x = ((coords.lng - MAP_BOUNDS.minLng) / totalLng) * 100;
    const y = ((MAP_BOUNDS.maxLat - coords.lat) / totalLat) * 100;

    return { x: Math.max(2, Math.min(98, x)), y: Math.max(2, Math.min(98, y)) };
  };

  const calculateDistance = (p1: Coords, p2: Coords) => {
    return Math.sqrt(Math.pow(p1.lat - p2.lat, 2) + Math.pow(p1.lng - p2.lng, 2));
  };

  const lerp = (start: number, end: number, amt: number) => {
    return (1 - amt) * start + amt * end;
  };

  // ==========================================
  // KONDUI SIMULATION LÒJIK (TICK ENGINE)
  // ==========================================
  useEffect(() => {
    const interval = setInterval(() => {
      setDrivers((prevDrivers) =>
        prevDrivers.map((driver) => {
          // 1. Nou defini kalite a klèman isit la pou evite erè a
          if (driver.status === 'idling' || driver.status === 'completed') return driver;

          let targetCoords: Coords;
          // Nou presize tip pou newStatus la
          let newStatus: 'idling' | 'going_to_restaurant' | 'going_to_client' | 'completed' = driver.status;
          let updatedQueue = [...driver.routeQueue];
          let updatedDeliveries = [...driver.currentDeliveries];

          if (driver.status === 'going_to_restaurant' && driver.restaurantCoords) {
            targetCoords = driver.restaurantCoords;
          } else if (driver.status === 'going_to_client' && updatedQueue.length > 0) {
            targetCoords = updatedQueue[0].coords;
          } else {
            return { ...driver, status: 'idling', etaMinutes: 0 };
          }

          const dist = calculateDistance(driver.currentCoords, targetCoords);
          const etaCalculated = Math.ceil((dist / driver.speed) * 1.5);

          if (dist < 0.001) {
            if (driver.status === 'going_to_restaurant') {
              newStatus = 'going_to_client';
            } else if (driver.status === 'going_to_client') {
              const finLivre = updatedQueue.shift();

              if (finLivre) {
                setStats((prev) => ({
                  ...prev,
                  enRoute: Math.max(0, prev.enRoute - 1),
                  completed: prev.completed + 1,
                  revenue: prev.revenue + BASE_DELIVERY_FEE + Math.floor(driver.speed * 1000),
                }));
                updatedDeliveries = updatedDeliveries.filter((id) => id !== finLivre.id);
              }

              newStatus = updatedQueue.length > 0 ? 'going_to_client' : 'completed';
            }

            return {
              ...driver,
              currentCoords: targetCoords,
              status: newStatus, // Kounye a li aksepte "completed" paske nou defini tip la anlè
              routeQueue: updatedQueue,
              currentDeliveries: updatedDeliveries,
              etaMinutes: 0,
            };
          }

          const nextLat = lerp(driver.currentCoords.lat, targetCoords.lat, driver.speed);
          const nextLng = lerp(driver.currentCoords.lng, targetCoords.lng, driver.speed);

          return {
            ...driver,
            currentCoords: { lat: nextLat, lng: nextLng },
            status: newStatus,
            etaMinutes: etaCalculated,
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ==========================================
  // LANSE KOMANN (ACTION)
  // ==========================================
  const handleSimulateOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const resto = nodes.find((n) => n.id === selectedRestoId);
    if (!resto) return;

    const availableDriver = drivers.find((d) => d.status === 'idling' || d.status === 'completed');

    if (!availableDriver) {
      alert("Tout chofè yo okipe ap livre kounye a! Rete tann yonn libere.");
      return;
    }

    const orderId1 = `K-${Date.now()}-1`;
    const newKliyan1: NodeItem = {
      id: orderId1,
      name: clientName,
      type: 'kliyan',
      coords: { lat: parseFloat(clientLat), lng: parseFloat(clientLng) },
    };

    let queueList: DeliveryTarget[] = [
      { id: orderId1, clientName: clientName, coords: newKliyan1.coords }
    ];
    let newNodes = [newKliyan1];
    let kòmandKonte = 1;

    if (isDoubleOrder) {
      const orderId2 = `K-${Date.now()}-2`;
      const newKliyan2: NodeItem = {
        id: orderId2,
        name: clientName2,
        type: 'kliyan',
        coords: { lat: parseFloat(clientLat2), lng: parseFloat(clientLng2) },
      };
      queueList.push({ id: orderId2, clientName: clientName2, coords: newKliyan2.coords });
      newNodes.push(newKliyan2);
      kòmandKonte = 2;

      setStats(prev => ({ ...prev, batchedCount: prev.batchedCount + 1 }));
    }

    setNodes((prev) => [...prev, ...newNodes]);

    setDrivers((prevDrivers) =>
      prevDrivers.map((d) =>
        d.id === availableDriver.id
          ? {
            ...d,
            status: 'going_to_restaurant',
            restaurantCoords: resto.coords,
            restaurantName: resto.name,
            routeQueue: queueList,
            currentDeliveries: queueList.map(q => q.id),
          }
          : d
      )
    );

    setStats((prev) => ({
      ...prev,
      enRoute: prev.enRoute + kòmandKonte,
    }));
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '24px', backgroundColor: '#09090b', color: '#fafafa', minHeight: '100vh' }}>
      <h1 style={{ color: '#f4f4f5', marginBottom: '4px', fontSize: '26px', fontWeight: 700, letterSpacing: '-0.02em' }}>H-Mizik Delivery Live Engine</h1>
      <p style={{ color: '#a1a1aa', marginTop: '0', marginBottom: '32px', fontSize: '14px' }}>Simulation Multi-Restoran, Double Livrezon ak ETA an tan reyèl.</p>

      {/* BLOCK 1: PANEL ESTATISTIK LIVE (ZINC CARD STYLE) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: '#18181b', padding: '20px', borderRadius: '8px', border: '1px solid #27272a' }}>
          <div style={{ fontSize: '12px', color: '#71717a', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kòmand En Route</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#f4f4f5', marginTop: '6px', letterSpacing: '-0.03em' }}>{stats.enRoute}</div>
        </div>
        <div style={{ backgroundColor: '#18181b', padding: '20px', borderRadius: '8px', border: '1px solid #27272a' }}>
          <div style={{ fontSize: '12px', color: '#71717a', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kòmand Fin Livre</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#f4f4f5', marginTop: '6px', letterSpacing: '-0.03em' }}>{stats.completed}</div>
        </div>
        <div style={{ backgroundColor: '#18181b', padding: '20px', borderRadius: '8px', border: '1px solid #27272a' }}>
          <div style={{ fontSize: '12px', color: '#71717a', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Revni Total Live</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#e4e4e7', marginTop: '6px', letterSpacing: '-0.03em' }}>{stats.revenue} HTG</div>
        </div>
        <div style={{ backgroundColor: '#18181b', padding: '20px', borderRadius: '8px', border: '1px solid #27272a' }}>
          <div style={{ fontSize: '12px', color: '#71717a', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Double Livrezon (Batch)</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#e4e4e7', marginTop: '6px', letterSpacing: '-0.03em' }}>{stats.batchedCount}</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* INTERACTIVE CONTROLS (ZINC FORM) */}
        <div style={{ backgroundColor: '#18181b', padding: '24px', borderRadius: '8px', border: '1px solid #27272a' }}>
          <h3 style={{ marginTop: '0', marginBottom: '20px', color: '#f4f4f5', fontSize: '16px', fontWeight: '600' }}>Lanse yon Simulasyon Livrezon</h3>

          <form onSubmit={handleSimulateOrder} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '500', fontSize: '13px', marginBottom: '6px', color: '#d4d4d8' }}>Chwazi Restoran:</label>
              <select value={selectedRestoId} onChange={(e) => setSelectedRestoId(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', backgroundColor: '#09090b', color: '#fafafa', border: '1px solid #27272a', outline: 'none', fontSize: '14px' }}>
                {nodes.filter(n => n.type === 'restoran').map(r => (
                  <option key={r.id} value={r.id} style={{ backgroundColor: '#18181b' }}>{r.name}</option>
                ))}
              </select>
            </div>

            {/* TIP LIVREZON: SENP OSWA DOUBLE */}
            <div style={{ padding: '12px 16px', backgroundColor: '#27272a', borderRadius: '6px', border: '1px solid #3f3f46' }}>
              <label style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#f4f4f5', fontSize: '13px' }}>
                <input type="checkbox" checked={isDoubleOrder} onChange={(e) => setIsDoubleOrder(e.target.checked)} style={{ accentColor: '#fafafa', transform: 'scale(1.1)' }} />
                <span>Aktive "Double Livrezon" (Pran 2 kòmand nan menm restoran an)</span>
              </label>
            </div>

            {/* KLIYAN 1 PANEL */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '6px' }}>Non Kliyan 1:</label>
                <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', backgroundColor: '#09090b', color: '#fafafa', border: '1px solid #27272a', boxSizing: 'border-box', fontSize: '14px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '6px' }}>Latitid (18.505 - 18.545):</label>
                <input type="text" value={clientLat} onChange={(e) => setClientLat(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', backgroundColor: '#09090b', color: '#fafafa', border: '1px solid #27272a', boxSizing: 'border-box', fontSize: '14px' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '6px' }}>Lonjitid (-72.315 - -72.265):</label>
                <input type="text" value={clientLng} onChange={(e) => setClientLng(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', backgroundColor: '#09090b', color: '#fafafa', border: '1px solid #27272a', boxSizing: 'border-box', fontSize: '14px' }} />
              </div>
            </div>

            {/* KLIYAN 2 PANEL */}
            {isDoubleOrder && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', padding: '20px', backgroundColor: '#27272a', borderRadius: '6px', border: '1px solid #3f3f46' }}>
                <div style={{ gridColumn: '1 / -1', fontWeight: '600', fontSize: '12px', color: '#fafafa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Enfòmasyon Dezyèm Kliyan:</div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '6px' }}>Non Kliyan 2:</label>
                  <input type="text" value={clientName2} onChange={(e) => setClientName2(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', backgroundColor: '#09090b', color: '#fafafa', border: '1px solid #3f3f46', boxSizing: 'border-box', fontSize: '14px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '6px' }}>Latitid 2:</label>
                  <input type="text" value={clientLat2} onChange={(e) => setClientLat2(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', backgroundColor: '#09090b', color: '#fafafa', border: '1px solid #3f3f46', boxSizing: 'border-box', fontSize: '14px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#a1a1aa', marginBottom: '6px' }}>Lonjitid 2:</label>
                  <input type="text" value={clientLng2} onChange={(e) => setClientLng2(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', backgroundColor: '#09090b', color: '#fafafa', border: '1px solid #3f3f46', boxSizing: 'border-box', fontSize: '14px' }} />
                </div>
              </div>
            )}

            <button type="submit" style={{ backgroundColor: '#fafafa', color: '#09090b', padding: '10px 20px', borderRadius: '6px', border: 'none', fontWeight: '600', cursor: 'pointer', alignSelf: 'flex-start', transition: 'background-color 0.2s', fontSize: '14px' }}>
              Lanse Livrezon an
            </button>
          </form>
        </div>

        {/* MAP VISUALIZATION (HIGH CONTRAST ZINC GRID) */}
        <div style={{ position: 'relative', width: '100%', height: '450px', backgroundColor: '#09090b', borderRadius: '8px', overflow: 'hidden', border: '1px solid #27272a' }}>

          {/* Grid line Zinc fiktif */}
          <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundImage: 'linear-gradient(#18181b 1px, transparent 1px), linear-gradient(90deg, #18181b 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          {/* AFICHE RESTORAN AK KLIYAN YO */}
          {nodes.map((node) => {
            const { x, y } = convertCoordsToXY(node.coords);
            const isResto = node.type === 'restoran';

            return (
              <div
                key={node.id}
                style={{
                  position: 'absolute',
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 10,
                }}
              >
                {/* Container nwa pou ikon an */}
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: isResto ? '8px' : '50%',
                  backgroundColor: '#09090b', // Fond nwa pou bon kontras
                  border: `2px solid ${isResto ? '#22d3ee' : '#fb923c'}`, // Border koulè vif
                  boxShadow: isResto ? '0 0 10px #22d3ee' : '0 0 10px #fb923c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  // Koulè ikon an se koulè vif la, li pral parèt klè sou fon nwa a
                  color: isResto ? '#22d3ee' : '#fb923c',
                  fontSize: '16px',
                }}>
                  {isResto ? '🍴' : '👤'}
                </div>

                {/* Label */}
                <span style={{
                  fontSize: '10px',
                  fontWeight: '600',
                  backgroundColor: '#18181b',
                  color: '#ffffff',
                  padding: '3px 6px',
                  borderRadius: '4px',
                  marginTop: '4px',
                  whiteSpace: 'nowrap',
                  border: `1px solid #3f3f46`
                }}>
                  {node.name}
                </span>
              </div>
            );
          })}









          {/* AFICHE CHOFÈ YO LIVE SOU KAT LA AK ETA YO */}
          {drivers.map((driver) => {
            const { x, y } = convertCoordsToXY(driver.currentCoords);
            const isOkipe = driver.status !== 'idling' && driver.status !== 'completed';

            return (
              <div
                key={driver.id}
                style={{
                  position: 'absolute',
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                  transition: 'left 1s linear, top 1s linear',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 20,
                }}
              >
                {/* Icon Container: Ikon Motosiklèt pou okipe, Sèk pou disponib */}
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: '#09090b',
                  border: `2px solid ${isOkipe ? '#ffffff' : '#a3e635'}`,
                  boxShadow: isOkipe ? '0 0 15px #ffffff' : '0 0 15px #a3e635',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                }}>
                  {isOkipe ? '🏍️' : '🏍️'}
                </div>

                {/* Ti bwat enfòmasyon ki flote sou tèt chofè a */}
                <div style={{
                  fontSize: '10px',
                  backgroundColor: '#18181b',
                  color: '#fafafa',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  marginTop: '6px',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  border: `1px solid ${isOkipe ? '#ffffff' : '#a3e635'}`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                }}>
                  <span style={{ fontWeight: '700', color: isOkipe ? '#ffffff' : '#a3e635' }}>
                    {driver.name} ({Math.floor(driver.speed * 1000)} km/h)
                  </span>
                  <span style={{ color: '#e4e4e7', fontSize: '9px' }}>
                    Status: {driver.status === 'going_to_restaurant' ? 'Al chache manje' : driver.status === 'going_to_client' ? 'Ap livre' : 'Disponib'}
                  </span>
                  {isOkipe && driver.etaMinutes > 0 && (
                    <span style={{ color: '#ffffff', fontWeight: '700', fontSize: '9px' }}>
                      ⏱️ ETA: {driver.etaMinutes} min
                    </span>
                  )}
                  {driver.routeQueue.length > 1 && (
                    <span style={{ color: '#fb923c', fontSize: '9px', fontWeight: '600' }}>
                      📦 Double (Rete: {driver.routeQueue.length})
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* LIST ENFOMASYON CHOFÈ YO (DETAY) */}
        <div style={{ backgroundColor: '#18181b', padding: '20px', borderRadius: '8px', border: '1px solid #27272a' }}>
          <h4 style={{ marginTop: '0', color: '#f4f4f5', borderBottom: '1px solid #27272a', paddingBottom: '12px', marginBottom: '16px', fontSize: '14px', fontWeight: '600' }}>Monitè Flòt Livrezon</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {drivers.map(d => (
              <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', padding: '12px 16px', backgroundColor: '#09090b', borderRadius: '6px', border: '1px solid #27272a' }}>
                <div style={{ color: '#d4d4d8' }}>
                  <strong style={{ color: '#fafafa' }}>{d.name}</strong>
                  {d.status === 'going_to_restaurant' && ` ➔ Sou wout pou ${d.restaurantName}`}
                  {d.status === 'going_to_client' && ` ➔ Ap livre kliyan: ${d.routeQueue[0]?.clientName || ''}`}
                  {d.status === 'idling' && ` ➔ Disponib pou pran misyon`}
                  {d.status === 'completed' && ` ➔ Fin fè dènye livrezon li`}
                </div>
                <div style={{ fontSize: '11px', fontWeight: '600', color: d.status !== 'idling' && d.status !== 'completed' ? '#fafafa' : '#71717a' }}>
                  {d.status !== 'idling' && d.status !== 'completed' ? `OKIPE (${d.etaMinutes}m)` : 'DISPONIB'}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}