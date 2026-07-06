import { ArrowUpRight, ArrowDownRight, DollarSign, ShoppingBag, Users } from 'lucide-react';
import { motion } from 'framer-motion';

// Done pou estatistik yo (Ou ka konekte sa ak API ou pita)
const statsData = [
    {
        title: "Lavant Jodi a",
        value: "$1,245.00",
        change: "+12.5%",
        isPositive: true,
        icon: DollarSign,
        color: "from-orange-500 to-amber-500",
        bgLight: "bg-orange-50/60 dark:bg-orange-500/10",
        textLight: "text-orange-500 dark:text-orange-400",
    },
    {
        title: "Nouvo Kòmand",
        value: "42 kòmand",
        change: "+8.2%",
        isPositive: true,
        icon: ShoppingBag,
        color: "from-blue-500 to-indigo-500",
        bgLight: "bg-blue-50/60 dark:bg-blue-500/10",
        textLight: "text-blue-500 dark:text-blue-400",
    },
    {
        title: "Nouvo Kliyan",
        value: "+18 moun",
        change: "-3.1%",
        isPositive: false,
        icon: Users,
        color: "from-emerald-500 to-teal-500",
        bgLight: "bg-emerald-50/60 dark:bg-emerald-500/10",
        textLight: "text-emerald-500 dark:text-emerald-400",
    },
    {
        title: "Nouvo Kliyan",
        value: "+18 moun",
        change: "-3.1%",
        isPositive: false,
        icon: Users,
        color: "from-emerald-500 to-teal-500",
        bgLight: "bg-emerald-50/60 dark:bg-emerald-500/10",
        textLight: "text-emerald-500 dark:text-emerald-400",
    },
  
];

const StatCards = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5 w-full mb-6">
            {statsData.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className="bg-white rounded-2xl p-5 border border-gray-300 flex flex-col justify-between relative overflow-hidden group dark:bg-zinc-950 dark:border-zinc-800 transition-colors duration-300"
                    >
                        {/* Ti gradyan ki parèt anba nèt lè w pase sourit sou li (Hover effect) */}
                        <div className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                        <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium text-gray-400 tracking-tight truncate dark:text-zinc-500">
                                {stat.title}
                            </span>
                            {/* Ikon Box */}
                            <div className={`w-10 h-10 ${stat.bgLight} ${stat.textLight} rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                                <Icon size={20} />
                            </div>
                        </div>

                        <div className="mt-4 flex items-end justify-between">
                            <div>
                                <h3 className="text-xl md:text-xl font-bold text-gray-900 tracking-tight dark:text-zinc-50">
                                    {stat.value}
                                </h3>
                            </div>

                            {/* Endikatè Kwasans (Trend Badj) */}
                            <div className={`flex items-center gap-0.5 px-2 py-1 rounded-lg text-xs font-semibold ${
                                stat.isPositive 
                                    ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400' 
                                    : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                                }`}>
                                {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                <span>{stat.change}</span>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default StatCards;