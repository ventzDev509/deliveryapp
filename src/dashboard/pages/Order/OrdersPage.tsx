import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../../../Contexts/api/axios';
import { useAuth } from '../../../Contexts/AuthContext';
import { Bike, Loader2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

type OrderStatus = 'PENDING' | 'PREPARING' | 'DELIVERING' | 'COMPLETED' | 'CANCELLED';
type Order = {
  id: string; total: number; status: OrderStatus; paymentStatus: string; paymentMethod: string; deliveryAddress: string; createdAt: string;
  customer: { email: string; profile?: { username?: string | null } | null };
  restaurant: { id: string; name: string };
  driver?: { id: string; name: string; phone: string } | null;
  items: Array<{ quantity: number; menuItem: { name: string; price: number } }>;
};
type DriverOption = { id: string; name: string; status: string };

const statusLabel: Record<OrderStatus, string> = { PENDING: 'Nouvo', PREPARING: 'Ap prepare', DELIVERING: 'Sou wout', COMPLETED: 'Livre', CANCELLED: 'Anile' };

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [drivers, setDrivers] = useState<DriverOption[]>([]);
  const [selectedDrivers, setSelectedDrivers] = useState<Record<string, string>>({});
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [busyOrder, setBusyOrder] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(false);
    try {
      const [orderResponse, driverResponse] = await Promise.all([api.get<Order[]>('/orders'), api.get<DriverOption[]>('/drivers/available')]);
      setOrders(orderResponse.data);
      setDrivers(driverResponse.data);
    } catch { setError(true); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const visibleOrders = useMemo(() => orders.filter((order) => {
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    const search = query.trim().toLowerCase();
    const matchesQuery = !search || [order.id, order.customer.email, order.customer.profile?.username, order.restaurant.name]
      .some((value) => value?.toLowerCase().includes(search));
    return matchesStatus && matchesQuery;
  }), [orders, query, statusFilter]);

  const setStatus = async (order: Order, status: OrderStatus) => {
    setBusyOrder(order.id);
    try { await api.patch(`/orders/${order.id}/status`, { status }); await load(); toast.success('Estati kòmand lan mete ajou.'); }
    catch (err: any) { toast.error(err.response?.data?.message || 'Mizajou estati a echwe.'); }
    finally { setBusyOrder(null); }
  };

  const assignDriver = async (orderId: string) => {
    const driverId = selectedDrivers[orderId];
    if (!driverId) return toast.error('Chwazi yon chofè anvan.');
    setBusyOrder(orderId);
    try { await api.patch(`/orders/${orderId}/driver`, { driverId }); await load(); toast.success('Chofè a resevwa livrezon an.'); }
    catch (err: any) { toast.error(err.response?.data?.message || 'Nou pa t ka bay chofè a kòmand lan.'); }
    finally { setBusyOrder(null); }
  };

  return <section className="flex w-full flex-col gap-5 text-zinc-900 dark:text-zinc-100">
    <header className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-2xl font-black">Kòmand restoran an</h1><p className="mt-1 text-sm text-zinc-500">Aksepte kòmand, chwazi chofè, epi mete estati livrezon an ajou.</p></div><button onClick={() => void load()} className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-bold dark:border-zinc-800">Rafrechi</button></header>
    <div className="flex flex-wrap gap-3"><label className="relative min-w-56 flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Chèche kliyan, restoran, oswa ID" className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-9 pr-3 text-sm dark:border-zinc-800 dark:bg-zinc-900"/></label><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900"><option value="ALL">Tout estati</option>{Object.entries(statusLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
    {loading ? <div className="flex justify-center py-16"><Loader2 className="animate-spin text-amber-500"/></div> : error ? <div className="rounded-2xl border border-rose-500/20 p-6 text-sm">Nou pa ka chaje kòmand yo. <button onClick={() => void load()} className="text-amber-500 underline">Eseye ankò</button></div> : visibleOrders.length === 0 ? <div className="rounded-2xl border border-zinc-200 p-10 text-center text-sm text-zinc-500 dark:border-zinc-800">Pa gen kòmand ki koresponn ak filtè a.</div> : <div className="grid gap-4 xl:grid-cols-2">{visibleOrders.map((order) => <article key={order.id} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-black">{order.restaurant.name}</p><p className="mt-1 text-xs text-zinc-500">{new Date(order.createdAt).toLocaleString()} · {order.id.slice(0, 8)}</p></div><span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-500">{statusLabel[order.status]}</span></div>
      <p className="mt-4 text-sm font-semibold">{order.customer.profile?.username || order.customer.email}</p><p className="mt-1 text-xs text-zinc-500">{order.deliveryAddress}</p>
      <ul className="mt-3 space-y-1 text-sm">{order.items.map((item, index) => <li key={`${order.id}-${index}`} className="flex justify-between gap-3"><span>{item.quantity} × {item.menuItem.name}</span><span>${(Number(item.menuItem.price) * item.quantity).toFixed(2)}</span></li>)}</ul>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-3 dark:border-zinc-800"><div><p className="font-black">${Number(order.total).toFixed(2)}</p><p className="text-xs text-zinc-500">{order.paymentMethod} · {order.paymentStatus}</p></div><div className="flex flex-wrap items-center gap-2">
        {order.status === 'PENDING' && <button disabled={busyOrder === order.id} onClick={() => void setStatus(order, 'PREPARING')} className="rounded-lg bg-amber-400 px-3 py-2 text-xs font-bold text-zinc-950 disabled:opacity-50">Aksepte kòmand</button>}
        {order.status === 'PREPARING' && <>{order.driver ? <span className="text-xs text-zinc-500"><Bike size={13} className="mr-1 inline"/>{order.driver.name}</span> : <><select value={selectedDrivers[order.id] || ''} onChange={(e) => setSelectedDrivers((current) => ({ ...current, [order.id]: e.target.value }))} className="max-w-40 rounded-lg border border-zinc-200 bg-white px-2 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-900"><option value="">Chwazi chofè</option>{drivers.map((driver) => <option key={driver.id} value={driver.id}>{driver.name}</option>)}</select><button disabled={busyOrder === order.id} onClick={() => void assignDriver(order.id)} className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">Bay chofè</button></>}</>}
        {order.status === 'PENDING' || order.status === 'PREPARING' ? <button disabled={busyOrder === order.id} onClick={() => void setStatus(order, 'CANCELLED')} className="rounded-lg border border-rose-300 px-3 py-2 text-xs font-bold text-rose-500 disabled:opacity-50">Anile</button> : null}
        {busyOrder === order.id && <Loader2 size={16} className="animate-spin text-amber-500"/>}
      </div></div>
    </article>)}</div>}
    {user?.role === 'ADMIN' && <p className="text-xs text-zinc-500">Ou wè tout kòmand yo kòm administratè.</p>}
  </section>;
}
