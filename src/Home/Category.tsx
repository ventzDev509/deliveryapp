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
    {
        id: "all",
        name: "Popular",
        icon: Flame,
    },
    {
        id: "burger",
        name: "Burger",
        icon: Sandwich,
    },
    {
        id: "pizza",
        name: "Pizza",
        icon: Pizza,
    },
    {
        id: "drinks",
        name: "Drinks",
        icon: CupSoda,
    },
    {
        id: "dessert",
        name: "Dessert",
        icon: IceCreamCone,
    },
    {
        id: "taco",
        name: "Tacos",
        icon: Beef,
    },
    {
        id: "sushi",
        name: "Sushi",
        icon: Fish,
    },
];

export default function CategorySlider() {
    const [selectedCategory, setSelectedCategory] = useState("all");

    return (
        <section className="max-w-7xl mx-auto  mt-8">

            {/* HEADER */}

            <div className="flex px-5 items-center justify-between mb-5">

                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Categories
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
                        Discover your favorite meals
                    </p>
                </div>

                <button className="text-sm font-semibold text-amber-500 hover:text-amber-400 transition">
                    See All
                </button>

            </div>

            {/* CATEGORY LIST */}

            <div className="flex px-5 gap-4 overflow-x-auto no-scrollbar pb-3">

                {categories.map((category) => {
                    const Icon = category.icon;
                    const active = selectedCategory === category.id;

                    return (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`
                                group
                                min-w-[88px]
                                rounded-3xl
                                p-4
                                flex
                                flex-col
                                items-center
                                gap-3
                                transition-all
                                duration-300
                                border
                                ${
                                    active
                                        ? "bg-amber-400 border-amber-400 shadow-xl shadow-amber-400/30 scale-105"
                                        : "bg-white dark:bg-[#1c1c22] border-gray-200 dark:border-zinc-800 hover:border-amber-400/40 hover:-translate-y-1"
                                }
                            `}
                        >

                            {/* ICON */}

                            <div
                                className={`
                                    h-14
                                    w-14
                                    rounded-2xl
                                    flex
                                    items-center
                                    justify-center
                                    transition-all
                                    ${
                                        active
                                            ? "bg-white text-amber-500"
                                            : "bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 group-hover:bg-amber-100 dark:group-hover:bg-amber-400/10"
                                    }
                                `}
                            >
                                <Icon size={26} />
                            </div>

                            {/* NAME */}

                            <span
                                className={`
                                    text-sm
                                    font-semibold
                                    transition-colors
                                    ${
                                        active
                                            ? "text-black"
                                            : "text-gray-700 dark:text-zinc-200"
                                    }
                                `}
                            >
                                {category.name}
                            </span>

                        </button>
                    );
                })}
            </div>
        </section>
    );
}