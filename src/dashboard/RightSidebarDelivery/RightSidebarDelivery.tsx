import { motion } from 'framer-motion';
import { ChefHat, Bike, CheckCircle2, Flame, ArrowUpRight, Clock } from 'lucide-react';

const topDishes = [
  {
    id: 1,
    name: "Griot ak Bannann Peze",
    category: "Plat Prensipal",
    orders: "184 fwa",
    revenue: "$2,208.00",
    image: "🍗",
    bg: "bg-amber-50 text-amber-600"
  },
  {
    id: 2,
    name: "Diri Kole, Sòs Poul",
    category: "Combo Midi", 
    orders: "142 fwa",
    revenue: "$1,988.00",
    image: "🍛",
    bg: "bg-orange-50 text-orange-600"
  },
  {
    id: 3,
    name: "Jus Sitwon Natirèl",
    category: "Bwason",
    orders: "95 fwa",
    revenue: "$380.00",
    image: "🍹",
    bg: "bg-yellow-50 text-yellow-600"
  },
];

const RightSidebarDelivery = () => {
  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* 1. LIVE MONITOR WIDGET */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full bg-neutral-950 p-5 rounded-3xl text-white border border-neutral-800 shadow-sm relative overflow-hidden"
      >
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Live Monitor</span>
          </div>
          <span className="text-[9px] bg-neutral-900 border border-neutral-800/60 px-2 py-0.5 rounded-md text-neutral-400 flex items-center gap-1 font-medium">
            <Clock size={9} /> Kwizin
          </span>
        </div>

        {/* Grid 3 Blòk - Optimize ak ti padding pou anfòm 1 kolòn nèt */}
        <div className="grid grid-cols-3 gap-2">
          {/* Kwit */}
          <div className="bg-neutral-900/40 p-2.5 rounded-xl border border-neutral-800/40 text-center">
            <div className="w-6 h-6 mx-auto rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center mb-1">
              <ChefHat size={12} />
            </div>
            <span className="block text-base font-black text-white">4</span>
            <span className="text-[9px] text-neutral-400 font-medium block truncate">Ap Kwit</span>
          </div>

          {/* En Route */}
          <div className="bg-neutral-900/40 p-2.5 rounded-xl border border-neutral-800/40 text-center">
            <div className="w-6 h-6 mx-auto rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-1">
              <Bike size={12} />
            </div>
            <span className="block text-base font-black text-white">2</span>
            <span className="text-[9px] text-neutral-400 font-medium block truncate">En Route</span>
          </div>

          {/* Livre */}
          <div className="bg-neutral-900/40 p-2.5 rounded-xl border border-neutral-800/40 text-center">
            <div className="w-6 h-6 mx-auto rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-1">
              <CheckCircle2 size={12} />
            </div>
            <span className="block text-base font-black text-emerald-400">28</span>
            <span className="text-[9px] text-neutral-400 font-medium block truncate">Livre</span>
          </div>
        </div>
      </motion.div>

      {/* 2. TOP SELLING DISHES */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="w-full bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-bold text-gray-900 tracking-tight flex items-center gap-1">
              <Flame size={14} className="text-orange-500 fill-orange-500" /> Plat ki pi Cho yo
            </h3>
          </div>
          <button className="text-[10px] font-bold text-orange-500 hover:text-orange-600 flex items-center gap-0.5 transition-colors">
            Meni <ArrowUpRight size={10} />
          </button>
        </div>

        {/* Lis Manje - Konpak ak Pwoteje kont debòdman (Truncate) */}
        <div className="flex flex-col gap-2.5">
          {topDishes.map((dish) => (
            <div 
              key={dish.id} 
              className="flex items-center justify-between p-1.5 rounded-xl hover:bg-gray-50/60 transition-colors border border-transparent hover:border-gray-50 min-w-0"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                {/* Emoji / Imaj */}
                <div className={`w-8 h-8 rounded-lg ${dish.bg} flex items-center justify-center flex-shrink-0 text-sm font-semibold shadow-sm`}>
                  {dish.image}
                </div>
                
                {/* Tèks - Pwoteje ak min-w-0 ak truncate */}
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-bold text-gray-900 truncate">
                    {dish.name}
                  </span>
                  <span className="text-[9px] text-gray-400 font-medium mt-0.5 truncate">
                    {dish.category}
                  </span>
                </div>
              </div>

              {/* Revni ak badj */}
              <div className="text-right flex flex-col flex-shrink-0 pl-2">
                <span className="text-xs font-bold text-gray-900">
                  {dish.revenue}
                </span>
                <span className="text-[9px] text-emerald-600 font-semibold bg-emerald-50 px-1 py-0.5 rounded mt-0.5 block text-center min-w-[45px]">
                  {dish.orders}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  );
};

export default RightSidebarDelivery;