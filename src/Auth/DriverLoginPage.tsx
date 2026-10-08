import { useState, type FormEvent } from 'react';
import { Bike, MapPin } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';

export default function DriverLoginPage() {
  const { user, loginDriver, logout } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user?.role === 'DRIVER') return <Navigate to="/my-deliveries" replace />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await loginDriver({ email, phone });
      if (result.user?.role !== 'DRIVER') {
        logout();
        setError('Kont sa a pa gen wòl chofè. Kontakte administratè a pou aktive kont chofè ou.');
        return;
      }
      navigate('/my-deliveries', { replace: true });
    } catch (authError: any) {
      const message = authError?.message;
      setError(Array.isArray(message) ? message.join(' ') : typeof message === 'string' ? message : 'Imèl oswa nimewo telefòn chofè a pa kòrèk.');
    } finally {
      setLoading(false);
    }
  };

  return <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-10 text-white">
    <section className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-900 p-7 shadow-2xl sm:p-9">
      <Link to="/" className="text-sm font-semibold text-amber-400">← Retounen lakay</Link>
      <div className="mt-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-400"><Bike size={28}/></div>
      <h1 className="mt-5 text-3xl font-black">Koneksyon chofè</h1>
      <p className="mt-2 text-sm leading-6 text-zinc-400">Konekte ak kont chofè ou. Lè ou gen livrezon aktif, pèmèt GPS la pou kliyan an ka wè pozisyon moto a epi swiv chemen an sou kat la.</p>
      <form onSubmit={(event) => void submit(event)} className="mt-7 space-y-4">
        <label className="block text-sm font-semibold">Imèl<input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 outline-none focus:border-amber-400" placeholder="chofe@egzanp.com"/></label>
        <label className="block text-sm font-semibold">Nimewo telefòn<input type="tel" autoComplete="tel" inputMode="tel" required value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 outline-none focus:border-amber-400" placeholder="+509 0000 0000"/></label>
        {error && <p role="alert" className="rounded-xl bg-rose-500/10 p-3 text-sm text-rose-300">{error}</p>}
        <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-3 font-black text-zinc-950 disabled:opacity-60">{loading ? 'Ap konekte...' : <><MapPin size={17}/> Konekte kòm chofè</>}</button>
      </form>
      <p className="mt-5 text-center text-xs leading-5 text-zinc-500">GPS la nesesè sèlman pandan w ap suiv yon livrezon aktif.</p>
      <p className="mt-4 text-center text-xs text-zinc-500">Administratè? <Link to="/auth" className="font-bold text-amber-400 hover:underline">Konekte isit la</Link></p>
    </section>
  </main>;
}
