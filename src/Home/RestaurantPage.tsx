import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../Contexts/api/axios";
import fallbackRestaurantImage from "../assets/food-delivery.png";
import { useCart } from "../Contexts/CartContext";
import toast from "react-hot-toast";

type RestaurantDetails = {
    id: string;
    name: string;
    description?: string | null;
    owner?: { profile?: { avatarUrl?: string | null; bannerUrl?: string | null; location?: string | null } | null };
    menus: Array<{ id: string; name: string; description: string; price: number; image?: string | null; isAvailable?: boolean | null; category?: { name: string } | null }>;
};

export default function RestaurantPage() {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState<RestaurantDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const { addItem } = useCart();

    useEffect(() => {
        if (!id) return;
        api.get<RestaurantDetails>(`/restaurants/${id}`)
            .then((response) => setRestaurant(response.data))
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <main className="min-h-screen bg-zinc-950 p-8 text-zinc-300">Ap chaje meni a...</main>;
    if (error || !restaurant) return <main className="min-h-screen bg-zinc-950 p-8 text-zinc-200"><p>Nou pa jwenn restoran sa a.</p><Link className="mt-4 inline-block text-amber-400" to="/">Retounen lakay</Link></main>;

    const cover = restaurant.owner?.profile?.bannerUrl || restaurant.owner?.profile?.avatarUrl || fallbackRestaurantImage;

    return (
        <main className="min-h-screen bg-zinc-950 pb-20 text-white">
            <header className="mx-auto max-w-6xl px-5 pt-6"><Link to="/" className="text-sm font-semibold text-amber-400">← Retounen lakay</Link></header>
            <section className="mx-auto mt-5 max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-zinc-900">
                <img src={cover} alt={restaurant.name} className="h-56 w-full object-cover sm:h-72" />
                <div className="p-6"><h1 className="text-3xl font-black">{restaurant.name}</h1>
                    <p className="mt-2 max-w-2xl text-sm text-zinc-300">{restaurant.description || "Manje gou ak espesyalite lakay."}</p>
                    {restaurant.owner?.profile?.location && <p className="mt-2 text-xs text-zinc-400">{restaurant.owner.profile.location}</p>}
                </div>
            </section>
            <section className="mx-auto mt-8 max-w-6xl px-5">
                <h2 className="mb-4 text-xl font-bold">Meni restoran an</h2>
                {restaurant.menus.filter((item) => item.isAvailable !== false).length ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {restaurant.menus.filter((item) => item.isAvailable !== false).map((item) => (
                            <article key={item.id} className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
                                <img src={item.image || fallbackRestaurantImage} alt={item.name} className="h-40 w-full object-cover" />
                                <div className="p-4"><p className="text-xs uppercase tracking-wide text-amber-400">{item.category?.name || "Plat lokal"}</p>
                                    <h3 className="mt-1 font-bold">{item.name}</h3><p className="mt-1 line-clamp-2 text-sm text-zinc-400">{item.description}</p>
                                    <p className="mt-3 font-black text-amber-400">${Number(item.price).toFixed(2)}</p>
                                    <button onClick={() => {
                                        if (addItem({ id: item.id, restaurantId: restaurant.id, restaurantName: restaurant.name, name: item.name, price: Number(item.price), image: item.image })) toast.success('Plat la ajoute nan panyen an');
                                        else toast.error('Panyen an gen manje yon lòt restoran deja. Fini kòmand sa a anvan.');
                                    }} className="mt-3 w-full rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-zinc-950 hover:bg-amber-300">Ajoute nan panyen</button>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : <p className="text-sm text-zinc-400">Restoran sa a poko mete plat disponib nan meni li.</p>}
            </section>
        </main>
    );
}
