import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bike, Loader2, MapPin } from 'lucide-react';
import api from '../../../Contexts/api/axios';
import toast from 'react-hot-toast';
import { socket } from '../../../hook/socket';

type Delivery = {
  id: string; total: number; status: string; paymentMethod: string; deliveryAddress: string; createdAt: string;
  customer: { email: string; profile?: { username?: string | null } | null };
  restaurant: { name: string };
  items: Array<{ quantity: number; menuItem: { name: string } }>;
};
const deliveryStatusText: Record<string, string> = { PENDING: 'Ap tann restoran an', PREPARING: 'Pare pou pran', DELIVERING: 'Sou wout' };

export default function DriverDeliveriesPage() {
  const [orders, setOrders] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [gpsMessage, setGpsMessage] = useState('Pèmèt GPS pou kliyan an ka swiv moto a sou kat la.');
  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try { const response = await api.get<Delivery[]>('/orders'); setOrders(response.data.filter((order) => ['PENDING', 'PREPARING', 'DELIVERING'].includes(order.status))); }
    catch { if (!silent) toast.error('Nou pa t ka chaje livrezon yo.'); }
    finally { if (!silent) setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    const timer = window.setInterval(() => { void load(true); }, 5000);
    return () => window.clearInterval(timer);
  }, [load]);
  const activeDeliveryIds = orders.filter((order) => order.status === 'DELIVERING').map((order) => order.id).sort().join(',');
  useEffect(() => {
    if (!activeDeliveryIds) return;
    if (!navigator.geolocation) { setGpsMessage('Navigatè sa a pa sipòte GPS.'); return; }
    let watchId: number | undefined;
    let active = true;
    api.get<{ id: string; isVerified: boolean }>('/drivers/me').then(({ data }) => {
      if (!active || !data.isVerified) return;
      watchId = navigator.geolocation.watchPosition(({ coords }) => {
        if (!socket.connected) socket.connect();
        socket.emit('updateLocation', { driverId: data.id, lat: coords.latitude, lng: coords.longitude });
        setGpsMessage('GPS limen: pozisyon moto a ap pataje ak kliyan pou livrezon sa a.');
      }, () => setGpsMessage('Pèmèt aksè GPS nan navigatè a pou voye pozisyon moto a.'), { enableHighAccuracy: true, maximumAge: 1000, timeout: 15000 });
    }).catch(() => setGpsMessage('Nou pa t ka jwenn kont chofè a pou aktive GPS.'));
    return () => { active = false; if (watchId !== undefined) navigator.geolocation.clearWatch(watchId); socket.disconnect(); };
  }, [activeDeliveryIds]);
  const startDelivery = async (id: string) => {
    setBusyId(id);
    try { await api.patch(`/orders/${id}/status`, { status: 'DELIVERING' }); toast.success('Livrezon an kòmanse.'); await load(true); }
    catch (error: any) { toast.error(error.response?.data?.message || 'Nou pa t ka kòmanse livrezon an.'); }
    finally { setBusyId(null); }
  };
  const markDelivered = async (id: string) => {
    setBusyId(id);
    try { await api.patch(`/orders/${id}/status`, { status: 'COMPLETED' }); toast.success('Livrezon an make kòm fini.'); await load(); }
    catch (error: any) { toast.error(error.response?.data?.message || 'Nou pa t ka fèmen livrezon an.'); }
    finally { setBusyId(null); }
  };
  return <section className="space-y-5"><header className="flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-2xl font-black">Livrezon mwen yo</h1><p className="mt-1 text-sm text-zinc-500">Kòmand yo bay chofè ou a.</p></div><Link to="/tracking" className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white"><MapPin size={16}/> Louvri kat la</Link></header>
    {!!orders.length && <p className="rounded-xl bg-blue-500/10 px-4 py-3 text-xs text-blue-600 dark:text-blue-300">{gpsMessage}</p>}
    {loading ? <div className="flex justify-center py-12"><Loader2 className="animate-spin text-amber-500"/></div> : !orders.length ? <p className="rounded-2xl border border-zinc-200 p-8 text-center text-sm text-zinc-500 dark:border-zinc-800">Ou pa gen kòmand asiyen kounye a. Lis la ap tcheke ankò chak 5 segonn.</p> : <div className="grid gap-4 lg:grid-cols-2">{orders.map((order) => <article key={order.id} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"><div className="flex items-start justify-between gap-3"><div><p className="font-black">{order.restaurant.name}</p><p className="mt-1 text-xs text-zinc-500">{new Date(order.createdAt).toLocaleString()}</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${order.status === 'DELIVERING' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-600'}`}>{deliveryStatusText[order.status] || order.status}</span></div><div className="mt-4 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900"><p className="flex items-center gap-2 text-sm font-semibold"><MapPin size={15} className="text-amber-500"/>{order.deliveryAddress}</p><p className="mt-2 text-xs text-zinc-500">Kliyan: {order.customer.profile?.username || order.customer.email}</p></div><ul className="my-4 space-y-1 text-sm">{order.items.map((item, index) => <li key={`${order.id}-${index}`}>{item.quantity} × {item.menuItem.name}</li>)}</ul><div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800"><span className="flex items-center gap-2 text-sm font-black"><Bike size={16} className="text-blue-500"/>${Number(order.total).toFixed(2)} · {order.paymentMethod}</span>{order.status === 'PREPARING' ? <button disabled={busyId === order.id} onClick={() => void startDelivery(order.id)} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">{busyId === order.id ? 'Ap mete ajou...' : 'Kòmanse livrezon'}</button> : order.status === 'DELIVERING' ? <button disabled={busyId === order.id} onClick={() => void markDelivered(order.id)} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">{busyId === order.id ? 'Ap anrejistre...' : 'Konfime livrezon'}</button> : <span className="text-xs text-zinc-500">Restoran an poko prepare kòmand lan.</span>}</div></article>)}</div>}
  </section>;
}
