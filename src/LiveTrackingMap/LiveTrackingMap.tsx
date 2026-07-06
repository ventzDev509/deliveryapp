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

export default function DeliveryDashboard() {
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

  // Kalkile distans senp ant de pwen (Pythagore kòm estimasyon rapid)
  const calculateDistance = (p1: Coords, p2: Coords) => {
    return Math.sqrt(Math.pow(p1.lat - p2.lat, 2) + Math.pow(p1.lng - p2.lng, 2));
  };

  // Lerp: liy dwat ant de pwen pou deplasman an smooth
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
          if (driver.status === 'idling' || driver.status === 'completed') return driver;

          let targetCoords: Coords;
          let newStatus = driver.status;
          let updatedQueue = [...driver.routeQueue];
          let updatedDeliveries = [...driver.currentDeliveries];

          // 1. Detèmine kote l ap prale (Restoran an premye, apre sa Kliyan yo nan fil la)
          if (driver.status === 'going_to_restaurant' && driver.restaurantCoords) {
            targetCoords = driver.restaurantCoords;
          } else if (driver.status === 'going_to_client' && updatedQueue.length > 0) {
            targetCoords = updatedQueue[0].coords;
          } else {
            return { ...driver, status: 'idling', etaMinutes: 0 };
          }

          const dist = calculateDistance(driver.currentCoords, targetCoords);
          
          // Kalkile ETA live: Distans ki rete / vitès * koefisyan tan fiktif
          const etaCalculated = Math.ceil((dist / driver.speed) * 1.5);

          // Si li rive trè pre destinasyon an (Tolerans)
          if (dist < 0.001) {
            if (driver.status === 'going_to_restaurant') {
              // Li rive nan restoran an, kounye a li pral livre premye kliyan nan keu a
              newStatus = 'going_to_client';
            } else if (driver.status === 'going_to_client') {
              // Li fin livre kliyan ki nan tèt fil la (Queue)
              const finLivre = updatedQueue.shift(); 
              
              // Mete ajou Panel Estatistik pou kòmand sa a ki fin livre
              if (finLivre) {
                setStats(prev => ({
                  ...prev,
                  enRoute: Math.max(0, prev.enRoute - 1),
                  completed: prev.completed + 1,
                  revenue: prev.revenue + BASE_DELIVERY_FEE + Math.floor(driver.speed * 1000) // Pri varyab
                }));
                updatedDeliveries = updatedDeliveries.filter(id => id !== finLivre.id);
              }

              // Si toujou gen yon dezyèm kliyan nan double livrezon an
              if (updatedQueue.length > 0) {
                newStatus = 'going_to_client';
              } else {
                // newStatus = 'completed' ;
              }
            }

            return {
              ...driver,
              currentCoords: targetCoords,
              status: newStatus,
              routeQueue: updatedQueue,
              currentDeliveries: updatedDeliveries,
              etaMinutes: 0
            };
          }

          // Si li poko rive, n ap kontinye fè l mache dwat vè target la
          const nextLat = lerp(driver.currentCoords.lat, targetCoords.lat, driver.speed);
          const nextLng = lerp(driver.currentCoords.lng, targetCoords.lng, driver.speed);

          return {
            ...driver,
            currentCoords: { lat: nextLat, lng: nextLng },
            status: newStatus,
            etaMinutes: etaCalculated
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

    // Jwenn chofè ki lib (idling oswa completed)
    const availableDriver = drivers.find((d) => d.status === 'idling' || d.status === 'completed');

    if (!availableDriver) {
      alert("Tout chofè yo okipe ap livre kounye a! Rete tann yonn libere.");
      return;
    }

    // Kreye nouvo kliyan 1
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

    // Si se yon double livrezon (Batching), kreye dezyèm kliyan an tou
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

      // Mete ajou estatistik pou nouvo batch la
      setStats(prev => ({ ...prev, batchedCount: prev.batchedCount + 1 }));
    }

    // Ajoute kliyan yo sou kat la
    setNodes((prev) => [...prev, ...newNodes]);

    // Bay chofè a kòmand lan ak lis rout li a
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

    // Mete ajou estatistik en route yo
    setStats((prev) => ({
      ...prev,
      enRoute: prev.enRoute + kòmandKonte,
    }));
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      <h1 style={{ color: '#1e293b', marginBottom: '5px' }}>H-Mizik Delivery Live Engine</h1>
      <p style={{ color: '#64748b', marginTop: '0', marginBottom: '20px' }}>Simulation Multi-Restoran, Double Livrezon ak ETA an tan reyèl.</p>

      {/* BLOCK 1: PANEL ESTATISTIK LIVE */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Kòmand En Route</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginTop: '5px' }}>{stats.enRoute}</div>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Kòmand Fin Livre</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginTop: '5px' }}>{stats.completed}</div>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Revni Total Live</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginTop: '5px' }}>{stats.revenue} HTG</div>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>Double Livrezon (Batch)</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginTop: '5px' }}>{stats.batchedCount}</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* INTERACTIVE CONTROLS */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: '0', color: '#334155' }}>Lanse yon Simulasyon Livrezon</h3>
          
          <form onSubmit={handleSimulateOrder} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', fontSize: '14px', marginBottom: '5px' }}>Chwazi Restoran:</label>
              <select value={selectedRestoId} onChange={(e) => setSelectedRestoId(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                {nodes.filter(n => n.type === 'restoran').map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            {/* TIP LIVREZON: SENP OSWA DOUBLE */}
            <div style={{ padding: '10px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <label style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={isDoubleOrder} onChange={(e) => setIsDoubleOrder(e.target.checked)} style={{ transform: 'scale(1.2)' }} />
                <span>Aktive "Double Livrezon" (Pran 2 kòmand nan menm restoran an)</span>
              </label>
            </div>

            {/* KLIYAN 1 PANEL */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px',  }}>Non Kliyan 1:</label>
                <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} style={{ width: '90%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px' }}>Latitid (18.505 - 18.545):</label>
                <input type="text" value={clientLat} onChange={(e) => setClientLat(e.target.value)} style={{ width: '90%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px' }}>Lonjitid (-72.315 - -72.265):</label>
                <input type="text" value={clientLng} onChange={(e) => setClientLng(e.target.value)} style={{ width: '90%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              </div>
            </div>

            {/* KLIYAN 2 PANEL (AP PARÈT SÈLMAN SI CHEKBOX LA KOCHE) */}
            {isDoubleOrder && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', padding: '15px', backgroundColor: '#f5f3ff', borderRadius: '6px', border: '1px solid #ddd6fe' }}>
                <div style={{ gridColumn: '1 / -1', fontWeight: 'bold', fontSize: '13px', color: '#6d28d9' }}>Enfòmasyon Dezyèm Kliyan:</div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px' }}>Non Kliyan 2:</label>
                  <input type="text" value={clientName2} onChange={(e) => setClientName2(e.target.value)} style={{ width: '90%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px' }}>Latitid 2:</label>
                  <input type="text" value={clientLat2} onChange={(e) => setClientLat2(e.target.value)} style={{ width: '90%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px' }}>Lonjitid 2:</label>
                  <input type="text" value={clientLng2} onChange={(e) => setClientLng2(e.target.value)} style={{ width: '90%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                </div>
              </div>
            )}

            <button type="submit" style={{ backgroundColor: '#2563eb', color: '#fff', padding: '10px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer', alignSelf: 'flex-start' }}>
              Lanse Livrezon an
            </button>
          </form>
        </div>

        {/* MAP VISUALIZATION */}
        <div style={{ position: 'relative', width: '100%', height: '450px', backgroundColor: '#e2e8f0', borderRadius: '12px', overflow: 'hidden', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.1)' }}>
          
          {/* Kadriyaj fiktif pou sanble ak yon kat */}
          <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.4 }} />

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
                <div style={{
                  width: isResto ? '20px' : '14px',
                  height: isResto ? '20px' : '14px',
                  borderRadius: isResto ? '4px' : '50%',
                  backgroundColor: isResto ? '#f97316' : '#3b82f6',
                  border: '2px solid #fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }} />
                <span style={{ fontSize: '10px', fontWeight: 'bold', backgroundColor: 'rgba(255,255,255,0.85)', padding: '2px 4px', borderRadius: '3px', marginTop: '3px', whiteSpace: 'nowrap', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
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
                {/* Point Chofè a */}
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: isOkipe ? '#10b981' : '#64748b',
                  border: '2px solid #fff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                }} />

                {/* Ti bwat enfòmasyon ki flote sou tèt chofè a */}
                <div style={{
                  fontSize: '9px',
                  backgroundColor: '#1e293b',
                  color: '#fff',
                  padding: '3px 6px',
                  borderRadius: '4px',
                  marginTop: '4px',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  <span style={{ fontWeight: 'bold' }}>{driver.name} ({Math.floor(driver.speed * 1000)} km/h)</span>
                  <span style={{ color: isOkipe ? '#34d399' : '#94a3b8' }}>
                    Status: {driver.status === 'going_to_restaurant' ? 'Al chache manje' : driver.status === 'going_to_client' ? 'Ap livre' : 'Disponib'}
                  </span>
                  {isOkipe && driver.etaMinutes > 0 && (
                    <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>
                      ⏱️ ETA: {driver.etaMinutes} min
                    </span>
                  )}
                  {driver.routeQueue.length > 1 && (
                    <span style={{ color: '#a78bfa', fontSize: '8px' }}>
                      📦 Double (Rete: {driver.routeQueue.length} moun)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* LIST ENFOMASYON CHOFÈ YO (DETAY) */}
        <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h4 style={{ marginTop: '0', color: '#334155', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>Monitè Flòt Livrezon</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {drivers.map(d => (
              <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', padding: '8px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
                <div>
                  <strong>{d.name}</strong> 
                  {d.status === 'going_to_restaurant' && ` ➔ Sou wout pou ${d.restaurantName}`}
                  {d.status === 'going_to_client' && ` ➔ Ap livre kliyan: ${d.routeQueue[0]?.clientName || ''}`}
                  {d.status === 'idling' && ` ➔ Disponib pou pran misyon`}
                  {d.status === 'completed' && ` ➔ Fin fè dènye livrezon li`}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: d.status !== 'idling' ? '#10b981' : '#64748b' }}>
                  {d.status !== 'idling' && d.status !== 'completed' ? `Okipe (ETA: ${d.etaMinutes}m)` : 'Lib'}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}