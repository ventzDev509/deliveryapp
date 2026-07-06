import { useState } from 'react';
import { motion } from 'framer-motion';
import { ToggleLeft, ToggleRight } from 'lucide-react';

interface HoursRowProps {
  day: string;
  initialIsOpen: boolean;
}

const HoursRow = ({ day, initialIsOpen }: HoursRowProps) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [openTime, setOpenTime] = useState("08:00");
  const [closeTime, setCloseTime] = useState("22:00");

  return (
    <motion.div 
      layout="position"
      className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
        isOpen 
          ? 'bg-white border-gray-200 shadow-sm dark:bg-zinc-900 dark:border-zinc-800' 
          : 'bg-gray-50/50 border-gray-100 opacity-70 dark:bg-zinc-900/40 dark:border-zinc-850'
      }`}
    >
      {/* Jou a ak Tòg la */}
      <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-40">
        <span className="text-xs font-black text-gray-800 dark:text-zinc-200 w-20">{day}</span>
        <button 
          type="button" 
          onClick={() => setIsOpen(!isOpen)} 
          className="active:scale-90 transition-transform"
        >
          {isOpen ? (
            <ToggleRight className="text-orange-500" size={24} />
          ) : (
            <ToggleLeft className="text-gray-300 dark:text-zinc-600" size={24} />
          )}
        </button>
      </div>

      {/* Seleksyon Lè yo (yo parèt sèlman si jou sa a ouvè) */}
      <div className="flex items-center gap-2 mt-2 sm:mt-0 w-full sm:w-auto justify-end">
        {isOpen ? (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-zinc-400"
          >
            <input 
              type="time" 
              value={openTime}
              onChange={(e) => setOpenTime(e.target.value)}
              className="px-2 py-1.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg text-gray-800 dark:text-zinc-200 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 transition-colors"
            />
            <span className="text-gray-400 dark:text-zinc-500 font-medium">pou</span>
            <input 
              type="time" 
              value={closeTime}
              onChange={(e) => setCloseTime(e.target.value)}
              className="px-2 py-1.5 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg text-gray-800 dark:text-zinc-200 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 transition-colors"
            />
          </motion.div>
        ) : (
          <span className="text-[11px] font-bold text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 px-2 py-1 rounded-lg">Fèmen</span>
        )}
      </div>
    </motion.div>
  );
};

export default HoursRow;