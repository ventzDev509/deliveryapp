import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Star,
  Clock3,
  Plus,
  Flame,
  ShoppingBag,
} from "lucide-react";

export interface FoodCardProps {
  title?: string;
  category?: string;
  image?: string;
  price?: number;
  rating?: number;
  reviews?: number;
  deliveryTime?: string;
  discount?: number;
  isPopular?: boolean;
  onAddToCart?: () => void;
}

export default function FoodCard({
  title = "Classic Cheeseburger",
  category = "Burger",
  image = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop",
  price = 12.99,
  rating = 4.8,
//   reviews = 128,
  deliveryTime = "20-30 min",
  discount = 20,
  isPopular = true,
  onAddToCart,
}: FoodCardProps) {
  const [favorite, setFavorite] = useState(false);

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: .2 }}
      className="group w-full mx-4 overflow-hidden rounded-3xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#18181B] shadow-sm hover:shadow-xl"
    >
      {/* Diminye wotè imaj la pou kat la pa long anpil (h-36 olye de aspect-square) */}
      <div className="relative h-36 w-full overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: .4 }}
          src={image}
          alt={title}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"/>

        {discount > 0 && (
          <div className="absolute left-2.5 top-2.5 rounded-full bg-red-500 px-2.5 py-0.5 text-[10px] font-bold text-white">
            -{discount}%
          </div>
        )}

        {isPopular && (
          <div className="absolute left-2.5 bottom-2.5 flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-black">
            <Flame size={12}/>
            Popular
          </div>
        )}

        <button
          onClick={() => setFavorite(v => !v)}
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/20 backdrop-blur-xl"
        >
          <Heart
            size={16}
            className={favorite ? "fill-rose-500 text-rose-500" : "text-white"}
          />
        </button>

        <div className="absolute right-2.5 bottom-2.5 rounded-full bg-white px-2 py-1 flex items-center gap-1 shadow-md">
          <Star size={13} className="fill-amber-400 text-amber-400"/>
          <span className="font-bold text-xs">{rating}</span>
        </div>
      </div>

      {/* Kontni an pi sere pou l pa pran twòp espas anwo desann */}
      <div className="p-3.5">
        <div className="flex items-center gap-1.5 text-amber-500 uppercase tracking-wider text-[10px] font-semibold">
          <ShoppingBag size={12}/>
          {category}
        </div>

        <h2 className="mt-1 line-clamp-1 text-base font-bold text-gray-900 dark:text-white group-hover:text-amber-500">
          {title}
        </h2>

        <div className="mt-2.5 flex items-center justify-between">
          <div className="rounded-full bg-gray-100 dark:bg-zinc-900 px-2.5 py-0.5 flex items-center gap-1.5 text-xs text-gray-700 dark:text-zinc-300">
            <Clock3 size={13}/>
            {deliveryTime}
          </div>
        </div>

        <div className="mt-3.5 flex items-center justify-between border-t border-gray-100 dark:border-zinc-800/80 pt-3">
          <div>
            <span className="text-[10px] text-gray-400 dark:text-zinc-500">Price</span>
            <h3 className="text-lg font-black text-gray-900 dark:text-white">
              ${price.toFixed(2)}
            </h3>
          </div>

          <motion.button
            whileTap={{ scale: .9 }}
            whileHover={{ scale: 1.05 }}
            onClick={onAddToCart}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 text-black shadow-lg shadow-amber-400/20 hover:bg-amber-300"
          >
            <Plus size={18} strokeWidth={2.5}/>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}