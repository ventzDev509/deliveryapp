import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../Contexts/api/axios";
import type { Restaurant } from "../Contexts/RestaurantContext";
import { useCart } from "../Contexts/CartContext";
import toast from "react-hot-toast";
import FoodCard from "../FoodCard/FoodCard";
import PopularRestaurantCard from "../FoodCard/PopularRestaurantCard";
import BannerSlider from "./BannerSlide";
import CategorySlider from "./Category";
import Header from "./Header";

type PopularFood = {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string | null;
    isAvailable: boolean | null;
    salesCount: number | null;
    prepTime: number | null;
    category: { id: string; name: string } | null;
    restaurant: {
        id: string;
        name: string;
        owner: { profile: { username?: string | null } | null };
        reviews: { rating: number }[];
    };
};

export default function Home() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [restaurantsLoading, setRestaurantsLoading] = useState(true);
    const [foods, setFoods] = useState<PopularFood[]>([]);
    const [foodsLoading, setFoodsLoading] = useState(true);
    const [foodsError, setFoodsError] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const { addItem } = useCart();

    const loadFoods = useCallback(async () => {
        setFoodsLoading(true);
        setFoodsError(false);
        try {
            const response = await api.get<PopularFood[]>("/restaurants/popular-foods?limit=20");
            setFoods(response.data);
        } catch {
            setFoodsError(true);
        } finally {
            setFoodsLoading(false);
        }
    }, []);

    const loadRestaurants = useCallback(async () => {
        setRestaurantsLoading(true);
        try {
            const response = await api.get<Restaurant[]>("/restaurants");
            setRestaurants(response.data);
        } catch {
            setRestaurants([]);
        } finally {
            setRestaurantsLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadFoods();
        void loadRestaurants();
    }, [loadFoods, loadRestaurants]);

    const filteredFoods = useMemo(() => {
        const query = searchQuery.trim().toLocaleLowerCase();
        return foods.filter((food) => {
            const matchesCategory = selectedCategory === "all" || food.category?.id === selectedCategory;
            const matchesSearch = !query || [food.name, food.description, food.category?.name, food.restaurant.name]
                .some((value) => value?.toLocaleLowerCase().includes(query));
            return matchesCategory && matchesSearch;
        });
    }, [foods, searchQuery, selectedCategory]);

    const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

    return (
        <div className="pb-28">
            <Header onSearch={setSearchQuery} />
            <BannerSlider onOrderNow={() => scrollTo("popular-foods")} />
            <div id="home-categories">
                <CategorySlider selectedCategoryId={selectedCategory} onSelect={setSelectedCategory} />
            </div>

            <section id="popular-foods" className="max-w-7xl mx-auto mt-7 scroll-mt-24">
                <div className="flex px-5 justify-between items-center mb-4">
                    <div>
                        <h2 className="text-white font-bold text-lg tracking-wide">Popular Foods</h2>
                        <p className="text-xs text-zinc-400 mt-1">Manje popilè restoran lokal yo</p>
                    </div>
                    <button onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }} className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors">Wè tout</button>
                </div>

                {foodsLoading ? (
                    <div className="px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((item) => <div key={item} className="h-72 rounded-3xl bg-zinc-900 animate-pulse" />)}
                    </div>
                ) : foodsError ? (
                    <div className="px-5 text-sm text-zinc-400">
                        Nou pa rive chaje manje yo.
                        <button onClick={() => void loadFoods()} className="ml-2 text-amber-400 underline">Eseye ankò</button>
                    </div>
                ) : filteredFoods.length ? (
                    <div className="flex items-stretch gap-4 overflow-x-auto no-scrollbar pb-3 pt-1 px-5">
                        {filteredFoods.map((food) => {
                            const ratings = food.restaurant.reviews.map((review) => review.rating);
                            const rating = ratings.length ? ratings.reduce((sum, value) => sum + value, 0) / ratings.length : null;
                            return (
                                <div key={food.id} className="w-[240px] sm:w-[270px] flex-shrink-0">
                                    <FoodCard
                                        restaurantId={food.restaurant.id}
                                        title={food.name}
                                        category={food.category?.name || "Plat lokal"}
                                        price={Number(food.price)}
                                        rating={rating ?? undefined}
                                        image={food.image || undefined}
                                        deliveryTime={food.prepTime ? `${food.prepTime} min` : "Tan an poko disponib"}
                                        isPopular={Boolean(food.salesCount)}
                                        onAddToCart={() => {
                                            const wasAdded = addItem({
                                                id: food.id,
                                                restaurantId: food.restaurant.id,
                                                restaurantName: food.restaurant.name,
                                                name: food.name,
                                                price: Number(food.price),
                                                image: food.image,
                                            });
                                            if (wasAdded) toast.success(`${food.name} ajoute nan panyen an`);
                                            else toast.error('Panyen an gen manje yon lòt restoran deja. Fini kòmand sa a anvan.');
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="px-5 text-sm text-zinc-400">Pa gen manje ki koresponn ak rechèch sa a pou kounye a.</p>
                )}
            </section>

            <section id="popular-restaurants" className="max-w-7xl mx-auto mt-9 scroll-mt-24">
                <div className="flex px-5 justify-between items-center mb-4">
                    <div>
                        <h2 className="text-white font-bold text-lg tracking-wide">Popular Restaurants</h2>
                        <p className="text-xs text-zinc-400 mt-1">Dekouvri restoran ki disponib yo</p>
                    </div>
                    <button onClick={() => scrollTo("popular-restaurants")} className="text-xs font-semibold text-amber-400 hover:text-amber-300">Wè restoran yo</button>
                </div>
                {restaurantsLoading ? (
                    <p className="px-5 text-sm text-zinc-400">Ap chaje restoran yo...</p>
                ) : restaurants.length ? (
                    <div className="flex items-stretch gap-4 overflow-x-auto no-scrollbar pb-3 pt-1 px-5">
                        {restaurants.map((restaurant) => <PopularRestaurantCard key={restaurant.id} restaurant={restaurant} />)}
                    </div>
                ) : (
                    <p className="px-5 text-sm text-zinc-400">Pa gen restoran disponib kounye a.</p>
                )}
            </section>
        </div>
    );
}
