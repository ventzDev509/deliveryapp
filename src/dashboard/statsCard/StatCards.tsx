import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, CookingPot, CheckCircle2 } from 'lucide-react';
import api from '../../Contexts/api/axios';

type OrderSummary = { id: string; total: number; status: string; createdAt: string };

export default function StatCards() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  useEffect(() => { api.get<OrderSummary[]>('/orders').then((response) => setOrders(response.data)).catch(() => setOrders([])); }, []);
  const stats = [
    { title: 'Valè kòmand yo', value: `$${orders.reduce((sum, order) => sum + (order.status === 'CANCELLED' ? 0 : Number(order.total)), 0).toFixed(2)}`, icon: DollarSign, color: 'text-amber-500 bg-amber-500/10' },
    { title: 'Tout kòmand', value: `${orders.length}`, icon: ShoppingBag, color: 'text-blue-500 bg-blue-500/10' },
    { title: 'Ap prepare / livre', value: `${orders.filter((order) => ['PREPARING', 'DELIVERING'].includes(order.status)).length}`, icon: CookingPot, color: 'text-orange-500 bg-orange-500/10' },
    { title: 'Livre', value: `${orders.filter((order) => order.status === 'COMPLETED').length}`, icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' },
  ];
  return <div className="mb-6 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map((stat, index) => { const Icon = stat.icon; return <motion.article key={stat.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"><div className="flex items-center justify-between"><span className="text-sm text-gray-500 dark:text-zinc-400">{stat.title}</span><span className={`rounded-xl p-2 ${stat.color}`}><Icon size={18}/></span></div><p className="mt-4 text-2xl font-black">{stat.value}</p></motion.article>; })}</div>;
}
