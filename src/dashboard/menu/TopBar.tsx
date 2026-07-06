import { useState } from 'react';
import { Search, Bell, SlidersHorizontal, Store, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TopBarProps {
  storeName?: string;
}

const TopBar = ({ storeName = "Delivery Store" }: TopBarProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showMobileSearch, setShowMobileSearch] = useState(false); // Kontwole ba rechèch mobil lan

  return (
    <header className="relative w-full mb-6 z-20">
      {/* KÒ TOPBAR PRENSIPAL LA */}
      <div className="w-full bg-white rounded-2xl p-4 md:px-6 md:py-4 border border-gray-300 sha flex items-center justify-between gap-4">
        
        {/* Bò gòch: Enfòmasyon sou Magazen an */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-50 rounded-xl md:rounded-2xl flex items-center justify-center text-orange-500 border border-orange-100 flex-shrink-0">
            <Store className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm md:text-lg font-bold text-gray-900 tracking-tight truncate">
              {storeName}
            </h1>
            {/* Bouton Toggle pou Estati Magazen an */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1.5 mt-0.5 group focus:outline-none"
            >
              <span className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
              <span className="text-[10px] md:text-xs font-medium text-gray-400 group-hover:text-gray-600 transition-colors whitespace-nowrap">
                {isOpen ? 'Magazen Louvri' : 'Magazen Fèmen'}
              </span>
            </button>
          </div>
        </div>

        {/* Bò dwat: Search (Desktop) ak Aksyon Notifikasyon */}
        <div className="flex items-center gap-2 md:gap-3 flex-1 justify-end md:flex-initial md:min-w-[420px]">
          
          {/* Input Rechèch - Visible SÈLMAN sou Desktop (md) */}
          <div className="relative flex-1 group hidden md:block">
            <Search 
              size={18} 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" 
            />
            <input
              type="text"
              placeholder="Rechèch kòmand, pwodwi, kliyan..."
              className="w-full bg-gray-50 border border-gray-100 text-gray-900 pl-11 pr-11 py-2.5 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 focus:bg-white transition-all shadow-inner"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors">
              <SlidersHorizontal size={16} />
            </button>
          </div>

          {/* 1. Bouton Loup pou Mobil sèlman (Klike pou louvri rechèch) */}
          <button 
            onClick={() => setShowMobileSearch(true)}
            className="md:hidden w-10 h-10 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-orange-50 transition-all active:scale-95"
          >
            <Search size={18} />
          </button>

          {/* 2. Bouton Notifikasyon Lavant */}
          <button className="relative w-10 h-10 md:w-12 md:h-12 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl flex items-center justify-center text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-all shadow-sm active:scale-95 flex-shrink-0">
            <Bell className="w-4 h-4 md:w-5 md:h-5" />
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[9px] md:text-[10px] font-bold w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center border-2 border-white shadow">
              3
            </span>
          </button>

        </div>
      </div>

      {/* OVERLAY RECHÈCH PREMIUM POU MOBIL (Glise soti anlè) */}
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-0 w-full bg-white rounded-2xl p-4 border border-gray-100 shadow-lg flex items-center gap-2 md:hidden"
          >
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500" />
              <input
                type="text"
                autoFocus
                placeholder="Rechèch kòmand, pwodwi..."
                className="w-full bg-gray-50 border border-orange-100 text-gray-900 pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-orange-400 focus:bg-white transition-all shadow-inner"
              />
            </div>
            <button 
              onClick={() => setShowMobileSearch(false)}
              className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 active:scale-95 transition-all"
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default TopBar;