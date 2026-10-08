import { Fragment, useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import { useDriver } from '../Contexts/DriverContext';
import api from '../Contexts/api/axios';
import { socket } from '../hook/socket';
import type { Driver } from '../types/driver.types';
import RoadRoute from './RoadRoute';
import AnimatedDriverMarker from './AnimatedDriverMarker';

type Restaurant = { id: string; name: string; owner?: { profile?: { lat?: number | null; lng?: number | null; location?: string | null } | null } };
type DriverPosition = Pick<Driver, 'id' | 'name' | 'status' | 'currentLat' | 'currentLng' | 'vehicleType' | 'isVerified'>;
type ActiveDelivery = { id: string; status: string; latitude: number | null; longitude: number | null; deliveryAddress: string; customer: { email: string; profile?: { username?: string | null } | null }; driver?: { id: string; name: string; currentLat: number | null; currentLng: number | null } | null };

const marker = (emoji: string, background: string) => L.divIcon({
  html: `<div style="width:38px;height:38px;border-radius:50%;background:${background};border:3px solid white;box-shadow:0 3px 10px #0006;display:flex;align-items:center;justify-content:center;font-size:18px">${emoji}</div>`,
  className: 'delivery-map-marker', iconSize: [38, 38], iconAnchor: [19, 19],
});
const restaurantMarker = marker('🍽️', '#f59e0b');
const driverMarker = marker('🛵', '#2563eb');
const deliveryDestinationMarker = marker('🏠', '#16a34a');

function FitDeliveryBounds({ positions }: { positions: Array<[number, number]> }) {
  const map = useMap();
  const boundsKey = positions.map(([lat, lng]) => `${lat},${lng}`).join('|');
  useEffect(() => {
    if (positions.length) map.fitBounds(L.latLngBounds(positions).pad(0.2), { maxZoom: 14, animate: false });
  }, [boundsKey, map]);
  return null;
}

export default function LiveTrackingMap() {
  const { user } = useAuth();
  const { drivers, fetchDrivers, setDrivers } = useDriver();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [deliveries, setDeliveries] = useState<ActiveDelivery[]>([]);
  const [myDriver, setMyDriver] = useState<DriverPosition | null>(null);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    api.get<Restaurant[]>('/restaurants').then((response) => setRestaurants(response.data)).catch(() => setRestaurants([]));
  }, []);

  useEffect(() => {
    let active = true;
    const loadDeliveries = async () => {
      try {
        const response = await api.get<ActiveDelivery[]>('/orders');
        if (active) setDeliveries(response.data.filter((order) => order.status === 'DELIVERING' && order.latitude != null && order.longitude != null));
      } catch { if (active) setDeliveries([]); }
    };
    void loadDeliveries();
    const timer = window.setInterval(() => { void loadDeliveries(); }, 5000);
    return () => { active = false; window.clearInterval(timer); };
  }, [user?.id, user?.role]);

  useEffect(() => {
    if (user?.role !== 'ADMIN') return;
    const timer = window.setInterval(() => { void fetchDrivers(); }, 5000);
    return () => window.clearInterval(timer);
  }, [fetchDrivers, user?.role]);

  useEffect(() => {
    if (!navigator.geolocation) { setLocationError('Navigatè sa a pa bay sèvis pozisyon.'); return; }
    if (user?.role === 'DRIVER' && myDriver?.isVerified) socket.connect();
    const watchId = navigator.geolocation.watchPosition((position) => {
      const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
      if (user?.role === 'DRIVER') setMyDriver((current) => current ? { ...current, currentLat: coords[0], currentLng: coords[1] } : current);
      if (user?.role === 'DRIVER' && myDriver?.isVerified) socket.emit('updateLocation', { driverId: myDriver.id, lat: coords[0], lng: coords[1] });
    }, () => setLocationError('Pèmèt aksè ak pozisyon pou GPS moto a ka mete ajou pandan livrezon.'), { enableHighAccuracy: true, maximumAge: 1000, timeout: 20000 });
    return () => { navigator.geolocation.clearWatch(watchId); if (user?.role === 'DRIVER') socket.disconnect(); };
  }, [myDriver?.id, myDriver?.isVerified, user?.role]);

  useEffect(() => {
    if (user?.role !== 'DRIVER') return;
    api.get<DriverPosition & { isVerified: boolean }>('/drivers/me').then((response) => setMyDriver(response.data)).catch(() => setMyDriver(null));
  }, [user?.id, user?.role]);

  useEffect(() => {
    if (user?.role !== 'DRIVER' && user?.role !== 'ADMIN') return;
    const onDriverMoved = (data: { driverId: string; lat: number; lng: number }) => {
      if (!Number.isFinite(data.lat) || !Number.isFinite(data.lng)) return;
      setMyDriver((current) => current?.id === data.driverId
        ? { ...current, currentLat: data.lat, currentLng: data.lng }
        : current);
      if (user.role === 'ADMIN') {
        setDrivers((current) => current.map((driver) => driver.id === data.driverId
          ? { ...driver, currentLat: data.lat, currentLng: data.lng }
          : driver));
      }
      setDeliveries((current) => current.map((order) => order.driver?.id === data.driverId
        ? { ...order, driver: { ...order.driver, currentLat: data.lat, currentLng: data.lng } }
        : order));
    };
    socket.on('driverMoved', onDriverMoved);
    if (!socket.connected) socket.connect();
    return () => { socket.off('driverMoved', onDriverMoved); };
  }, [setDrivers, user?.role]);

  const shownDrivers: DriverPosition[] = user?.role === 'ADMIN' ? drivers : (myDriver ? [myDriver] : []);
  const deliveryBounds: Array<[number, number]> = deliveries.flatMap((order) => [
    ...(typeof order.driver?.currentLat === 'number' && typeof order.driver?.currentLng === 'number' ? [[order.driver.currentLat, order.driver.currentLng] as [number, number]] : []),
    [order.latitude!, order.longitude!],
  ]);

  return <main className="min-h-screen bg-zinc-950 p-4 text-white sm:p-6"><div className="mx-auto max-w-7xl">
    <header className="mb-4 flex items-center justify-between"><div><h1 className="text-2xl font-black">Kat livrezon an dirèk</h1><p className="mt-1 text-sm text-zinc-400">Kliyan yo parèt kòm destinasyon; moto yo ap deplase ak dènye pozisyon GPS yo (mizajou chak 5 segonn).</p></div><Link to="/dashboard" className="text-sm font-semibold text-amber-400">Dashboard</Link></header>
    {locationError && <p className="mb-3 rounded-xl bg-amber-500/10 p-3 text-sm text-amber-200">{locationError}</p>}
    {user?.role === 'DRIVER' && myDriver && !myDriver.isVerified && <p className="mb-3 rounded-xl bg-amber-500/10 p-3 text-sm text-amber-200">Administratè a dwe verifye kont chofè a anvan pozisyon an parèt.</p>}
    <div className="h-[72vh] min-h-[440px] overflow-hidden rounded-2xl border border-white/10">
      <MapContainer center={[19.45, -72.68]} zoom={13} className="h-full w-full">
        <FitDeliveryBounds positions={deliveryBounds}/><TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {restaurants.map((restaurant) => { const lat = restaurant.owner?.profile?.lat; const lng = restaurant.owner?.profile?.lng; return typeof lat === 'number' && typeof lng === 'number' ? <Marker key={restaurant.id} position={[lat, lng]} icon={restaurantMarker}><Popup><strong>{restaurant.name}</strong><br/>{restaurant.owner?.profile?.location}</Popup></Marker> : null; })}
        {shownDrivers.map((driver) => typeof driver.currentLat === 'number' && typeof driver.currentLng === 'number' ? <AnimatedDriverMarker key={driver.id} position={[driver.currentLat, driver.currentLng]} icon={driverMarker}><Popup><strong>{driver.name}</strong><br/>{driver.status} · {driver.vehicleType}</Popup></AnimatedDriverMarker> : null)}
        {deliveries.map((order) => <Fragment key={`delivery-${order.id}`}>
          <Marker position={[order.latitude!, order.longitude!]} icon={deliveryDestinationMarker}><Popup><strong>Kliyan: {order.customer.profile?.username || order.customer.email}</strong><br/>{order.deliveryAddress}<br/>Kòmand #{order.id.slice(0, 8)}</Popup></Marker>
          {order.driver && typeof order.driver.currentLat === 'number' && typeof order.driver.currentLng === 'number' && <RoadRoute from={[order.driver.currentLat, order.driver.currentLng]} to={[order.latitude!, order.longitude!]}/>}
        </Fragment>)}
      </MapContainer>
    </div>
  </div></main>;
}
