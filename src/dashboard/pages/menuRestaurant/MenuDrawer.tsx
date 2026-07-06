import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Image as ImageIcon, Clock } from 'lucide-react';

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  salesCount: number;
  prepTime: number;
}

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDish: Dish | null;
  onChangeDish: React.Dispatch<React.SetStateAction<Dish | null>>;
  onSave: (e: React.FormEvent) => void;
}

const MenuDrawer = ({ isOpen, onClose, selectedDish, onChangeDish, onSave }: MenuDrawerProps) => {
  if (!selectedDish) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Translucide */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50"
          />

          {/* Kontni Drawer (Slide-over) */}
          <motion.div 
            initial={{ x: window.innerWidth < 768 ? 0 : "100%", y: window.innerWidth < 768 ? "100%" : 0 }}
            animate={{ x: 0, y: 0 }}
            exit={{ x: window.innerWidth < 768 ? 0 : "100%", y: window.innerWidth < 768 ? "100%" : 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 240 }}
            className="fixed right-0 bottom-0 w-full md:w-[420px] h-[85vh] md:h-screen bg-white dark:bg-[#16161a] shadow-2xl z-50 flex flex-col justify-between rounded-t-3xl md:rounded-t-none md:rounded-l-3xl border-l border-gray-100 dark:border-[#24242b]"
          >
            {/* Tèt Drawer */}
            <div className="p-6 border-b border-gray-100 dark:border-[#24242b] flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-gray-900 dark:text-gray-100">
                  {selectedDish.name ? 'Modifye Plat sa' : 'Ajoute yon Nouvo Plat'}
                </h2>
                <p className="text-[11px] text-gray-400 dark:text-gray-500">Modifikasyon yo ap parèt an tan reyèl.</p>
              </div>
              <button onClick={onClose} className="p-2 bg-gray-50 hover:bg-gray-100 dark:bg-[#24242b] dark:hover:bg-[#2e2e38] rounded-full text-gray-500 dark:text-gray-400 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Kò Fòm nan */}
            <form 
              id="menu-dish-form"
              onSubmit={onSave} 
              className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-none"
            >
              {/* Foto Manje a */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Foto Manje a</label>
                <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-gray-50 dark:bg-[#0c0c0e] border border-gray-200 dark:border-[#24242b] group">
                  <img src={selectedDish.image} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer gap-2 text-white text-xs font-bold">
                    <ImageIcon size={16} />
                    <span>Chanje Foto</span>
                  </div>
                </div>
              </div>

              {/* Non Plat la */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Non Plat la</label>
                <input 
                  type="text" 
                  required
                  value={selectedDish.name}
                  onChange={(e) => onChangeDish({...selectedDish, name: e.target.value})}
                  placeholder="Egz: Griot ak Bannann Peze" 
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0c0c0e] border border-gray-200 dark:border-[#24242b] rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:bg-white dark:focus:bg-[#16161a] focus:border-orange-500 dark:focus:border-orange-500 transition-all"
                />
              </div>

              {/* Griy pou Pri ak Kategori */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pri ($ USD)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={selectedDish.price || ''}
                    onChange={(e) => onChangeDish({...selectedDish, price: parseFloat(e.target.value) || 0})}
                    placeholder="0.00" 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0c0c0e] border border-gray-200 dark:border-[#24242b] rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:bg-white dark:focus:bg-[#16161a] focus:border-orange-500 dark:focus:border-orange-500 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kategori</label>
                  <select 
                    value={selectedDish.category}
                    onChange={(e) => onChangeDish({...selectedDish, category: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0c0c0e] border border-gray-200 dark:border-[#24242b] rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:bg-white dark:focus:bg-[#16161a] focus:border-orange-500 dark:focus:border-orange-500 transition-all appearance-none"
                  >
                    <option value="Main" className="dark:bg-[#16161a]">Manje Prensipal</option>
                    <option value="Drinks" className="dark:bg-[#16161a]">Bwason</option>
                    <option value="Desserts" className="dark:bg-[#16161a]">Desè</option>
                  </select>
                </div>
              </div>

              {/* Tan Preparasyon */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <Clock size={12} className="text-orange-500" /> Tan Preparasyon (Minit)
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    required
                    min="1"
                    max="180"
                    value={selectedDish.prepTime || ''}
                    onChange={(e) => onChangeDish({...selectedDish, prepTime: parseInt(e.target.value) || 0})}
                    placeholder="Egz: 25" 
                    className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-[#0c0c0e] border border-gray-200 dark:border-[#24242b] rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:bg-white dark:focus:bg-[#16161a] focus:border-orange-500 dark:focus:border-orange-500 transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase">min</span>
                </div>
              </div>

              {/* Deskripsyon */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Deskripsyon</label>
                <textarea 
                  rows={4}
                  value={selectedDish.description}
                  onChange={(e) => onChangeDish({...selectedDish, description: e.target.value})}
                  placeholder="Mete engredyan yo..." 
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0c0c0e] border border-gray-200 dark:border-[#24242b] rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:bg-white dark:focus:bg-[#16161a] focus:border-orange-500 dark:focus:border-orange-500 transition-all resize-none leading-relaxed"
                />
              </div>
            </form>

            {/* Pye Drawer la */}
            <div className="p-6 border-t border-gray-100 dark:border-[#24242b] bg-gray-50/50 dark:bg-[#16161a]/50 flex items-center gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 py-3 border border-gray-200 dark:border-[#24242b] bg-white dark:bg-[#16161a] hover:bg-gray-50 dark:hover:bg-[#2e2e38] text-gray-500 dark:text-gray-400 text-xs font-bold rounded-xl transition-all active:scale-95"
              >
                Anile
              </button>
              <button 
                type="submit"
                form="menu-dish-form"
                className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-orange-500/10 active:scale-95"
              >
                <Save size={14} />
                <span>Sove Chanjman</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MenuDrawer;