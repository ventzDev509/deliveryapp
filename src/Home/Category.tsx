import { useState } from "react";
import {
    Flame,
    Pizza,
    Sandwich,
    CupSoda,
    IceCreamCone,
    Beef,
    Fish,
} from "lucide-react";

const categories = [
    { id: "all", name: "Popular", icon: Flame },
    { id: "burger", name: "Burger", icon: Sandwich },
    { id: "pizza", name: "Pizza", icon: Pizza },
    { id: "drinks", name: "Drinks", icon: CupSoda },
    { id: "dessert", name: "Dessert", icon: IceCreamCone },
    { id: "taco", name: "Tacos", icon: Beef },
    { id: "sushi", name: "Sushi", icon: Fish },
];

export default function CategorySlider() {
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
            <div className="flex px-5 gap-2.5 overflow-x-auto no-scrollbar py-1">
                {categories.map((category) => {
                    const Icon = category.icon;
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
                                border
                                ${
                                    active
                                        ? "bg-amber-400 border-amber-400 text-black shadow-md shadow-amber-400/20"
                                        : "bg-white dark:bg-[#1c1c22] border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-300 hover:border-amber-400/40"
                                }
                            `}
                        >
                            <Icon
                                size={18}
                                className={active ? "text-black" : "text-amber-500"}
                            />
                            <span>{category.name}</span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}