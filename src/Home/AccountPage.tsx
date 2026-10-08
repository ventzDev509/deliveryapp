import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import fallbackFoodImage from '../assets/food-delivery.png';

const roleLabel: Record<string, string> = { CUSTOMER: 'Kliyan', RESTAURANT_OWNER: 'Mèt restoran', DRIVER: 'Chofè', ADMIN: 'Administratè' };

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return <main className="min-h-screen bg-zinc-950 p-8 text-white"><Link to="/auth" className="text-amber-400">Konekte pou w wè kont ou</Link></main>;
  return <main className="min-h-screen bg-zinc-950 px-4 py-10 text-white"><section className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-zinc-900 p-6 sm:p-8">
    <Link to="/" className="text-sm text-amber-400">← Retounen lakay</Link><h1 className="mt-6 text-3xl font-black">Kont mwen</h1>
    <div className="mt-6 flex items-center gap-4"><img src={user.profile?.avatarUrl || fallbackFoodImage} alt="" className="h-16 w-16 rounded-full bg-zinc-800 object-cover"/><div><p className="font-bold">{user.profile?.username || user.email}</p><p className="mt-1 text-sm text-zinc-400">{user.email}</p><p className="mt-1 text-xs text-amber-300">{roleLabel[user.role] || user.role}</p></div></div>
    <nav className="mt-8 grid gap-3"><Link to="/my-orders" className="rounded-xl bg-zinc-800 p-4 font-semibold hover:bg-zinc-700">Kòmand mwen yo</Link>{user.role === 'RESTAURANT_OWNER' && <Link to="/dashboard" className="rounded-xl bg-zinc-800 p-4 font-semibold hover:bg-zinc-700">Dashboard restoran</Link>}{user.role === 'ADMIN' && <Link to="/admin-validation" className="rounded-xl bg-zinc-800 p-4 font-semibold hover:bg-zinc-700">Dashboard admin</Link>}<button onClick={() => { logout(); navigate('/'); }} className="rounded-xl border border-rose-500/30 p-4 text-left font-semibold text-rose-300 hover:bg-rose-500/10">Dekonekte</button></nav>
  </section></main>;
}
