import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bike, 
  Car, 
  Footprints, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Phone, 
  Mail, 
  Plus, 
  Search,
  SlidersHorizontal,
  MapPin,
  X,
  Save,
  User
} from 'lucide-react';

// --- INTERFACES ---
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
  onChangeDriver: (driver: Driver) => void;
  onSave: (e: React.FormEvent) => void;
}

const initialDrivers: Driver[] = [
  {
    id: "DRV-001",
    name: "Jean-Robert Baptiste",
    phone: "+509 3737-1234",
    email: "jr.baptiste@dev.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    status: "Available",
    vehicle: { type: "Moto", model: "Dayun 150 (Nwa)", plateNumber: "1-00234" },
    rating: 4.8,
    totalDeliveries: 342
  },
  {
    id: "DRV-002",
    name: "Stevenson Pierre",
    phone: "+509 4848-5678",
    email: "steeve.p@dev.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    status: "Busy",
    vehicle: { type: "Moto", model: "Suzuki AX100 (Wouj)", plateNumber: "1-05943" },
    currentOrderId: "ORD-9842",
    rating: 4.9,
    totalDeliveries: 512
  },
  {
    id: "DRV-003",
    name: "Dieudonné Fils-Aimé",
    phone: "+509 3131-9012",
    email: "dieudonne.fa@dev.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    status: "Offline",
    vehicle: { type: "Machin", model: "Toyota Probox (Blan)", plateNumber: "A-43920" },
    rating: 4.5,
    totalDeliveries: 120
  }
];

// --- COMPONENT: DRIVER DRAWER ---
const DriverDrawer = ({ isOpen, onClose, selectedDriver, onChangeDriver, onSave }: DriverDrawerProps) => {
  if (!selectedDriver) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50"
          />

          {/* Drawer Content */}
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
                  {selectedDriver.totalDeliveries > 0 ? 'Modifye Profile Chofè' : 'Ajoute yon Nouvo Chofè'}
                </h2>
                <p className="text-[11px] text-gray-400 dark:text-gray-500">Chanjman yo ap parèt sou tablodbò a imedyatman.</p>
              </div>
              <button type="button" onClick={onClose} className="p-2 bg-gray-50 hover:bg-gray-100 dark:bg-[#24242b] dark:hover:bg-[#2e2e38] rounded-full text-gray-500 dark:text-gray-400 transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Kò Fòm nan */}
            <form onSubmit={onSave} className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-none">
              
              {/* Estati */}
              <div className="flex items-center gap-4 bg-gray-50 dark:bg-[#0c0c0e]/50 p-4 rounded-2xl border border-gray-100 dark:border-[#24242b]">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                  <img src={selectedDriver.avatar} alt="Driver Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estati Chofè a</label>
                  <select 
                    value={selectedDriver.status}
                    onChange={(e) => onChangeDriver({...selectedDriver, status: e.target.value as any})}
                    className="w-full px-3 py-2 bg-white dark:bg-[#16161a] border border-gray-200 dark:border-[#24242b] rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 transition-all"
                  >
                    <option value="Available">🟢 Disponib (Available)</option>
                    <option value="Busy">🟡 Nan Livrezon (Busy)</option>
                    <option value="Offline">⚫ Deploge (Offline)</option>
                  </select>
                </div>
              </div>

              {/* Enfòmasyon Pèsonèl */}
              <div className="space-y-4">
                <h3 className="text-[11px] font-black text-orange-500 uppercase tracking-wider border-b border-gray-100 dark:border-[#24242b] pb-1">Enfòmasyon Pèsonèl</h3>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <User size={12} /> Non Konplè
                  </label>
                  <input 
                    type="text" 
                    required
                    value={selectedDriver.name}
                    onChange={(e) => onChangeDriver({...selectedDriver, name: e.target.value})}
                    placeholder="Egz: Jean-Robert Baptiste" 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0c0c0e] border border-gray-200 dark:border-[#24242b] rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:bg-white dark:focus:bg-[#16161a] focus:border-orange-500 dark:focus:border-orange-500 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Phone size={12} /> Nimewo Telefòn
                  </label>
                  <input 
                    type="text" 
                    required
                    value={selectedDriver.phone}
                    onChange={(e) => onChangeDriver({...selectedDriver, phone: e.target.value})}
                    placeholder="Egz: +509 3737-1234" 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0c0c0e] border border-gray-200 dark:border-[#24242b] rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:bg-white dark:focus:bg-[#16161a] focus:border-orange-500 dark:focus:border-orange-500 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Mail size={12} /> Adrès Imèl
                  </label>
                  <input 
                    type="email" 
                    required
                    value={selectedDriver.email}
                    onChange={(e) => onChangeDriver({...selectedDriver, email: e.target.value})}
                    placeholder="Egz: jr.baptiste@delivery.com" 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0c0c0e] border border-gray-200 dark:border-[#24242b] rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:bg-white dark:focus:bg-[#16161a] focus:border-orange-500 dark:focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              {/* Detay sou Machin */}
              <div className="space-y-4 pt-2">
                <h3 className="text-[11px] font-black text-orange-500 uppercase tracking-wider border-b border-gray-100 dark:border-[#24242b] pb-1">Detay sou Machin</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kalite Machin</label>
                    <select 
                      value={selectedDriver.vehicle.type}
                      onChange={(e) => onChangeDriver({
                        ...selectedDriver, 
                        vehicle: { ...selectedDriver.vehicle, type: e.target.value as any }
                      })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0c0c0e] border border-gray-200 dark:border-[#24242b] rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:bg-white dark:focus:bg-[#16161a] focus:border-orange-500 dark:focus:border-orange-500 transition-all"
                    >
                      <option value="Moto">🏍️ Moto</option>
                      <option value="Machin">🚗 Machin</option>
                      <option value="Bisiklèt">🚲 Bisiklèt</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nimewo Plak</label>
                    <input 
                      type="text" 
                      required
                      value={selectedDriver.vehicle.plateNumber}
                      onChange={(e) => onChangeDriver({
                        ...selectedDriver, 
                        vehicle: { ...selectedDriver.vehicle, plateNumber: e.target.value }
                      })}
                      placeholder="Egz: 1-00234" 
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0c0c0e] border border-gray-200 dark:border-[#24242b] rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:bg-white dark:focus:bg-[#16161a] focus:border-orange-500 dark:focus:border-orange-500 transition-all uppercase tracking-wider"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Modèl ak Koulè</label>
                  <input 
                    type="text" 
                    required
                    value={selectedDriver.vehicle.model}
                    onChange={(e) => onChangeDriver({
                      ...selectedDriver, 
                      vehicle: { ...selectedDriver.vehicle, model: e.target.value }
                    })}
                    placeholder="Egz: Dayun 150 (Nwa)" 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0c0c0e] border border-gray-200 dark:border-[#24242b] rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:bg-white dark:focus:bg-[#16161a] focus:border-orange-500 dark:focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

            </form>

            {/* Pye Drawer */}
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

// --- MAIN PAGE ---
const DriversPage = () => {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  // Eta pou kontwole Drawer a
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  // Aksyon louvri Drawer pou nouvo Chofè
  const handleAddNewDriver = () => {
    setSelectedDriver({
      id: `DRV-${String(drivers.length + 1).padStart(3, '0')}`,
      name: '',
      phone: '',
      email: '',
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      status: 'Available',
      vehicle: { type: 'Moto', model: '', plateNumber: '' },
      rating: 5.0,
      totalDeliveries: 0
    });
    setIsDrawerOpen(true);
  };

  // Aksyon louvri Drawer pou edite Chofè
  const handleEditDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsDrawerOpen(true);
  };

  // Sove chanjman (Kreyasyon oubyen Mizajou)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDriver) return;

    setDrivers(prev => {
      const exists = prev.some(d => d.id === selectedDriver.id);
      if (exists) {
        return prev.map(d => d.id === selectedDriver.id ? selectedDriver : d);
      } else {
        return [...prev, selectedDriver];
      }
    });

    setIsDrawerOpen(false);
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'Moto': return <Bike size={14} className="text-orange-500" />;
      case 'Machin': return <Car size={14} className="text-blue-500" />;
      default: return <Footprints size={14} className="text-green-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Available':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 text-[10px] font-bold rounded-full border border-green-200 dark:border-green-900/50">
            <CheckCircle2 size={10} /> Disponib
          </span>
        );
      case 'Busy':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold rounded-full border border-amber-200 dark:border-amber-900/50">
            <Clock size={10} /> Nan Livrezon
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 dark:bg-[#16161a] text-gray-500 dark:text-gray-400 text-[10px] font-bold rounded-full border border-gray-200 dark:border-[#24242b]">
            <AlertCircle size={10} /> Deploge
          </span>
        );
    }
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(search.toLowerCase()) || 
                          driver.vehicle.model.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || driver.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* TÈT PAJ LA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Jesyon Chofè yo</h1>
          <p className="text-xs text-gray-400 dark:text-gray-500">Swiv, modifye, epi kontwole flòt chofè Delivery Delivery yo.</p>
        </div>
        <button 
          onClick={handleAddNewDriver}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-orange-500/15 active:scale-95 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Ajoute yon Chofè</span>
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white dark:bg-[#16161a] p-4 rounded-2xl border border-gray-100 dark:border-[#24242b] shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Chache pa non oswa machin..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#0c0c0e] border border-gray-200 dark:border-[#24242b] rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:bg-white dark:focus:bg-[#16161a] focus:border-orange-500 dark:focus:border-orange-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto scrollbar-none py-1">
          <SlidersHorizontal size={14} className="text-gray-400 dark:text-gray-500 hidden sm:block flex-shrink-0" />
          {['All', 'Available', 'Busy', 'Offline'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === status 
                  ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 shadow-sm' 
                  : 'bg-gray-50 dark:bg-[#0c0c0e] text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#16161a]'
              }`}
            >
              {status === 'All' ? 'Tout' : status === 'Available' ? 'Disponib' : status === 'Busy' ? 'Nan Livrezon' : 'Deploge'}
            </button>
          ))}
        </div>
      </div>

      {/* GRIY KAT CHOFÈ YO */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredDrivers.map((driver) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              key={driver.id}
              className="bg-white dark:bg-[#16161a] border border-gray-100 dark:border-[#24242b] rounded-2xl p-5 shadow-sm hover:shadow-md dark:hover:shadow-lg transition-shadow flex flex-col justify-between relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">{driver.id}</span>
                {getStatusBadge(driver.status)}
              </div>

              <div className="flex items-start gap-3 mb-4">
                <img 
                  src={driver.avatar} 
                  alt={driver.name} 
                  className="w-12 h-12 rounded-xl object-cover border border-gray-100 dark:border-[#24242b] flex-shrink-0"
                />
                <div className="space-y-1 min-w-0">
                  <h3 className="text-sm font-black text-gray-900 dark:text-gray-100 truncate">{driver.name}</h3>
                  <div className="flex items-center gap-3 text-[11px] font-bold text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-0.5 text-amber-500">
                      <Star size={12} fill="currentColor" /> {driver.rating}
                    </span>
                    <span className="text-gray-300 dark:text-gray-700">•</span>
                    <span>{driver.totalDeliveries} livrezon</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-[#0c0c0e]/50 rounded-xl p-3 space-y-2 mb-4 border border-gray-100 dark:border-[#24242b]">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-gray-400 dark:text-gray-400 font-medium flex items-center gap-1.5 truncate mr-2">
                    {getVehicleIcon(driver.vehicle.type)} <span className="truncate">{driver.vehicle.model}</span>
                  </span>
                  <span className="bg-white dark:bg-[#16161a] px-2 py-0.5 border border-gray-200 dark:border-[#24242b] rounded text-gray-700 dark:text-gray-300 font-black tracking-wide uppercase text-[9px] flex-shrink-0">
                    {driver.vehicle.plateNumber}
                  </span>
                </div>
                {driver.status === 'Busy' && driver.currentOrderId && (
                  <div className="pt-2 border-t border-gray-200/60 dark:border-[#24242b] flex items-center justify-between text-[10px]">
                    <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                      <MapPin size={10} /> Kòmand: {driver.currentOrderId}
                    </span>
                    <span className="text-gray-400 dark:text-gray-500 italic">Nan wout...</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-[#24242b] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <a href={`tel:${driver.phone}`} className="p-2 bg-gray-50 dark:bg-[#0c0c0e] hover:bg-orange-50 dark:hover:bg-orange-950/50 hover:text-orange-500 text-gray-500 dark:text-gray-400 rounded-lg transition-colors">
                    <Phone size={13} />
                  </a>
                  <a href={`mailto:${driver.email}`} className="p-2 bg-gray-50 dark:bg-[#0c0c0e] hover:bg-orange-50 dark:hover:bg-orange-950/50 hover:text-orange-500 text-gray-500 dark:text-gray-400 rounded-lg transition-colors">
                    <Mail size={13} />
                  </a>
                </div>
                
                <button 
                  onClick={() => handleEditDriver(driver)}
                  className="px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-[#16161a] border border-gray-200 dark:border-[#24242b] text-gray-600 dark:text-gray-300 text-[11px] font-bold rounded-lg transition-all active:scale-95"
                >
                  Gade Profile
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredDrivers.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-[#16161a] rounded-2xl border border-dashed border-gray-200 dark:border-[#24242b]">
          <p className="text-xs font-bold text-gray-400 dark:text-gray-500">Okenn chofè pa matche ak rechèch ou a.</p>
        </div>
      )}

      {/* RENDER DRAWER LA */}
      <DriverDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedDriver={selectedDriver}
        onChangeDriver={(updatedDriver) => setSelectedDriver(updatedDriver)}
        onSave={handleSave}
      />

    </div>
  );
};

export default DriversPage;