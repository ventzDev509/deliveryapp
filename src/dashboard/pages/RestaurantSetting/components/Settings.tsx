import {motion} from "framer-motion"
import { DollarSign, Truck } from "lucide-react"

export default function Settings() {
    return <>
        <motion.div
            key="delivery-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
        >
            {/* Reyon Livrezon an Slider */}
            <div className="p-4 bg-gray-50 dark:bg-zinc-950/40 border border-gray-200 dark:border-zinc-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Truck size={16} className="text-orange-500" />
                        <span className="text-xs font-bold text-gray-800 dark:text-zinc-200">Reyon Livrezon Maksimòm</span>
                    </div>
                    <span className="text-xs font-black text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 px-2.5 py-0.5 rounded-lg">dk</span>
                </div>
                <input
                    type="range"
                    min="1"
                    max="20"
                    
                    className="w-full h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <p className="text-[10px] text-gray-400 dark:text-zinc-500">Kliyan ki pi lwen pase distans sa a pap kapab pase kòmand.</p>
            </div>

            {/* Pri fiks Livrezon */}
            <div className="flex flex-col gap-1.5 max-w-xs">
                <label className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Pri Fiks Livrezon ($ USD)</label>
                <div className="relative">
                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500" size={14} />
                    <input
                        type="number"
                        step="0.01"
                        className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-gray-800 dark:text-zinc-200 focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:border-orange-500 dark:focus:border-orange-500 transition-all"
                    />
                </div>
            </div>
        </motion.div>
    </>
}