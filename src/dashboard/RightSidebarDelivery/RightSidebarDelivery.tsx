import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../Contexts/api/axios';
import { useAuth } from '../../Contexts/AuthContext';
import fallbackFoodImage from '../../assets/food-delivery.png';

type Dish = { id: string; name: string; image?: string | null; salesCount?: number | null; price: number; category?: { name: string } | null };
type Restaurant = { id: string; name: string; menus: Dish[] };

export default function RightSidebarDelivery() {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [orders, setOrders] = useState<{ status: string }[]>([]);
  useEffect(() => {
    if (!user?.id) return;
    api.get<Restaurant>(`/restaurants/owner/${user.id}`).then((response) => setRestaurant(response.data)).catch(() => setRestaurant(null));
    api.get<{ status: string }[]>('/orders').then((response) => setOrders(response.data)).catch(() => setOrders([]));
  }, [user?.id]);
  const topDishes = [...(restaurant?.menus || [])].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0)).slice(0, 5);
  const pending = orders.filter((order) => order.status === 'PENDING').length;
  const preparing = orders.filter((order) => order.status === 'PREPARING').length;
  const delivered = orders.filter((order) => order.status === 'COMPLETED').length;
  return <aside className="space-y-5">
    <section className="rounded-3xl border border-gray-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"><header className="flex items-center justify-between"><div><h2 className="font-bold">Apèsi sou kòmand</h2><p className="mt-1 text-xs text-zinc-500">Chif aktyèl yo soti nan sistèm nan</p></div><Link to="/orders" className="text-xs font-bold text-amber-500">Louvri</Link></header>
      <div className="mt-5 grid grid-cols-3 gap-2 text-center"><div className="rounded-xl bg-blue-500/10 p-3"><b className="block text-lg text-blue-500">{pending}</b><span className="text-[10px] text-zinc-500">Nouvo</span></div><div className="rounded-xl bg-amber-500/10 p-3"><b className="block text-lg text-amber-500">{preparing}</b><span className="text-[10px] text-zinc-500">Ap prepare</span></div><div className="rounded-xl bg-emerald-500/10 p-3"><b className="block text-lg text-emerald-500">{delivered}</b><span className="text-[10px] text-zinc-500">Livre</span></div></div>
    </section>
    <section className="rounded-3xl border border-gray-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"><header className="flex items-center justify-between"><div><h2 className="font-bold">Plat ki pi vann</h2><p className="mt-1 text-xs text-zinc-500">Dapre kantite lavant ki anrejistre</p></div><Link to="/restaurants" className="text-xs font-bold text-amber-500">Meni</Link></header>
      {!restaurant ? <p className="mt-5 text-sm text-zinc-500">Restoran an poko disponib.</p> : !topDishes.length ? <p className="mt-5 text-sm text-zinc-500">Meni an poko gen plat.</p> : <ul className="mt-4 space-y-3">{topDishes.map((dish) => <li key={dish.id} className="flex items-center gap-3"><img src={dish.image || fallbackFoodImage} alt="" className="h-10 w-10 rounded-lg object-cover"/><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{dish.name}</p><p className="text-xs text-zinc-500">{dish.category?.name || 'Plat'} · {dish.salesCount || 0} vann</p></div><b className="text-sm">${Number(dish.price).toFixed(2)}</b></li>)}</ul>}
    </section>
  </aside>;
}
