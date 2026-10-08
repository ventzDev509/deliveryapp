import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../Contexts/api/axios';
import { useAuth } from '../Contexts/AuthContext';
import fallbackFoodImage from '../assets/food-delivery.png';
import toast from 'react-hot-toast';
import RoadRoute from '../LiveTrackingMap/RoadRoute';
import AnimatedDriverMarker from '../LiveTrackingMap/AnimatedDriverMarker';
import { socket } from '../hook/socket';

type Order = {
  id: string; total: number; status: string; paymentMethod: string; paymentStatus: string; deliveryAddress: string; latitude?: number | null; longitude?: number | null; createdAt: string;
  restaurant: { id: string; name: string };
  driver?: { id: string; name: string; currentLat?: number | null; currentLng?: number | null; lastActive?: string | null } | null;
  items: Array<{ quantity: number; menuItem: { name: string; price: number; image?: string | null } }>;
};

const statusText: Record<string, string> = { PENDING: 'Ap tann restoran an', PREPARING: 'Ap prepare', DELIVERING: 'Sou wout', COMPLETED: 'Livre', CANCELLED: 'Anile' };
const trackingIcon = (emoji: string, color: string) => L.divIcon({ html: `<div style="width:36px;height:36px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 8px #0006;display:flex;align-items:center;justify-content:center;font-size:18px">${emoji}</div>`, className: 'order-tracking-marker', iconSize: [36, 36], iconAnchor: [18, 18] });
const bikeIcon = trackingIcon('🛵', '#2563eb');
const destinationIcon = trackingIcon('📍', '#16a34a');
const distanceKm = (fromLat: number, fromLng: number, toLat: number, toLng: number) => {
  const rad = (value: number) => value * Math.PI / 180;
  const a = Math.sin(rad(toLat - fromLat) / 2) ** 2 + Math.cos(rad(fromLat)) * Math.cos(rad(toLat)) * Math.sin(rad(toLng - fromLng) / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

function FitDeliveryBounds({ position, destination }: { position: [number, number] | null; destination: [number, number] }) {
  const map = useMap();
  const fitted = useRef(false);
  useEffect(() => {
    if (fitted.current || !position) return;
    fitted.current = true;
    map.fitBounds(L.latLngBounds([position, destination]).pad(0.2), { maxZoom: 14, animate: false });
  }, [destination[0], destination[1], map, position?.[0], position?.[1]]);
  return null;
}

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const loadOrders = useCallback(async (silent = false) => {
    if (!silent) setLoading(true); setError(false);
    try { const response = await api.get<Order[]>('/orders'); setOrders(response.data); }
    catch { setError(true); }
    finally { if (!silent) setLoading(false); }
  }, []);
  useEffect(() => { if (user) void loadOrders(); else setLoading(false); }, [loadOrders, user]);
  useEffect(() => {
    if (!orders.some((order) => ['PENDING', 'PREPARING', 'DELIVERING'].includes(order.status))) return;
    const timer = window.setInterval(() => { void loadOrders(true); }, 5000);
    return () => window.clearInterval(timer);
  }, [loadOrders, orders]);
  useEffect(() => {
    if (!user) return;
    const onDriverMoved = (data: { driverId: string; lat: number; lng: number }) => {
      if (!Number.isFinite(data.lat) || !Number.isFinite(data.lng)) return;
      setOrders((current) => current.map((order) => order.driver?.id === data.driverId
        ? { ...order, driver: { ...order.driver, currentLat: data.lat, currentLng: data.lng } }
        : order));
    };
    socket.on('driverMoved', onDriverMoved);
    if (!socket.connected) socket.connect();
    return () => { socket.off('driverMoved', onDriverMoved); socket.disconnect(); };
  }, [user?.id]);
  const cancelOrder = async (orderId: string) => {
    setCancellingId(orderId);
    try { await api.patch(`/orders/${orderId}/status`, { status: 'CANCELLED' }); await loadOrders(); toast.success('Kòmand lan anile.'); }
    catch (cancelError: any) { toast.error(cancelError.response?.data?.message || 'Ou pa ka anile kòmand lan ankò.'); }
    finally { setCancellingId(null); }
  };

  return <main className="min-h-screen bg-zinc-950 px-4 pb-20 pt-8 text-white sm:px-8"><div className="mx-auto max-w-4xl">
    <Link to="/" className="text-sm font-semibold text-amber-400">← Retounen lakay</Link><h1 className="mt-5 text-3xl font-black">Kòmand mwen yo</h1>
    {!user ? <section className="mt-6 rounded-2xl border border-white/10 bg-zinc-900 p-6"><p>Konekte pou w suiv kòmand ou yo.</p><Link to="/auth" className="mt-4 inline-block rounded-xl bg-amber-400 px-4 py-2 font-bold text-zinc-950">Konekte</Link></section>
      : loading ? <p className="mt-8 text-zinc-400">Ap chaje kòmand yo...</p>
      : error ? <p className="mt-8 text-zinc-300">Nou pa t ka chaje kòmand yo. <button onClick={() => void loadOrders()} className="text-amber-400 underline">Eseye ankò</button></p>
      : orders.length === 0 ? <section className="mt-6 rounded-2xl border border-white/10 bg-zinc-900 p-6"><p>Poko gen kòmand nan kont ou.</p><Link to="/" className="mt-4 inline-block text-amber-400 underline">Chwazi yon restoran</Link></section>
      : <div className="mt-6 space-y-4">{orders.map((order) => <article key={order.id} className="rounded-2xl border border-white/10 bg-zinc-900 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-bold">{order.restaurant.name}</h2><p className="mt-1 text-xs text-zinc-500">{new Date(order.createdAt).toLocaleString()}</p></div><span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300">{statusText[order.status] || order.status}</span></div>
          <ul className="mt-4 divide-y divide-white/5">{order.items.map((item, index) => <li key={`${order.id}-${index}`} className="flex items-center gap-3 py-3"><img src={item.menuItem.image || fallbackFoodImage} alt="" className="h-11 w-11 rounded-lg object-cover"/><span className="flex-1 text-sm">{item.quantity} × {item.menuItem.name}</span><span className="text-sm">${(Number(item.menuItem.price) * item.quantity).toFixed(2)}</span></li>)}</ul>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4 text-sm"><span className="text-zinc-400">{order.deliveryAddress}</span><div className="flex items-center gap-3"><span className="font-black text-amber-400">${Number(order.total).toFixed(2)}</span>{order.status === 'PENDING' && <button disabled={cancellingId === order.id} onClick={() => void cancelOrder(order.id)} className="text-xs font-bold text-rose-400 disabled:opacity-50">{cancellingId === order.id ? 'Ap anile...' : 'Anile kòmand'}</button>}</div></div>
          {order.status === 'DELIVERING' && <section className="mt-4 overflow-hidden rounded-xl border border-white/10"><div className="flex items-center justify-between gap-2 bg-zinc-950 px-4 py-3"><div><p className="text-sm font-bold">Swiv livrezon an an dirèk</p><p className="text-xs text-zinc-500">{order.driver?.name || 'Chofè a'} · GPS chak 5 segonn · liy ble a swiv lari yo{typeof order.driver?.currentLat === 'number' && typeof order.driver?.currentLng === 'number' && order.latitude != null && order.longitude != null ? ` · anviwon ${distanceKm(order.driver.currentLat, order.driver.currentLng, order.latitude, order.longitude).toFixed(1)} km sou liy dwat` : ''}</p></div><span className="flex items-center gap-2 text-xs font-bold text-emerald-400"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"/> Sou wout</span></div><div className="h-64 w-full">
            {order.latitude != null && order.longitude != null ? <MapContainer key={order.id} center={[order.latitude, order.longitude]} zoom={13} className="h-full w-full"><FitDeliveryBounds position={typeof order.driver?.currentLat === 'number' && typeof order.driver?.currentLng === 'number' ? [order.driver.currentLat, order.driver.currentLng] : null} destination={[order.latitude, order.longitude]}/><TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/><Marker position={[order.latitude, order.longitude]} icon={destinationIcon}><Popup>Adrès kote w ap resevwa kòmand lan</Popup></Marker>{typeof order.driver?.currentLat === 'number' && typeof order.driver?.currentLng === 'number' && <><RoadRoute from={[order.driver.currentLat, order.driver.currentLng]} to={[order.latitude, order.longitude]}/><AnimatedDriverMarker position={[order.driver.currentLat, order.driver.currentLng]} icon={bikeIcon}><Popup>Chofè: {order.driver.name}</Popup></AnimatedDriverMarker></>}</MapContainer> : <div className="flex h-full items-center justify-center bg-zinc-900 px-6 text-center text-sm text-zinc-400">Kòmand lan pa gen kowòdone GPS destinasyon an.</div>}
          </div></section>}
        </article>)}</div>}
  </div></main>;
}
