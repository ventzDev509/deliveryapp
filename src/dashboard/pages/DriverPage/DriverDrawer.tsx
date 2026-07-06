import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, User, Phone, Mail } from 'lucide-react';

// 1. Nou defini estrikti Driver la pou match ak paj prensipal la
interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  status: 'Available' | 'Busy' | 'Offline';
  vehicle: {
    type: 'Moto' | 'Machin' | 'Bisiklèt';
    model: string;
    plateNumber: string;
  };
  currentOrderId?: string;
  rating: number;
  totalDeliveries: number;
}

interface DriverDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDriver: Driver | null;
  onChangeDriver: React.Dispatch<React.SetStateAction<Driver | null>>;
  onSave: (e: React.FormEvent) => void;
}

const DriverDrawer = ({ isOpen, onClose, selectedDriver, onChangeDriver, onSave }: DriverDrawerProps) => {
  if (!selectedDriver) return null;

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

          {/* Kontni Drawer (Slide-over soti a dwat) */}
          <motion.div 
            initial={{ x: window.innerWidth < 768 ? 0 : "100%", y: window.innerWidth < 768 ? "100%" : 0 }}
            animate={{ x: 0, y: 0 }}
            exit={{ x: window.innerWidth < 768 ? 0 : "100%", y: window.innerWidth < 768 ? "100%" : 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 240 }}
            className="fixed right-0 bottom-0 w-full md:w-[420px] h-[85vh] md:h-screen bg-white shadow-2xl z-50 flex flex-col justify-between rounded-t-3xl md:rounded-t-none md:rounded-l-3xl border-l border-gray-100"
          >
            {/* Tèt Drawer */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-gray-900">
                  {selectedDriver.name ? 'Modifye Profile Chofè' : 'Ajoute yon Nouvo Chofè'}
                </h2>
                <p className="text-[11px] text-gray-400">Chanjman yo ap parèt sou tablodbò a imedyatman.</p>
              </div>
              <button onClick={onClose} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Kò Fòm nan (Scrollable) */}
            <form onSubmit={onSave} className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-none">
              
              {/* Seksyon Avatar ak Estati */}
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-200 border border-gray-300">
                  <img src={selectedDriver.avatar} alt="Driver Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Estati Chofè a</label>
                  <select 
                    value={selectedDriver.status}
                    onChange={(e) => onChangeDriver({...selectedDriver, status: e.target.value as any})}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:border-orange-500 transition-all appearance-none"
                  >
                    <option value="Available">🟢 Disponib (Available)</option>
                    <option value="Busy">🟡 Nan Livrezon (Busy)</option>
                    <option value="Offline">⚫ Deploge (Offline)</option>
                  </select>
                </div>
              </div>

              {/* ENFÒMASYON PÈSONÈL */}
              <div className="space-y-4">
                <h3 className="text-[11px] font-black text-orange-500 uppercase tracking-wider border-b border-gray-100 pb-1">Enfòmasyon Pèsonèl</h3>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <User size={12} /> Non Konplè
                  </label>
                  <input 
                    type="text" 
                    required
                    value={selectedDriver.name}
                    onChange={(e) => onChangeDriver({...selectedDriver, name: e.target.value})}
                    placeholder="Egz: Jean-Robert Baptiste" 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:bg-white focus:border-orange-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                      <Phone size={12} /> Nimewo Telefòn
                    </label>
                    <input 
                      type="text" 
                      required
                      value={selectedDriver.phone}
                      onChange={(e) => onChangeDriver({...selectedDriver, phone: e.target.value})}
                      placeholder="Egz: +509 3737-1234" 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:bg-white focus:border-orange-500 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                      <Mail size={12} /> Adrès Imèl
                    </label>
                    <input 
                      type="email" 
                      required
                      value={selectedDriver.email}
                      onChange={(e) => onChangeDriver({...selectedDriver, email: e.target.value})}
                      placeholder="Egz: jr.baptiste@delivery.com" 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:bg-white focus:border-orange-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* DETAY SOU MACHIN NAN */}
              <div className="space-y-4 pt-2">
                <h3 className="text-[11px] font-black text-orange-500 uppercase tracking-wider border-b border-gray-100 pb-1">Detay sou Machin</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Kalite Machin</label>
                    <select 
                      value={selectedDriver.vehicle.type}
                      onChange={(e) => onChangeDriver({
                        ...selectedDriver, 
                        vehicle: { ...selectedDriver.vehicle, type: e.target.value as any }
                      })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:bg-white focus:border-orange-500 transition-all appearance-none"
                    >
                      <option value="Moto">🏍️ Moto</option>
                      <option value="Machin">🚗 Machin</option>
                      <option value="Bisiklèt">🚲 Bisiklèt</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Nimewo Plak</label>
                    <input 
                      type="text" 
                      required
                      value={selectedDriver.vehicle.plateNumber}
                      onChange={(e) => onChangeDriver({
                        ...selectedDriver, 
                        vehicle: { ...selectedDriver.vehicle, plateNumber: e.target.value }
                      })}
                      placeholder="Egz: 1-00234" 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:bg-white focus:border-orange-500 transition-all uppercase tracking-wider"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Modèl ak Koulè</label>
                  <input 
                    type="text" 
                    required
                    value={selectedDriver.vehicle.model}
                    onChange={(e) => onChangeDriver({
                      ...selectedDriver, 
                      vehicle: { ...selectedDriver.vehicle, model: e.target.value }
                    })}
                    placeholder="Egz: Dayun 150 (Nwa)" 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:bg-white focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

            </form>

            {/* Pye Drawer la (Aksyon yo) */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 py-3 border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 text-xs font-bold rounded-xl transition-all active:scale-95"
              >
                Anile
              </button>
              <button 
                onClick={onSave}
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

export default DriverDrawer;