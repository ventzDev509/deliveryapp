import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../Contexts/api/axios';

type Order = { id: string; total: number; status: string; createdAt: string; customer: { email: string; profile?: { username?: string | null } | null }; items: Array<{ quantity: number; menuItem: { name: string } }> };
const labels: Record<string, string> = { PENDING: 'Nouvo', PREPARING: 'Ap prepare', DELIVERING: 'Sou wout', COMPLETED: 'Livre', CANCELLED: 'Anile' };

export default function RecentOrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get<Order[]>('/orders').then((response) => setOrders(response.data.slice(0, 5))).catch(() => setOrders([])).finally(() => setLoading(false)); }, []);
  return <section className="w-full overflow-hidden rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
    <header className="mb-4 flex items-center justify-between"><div><h2 className="font-bold">Dènye kòmand yo</h2><p className="mt-1 text-xs text-zinc-500">Kòmand aktyèl restoran ou.</p></div><Link to="/orders" className="text-xs font-bold text-amber-500">Tout kòmand →</Link></header>
    {loading ? <p className="py-8 text-center text-sm text-zinc-500">Ap chaje...</p> : !orders.length ? <p className="py-8 text-center text-sm text-zinc-500">Pa gen kòmand pou kounye a.</p> : <div className="overflow-x-auto"><table className="w-full min-w-[520px] text-left text-sm"><thead className="text-xs text-zinc-500"><tr><th className="py-2">Kòmand</th><th>Kliyan</th><th>Manje</th><th>Montan</th><th>Estati</th></tr></thead><tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">{orders.map((order) => <tr key={order.id}><td className="py-3 font-bold">{order.id.slice(0, 8)}</td><td>{order.customer.profile?.username || order.customer.email}</td><td className="max-w-44 truncate">{order.items.map((item) => `${item.quantity}× ${item.menuItem.name}`).join(', ')}</td><td>${Number(order.total).toFixed(2)}</td><td>{labels[order.status] || order.status}</td></tr>)}</tbody></table></div>}
  </section>;
}
