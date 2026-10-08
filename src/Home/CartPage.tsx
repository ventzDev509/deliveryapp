import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../Contexts/api/axios';
import { useAuth } from '../Contexts/AuthContext';
import { useCart } from '../Contexts/CartContext';
import toast from 'react-hot-toast';
import fallbackFoodImage from '../assets/food-delivery.png';

export default function CartPage() {
  const { items, total, setQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'MONCASH'>('CASH');
  const [submitting, setSubmitting] = useState(false);
  const [customerPosition, setCustomerPosition] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationMessage, setLocationMessage] = useState('');

  const captureLocation = () => {
    if (!navigator.geolocation) { setLocationMessage('Navigatè sa a pa sipòte GPS.'); return; }
    setLocationMessage('Ap chèche pozisyon GPS ou...');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCustomerPosition({ latitude: coords.latitude, longitude: coords.longitude });
        setLocationMessage('Pozisyon GPS la pare pou kòmand sa a.');
      },
      () => { setCustomerPosition(null); setLocationMessage('Nou pa jwenn pozisyon an. Pèmèt GPS nan navigatè a epi eseye ankò.'); },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  };

  const submitOrder = async (event: FormEvent) => {
    event.preventDefault();
    if (!items.length || !user) return;
    if (!customerPosition) { toast.error('Pran pozisyon GPS ou anvan ou konfime kòmand lan.'); return; }
    setSubmitting(true);
    try {
      const response = await api.post('/orders', {
        restaurantId: items[0].restaurantId,
        deliveryAddress,
        latitude: customerPosition.latitude,
        longitude: customerPosition.longitude,
        paymentMethod,
        items: items.map(({ id, quantity }) => ({ menuItemId: id, quantity })),
      });
      clearCart();
      toast.success('Kòmand ou anrejistre. Restoran an ap prepare l.');
      navigate('/my-orders', { state: { newOrderId: response.data.id } });
    } catch (error: any) {
      const message = error.response?.data?.message;
      toast.error(Array.isArray(message) ? message.join(' ') : message || 'Nou pa t ka anrejistre kòmand lan.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 px-4 pb-20 pt-8 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link to="/" className="text-sm font-semibold text-amber-400">← Kontinye gade meni</Link>
        <h1 className="mt-5 text-3xl font-black">Panyen mwen</h1>
        {items.length === 0 ? (
          <section className="mt-8 rounded-2xl border border-white/10 bg-zinc-900 p-8 text-center">
            <p className="text-zinc-300">Panyen an vid pou kounye a.</p><Link to="/" className="mt-4 inline-block rounded-xl bg-amber-400 px-4 py-2 font-bold text-zinc-950">Dekouvri manje</Link>
          </section>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
            <section className="space-y-3">
              <p className="text-sm text-zinc-400">Restoran: {items[0].restaurantName}</p>
              {items.map((item) => (
                <article key={item.id} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-zinc-900 p-4">
                  <img src={item.image || fallbackFoodImage} alt="" className="h-20 w-20 rounded-xl bg-zinc-800 object-cover" />
                  <div className="min-w-0 flex-1"><h2 className="truncate font-bold">{item.name}</h2><p className="mt-1 text-sm text-amber-400">${item.price.toFixed(2)}</p>
                    <div className="mt-3 inline-flex items-center gap-3 rounded-lg bg-zinc-800 px-2 py-1"><button aria-label="Retire youn" onClick={() => setQuantity(item.id, item.quantity - 1)} className="px-2">−</button><span>{item.quantity}</span><button aria-label="Ajoute youn" onClick={() => setQuantity(item.id, item.quantity + 1)} className="px-2">+</button></div>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-xs text-rose-400 hover:text-rose-300">Retire</button>
                </article>
              ))}
            </section>
            <form onSubmit={submitOrder} className="h-fit space-y-4 rounded-2xl border border-white/10 bg-zinc-900 p-5">
              <h2 className="text-lg font-bold">Finalize kòmand lan</h2>
              {!user && <p className="rounded-xl bg-amber-400/10 p-3 text-sm text-amber-200">Ou bezwen konekte anvan ou voye kòmand lan. <Link to="/auth" className="underline">Konekte</Link></p>}
              <label className="block text-sm font-semibold">Adrès livrezon<textarea required minLength={5} value={deliveryAddress} onChange={(event) => setDeliveryAddress(event.target.value)} className="mt-2 min-h-24 w-full rounded-xl border border-white/10 bg-zinc-950 p-3 text-sm outline-none focus:border-amber-400" placeholder="Nimewo kay, lari, zòn, vil" /></label>
              <div className="rounded-xl border border-white/10 bg-zinc-950 p-3">
                <p className="text-xs leading-5 text-zinc-400">Pou chofè a jwenn destinasyon an sou kat la, pran pozisyon GPS aparèy sa a. Pozisyon an ap anrejistre sou kòmand sa a; kowòdone yo ale nan sèvis routaj la pou trase wout la sou lari yo.</p>
                <button type="button" onClick={captureLocation} className="mt-3 rounded-lg border border-amber-400/40 px-3 py-2 text-xs font-bold text-amber-300">{customerPosition ? 'Pozisyon anrejistre ✓ · repran' : 'Pran pozisyon GPS mwen'}</button>
                {locationMessage && <p className="mt-2 text-xs text-zinc-400">{locationMessage}</p>}
                {customerPosition && <p className="mt-1 text-[11px] text-zinc-500">{customerPosition.latitude.toFixed(5)}, {customerPosition.longitude.toFixed(5)}</p>}
              </div>
              <label className="block text-sm font-semibold">Metòd peman<select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value as 'CASH' | 'MONCASH')} className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-950 p-3 text-sm"><option value="CASH">Lajan kach lè yo livre</option><option value="MONCASH">MonCash (peman poko konfime)</option></select></label>
              <p className="flex justify-between border-t border-white/10 pt-4 font-black"><span>Total</span><span>${total.toFixed(2)}</span></p>
              <button disabled={!user || !customerPosition || submitting} className="w-full rounded-xl bg-amber-400 px-4 py-3 font-black text-zinc-950 disabled:cursor-not-allowed disabled:opacity-50">{submitting ? 'Ap voye kòmand lan...' : 'Konfime kòmand lan'}</button>
              <p className="text-xs leading-5 text-zinc-500">MonCash chwazi kòm metòd peman; peman elektwonik la poko trete nan aplikasyon an.</p>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
