import { useState } from "react";
import {
    Flame,
    Utensils,
    Pizza,
    Sandwich,
    CupSoda,
    IceCreamCone,
    Beef,
    Fish,
    Loader2
} from "lucide-react";
import { useCategory } from "../Contexts/CategoryContext";

// Yon lis ikon pa defo pou w ka reitilize lè nou ap map kategori yo
const defaultIcons = [Utensils, Pizza, Sandwich, CupSoda, IceCreamCone, Beef, Fish];

export default function CategorySlider() {
    const { categories, loading } = useCategory();
    const [selectedCategory, setSelectedCategory] = useState("all");

    return (
        <section className="max-w-7xl mx-auto mt-6">
            {/* HEADER */}
            <div className="flex px-5 items-center justify-between mb-3">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        Categories
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">
                        Discover your favorite meals
                    </p>
                </div>

                <button className="text-xs font-semibold text-amber-500 hover:text-amber-400 transition">
                    See All
                </button>
            </div>

            {/* CATEGORY LIST (Chips style) */}
            <div className="w-full max-w-[calc(100vw-2rem)] sm:max-w-none overflow-x-auto scrollbar-none pb-2">
                <div className="flex px-5 gap-2.5 w-max">
                    {/* Bouton "All / Popular" kòm premye opsyon fiks */}
                    <button
                        onClick={() => setSelectedCategory("all")}
                        className={`
                            flex items-center gap-2
                            px-3.5 py-2
                            rounded-2xl
                            whitespace-nowrap
                            text-xs sm:text-sm font-semibold
                            transition-all duration-200
                            border flex-shrink-0
                            ${
                                selectedCategory === "all"
                                    ? "bg-amber-400 border-amber-400 text-black shadow-md shadow-amber-400/20"
                                    : "bg-white dark:bg-[#1c1c22] border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-300 hover:border-amber-400/40"
                            }
                        `}
                    >
                        <Flame
                            size={18}
                            className={selectedCategory === "all" ? "text-black" : "text-amber-500"}
                        />
                        <span>Popular</span>
                    </button>

                    {/* Lòt kategori yo ki soti nan Baz Done a */}
                    {categories.map((category, index) => {
                        // Chwazi yon ikon pa defo an wotasyon nan lis la
                        const IconComponent = defaultIcons[index % defaultIcons.length];
                        const active = selectedCategory === category.id;

                        return (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`
                                    flex items-center gap-2
                                    px-3.5 py-2
                                    rounded-2xl
                                    whitespace-nowrap
                                    text-xs sm:text-sm font-semibold
                                    transition-all duration-200
                                    border flex-shrink-0
                                    ${
                                        active
                                            ? "bg-amber-400 border-amber-400 text-black shadow-md shadow-amber-400/20"
                                            : "bg-white dark:bg-[#1c1c22] border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-300 hover:border-amber-400/40"
                                    }
                                `}
                            >
                                
                                <span>{category.name}</span>
                            </button>
                        );
                    })}

                    {loading && categories.length === 0 && (
                        <div className="flex items-center gap-2 px-4 py-2 text-xs text-gray-400">
                            <Loader2 size={16} className="animate-spin text-amber-500" />
                            <span>Chaje kategori yo...</span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}