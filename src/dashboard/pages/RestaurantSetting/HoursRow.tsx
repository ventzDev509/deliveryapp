import { motion } from "framer-motion";
import { ToggleLeft, ToggleRight } from "lucide-react";

interface HoursRowProps {
    day: string;
    isOpen: boolean;
    openTime: string;
    closeTime: string;
    onChange: (data: { isOpen: boolean; openTime: string; closeTime: string }) => void;
}

export default function HoursRow({
    day,
    isOpen,
    openTime,
    closeTime,
    onChange,
}: HoursRowProps) {
    return (
        <motion.div
            layout="position"
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-2 rounded-xl border transition-all duration-300 ${
                isOpen
                    ? "bg-white border-gray-200 shadow-sm dark:bg-zinc-900 dark:border-zinc-800"
                    : "bg-gray-50/50 border-gray-100 opacity-70 dark:bg-zinc-900/40 dark:border-zinc-800"
            }`}
        >
            {/* Jou ak Bouton Toggle */}
            <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-40">
                <span className="text-xs font-black text-gray-800 dark:text-zinc-200 w-20">
                    {day}
                </span>

                <button
                    type="button"
                    onClick={() => onChange({ isOpen: !isOpen, openTime, closeTime })}
                    className="active:scale-90 transition-transform cursor-pointer"
                >
                    {isOpen ? (
                        <ToggleRight className="text-orange-500" size={24} />
                    ) : (
                        <ToggleLeft className="text-gray-300 dark:text-zinc-600" size={24} />
                    )}
                </button>
            </div>

            {/* Lè yo */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                {isOpen ? (
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 w-full sm:w-auto"
                    >
                        <input
                            type="text"
                            value={openTime}
                            onChange={(e) => onChange({ isOpen, openTime: e.target.value, closeTime })}
                            placeholder="08:00 AM"
                            className="w-full sm:w-28 px-2.5 py-1.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg text-xs text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-orange-500 font-medium text-center"
                        />

                        <span className="text-xs text-gray-400 shrink-0">a</span>

                        <input
                            type="text"
                            value={closeTime}
                            onChange={(e) => onChange({ isOpen, openTime, closeTime: e.target.value })}
                            placeholder="05:00 PM"
                            className="w-full sm:w-28 px-2.5 py-1.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg text-xs text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-orange-500 font-medium text-center"
                        />
                    </motion.div>
                ) : (
                    <span className="text-[11px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-2.5 py-1 rounded-lg">
                        Fèmen
                    </span>
                )}
            </div>
        </motion.div>
    );
}