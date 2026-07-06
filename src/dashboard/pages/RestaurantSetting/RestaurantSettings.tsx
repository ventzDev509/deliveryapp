import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Clock, MapPin, Save, Camera, ShieldCheck, DollarSign, Truck } from 'lucide-react';
import HoursRow from './HoursRow';
import AdvancedSettings from './AdvancedSettings';

const springTransition = { type: "spring", stiffness: 200, damping: 25, mass: 0.8 } as const;

const RestaurantSettings = () => {
    const [activeTab, setActiveTab] = useState<'profile' | 'hours' | 'delivery' | 'advanced'>('profile');

    // Form states
    const [storeName, setStoreName] = useState("Kantin Peyi Mwen");
    const [phone, setPhone] = useState("+509 3700-0000");
    const [address, setAddress] = useState("Pétion-Ville, Haïti");
    const [deliveryRadius, setDeliveryRadius] = useState(5); // an km
    const [deliveryFee, setDeliveryFee] = useState(3.50);

    const handleSaveSettings = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Konfigirasyon an sove ak siksè! 🎉");
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 pb-12 transition-colors duration-300">

            {/* 1. TÈT PAJ LA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-zinc-50 tracking-tight">Konfigirasyon Restoran</h1>
                    <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Jere enfòmasyon piblik, orè travay, ak paramèt livrezon ou.</p>
                </div>

                <button
                    onClick={handleSaveSettings}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-orange-500/10 active:scale-95 sm:w-auto w-full"
                >
                    <Save size={16} />
                    <span>Sove Tout</span>
                </button>
            </div>

            {/* 2. DESIGN PREMIUM BANNER AK LOGO */}
            <div className="relative rounded-3xl overflow-hidden border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                {/* Banner */}
                <div className="h-32 md:h-44 bg-gradient-to-r from-orange-400 to-amber-500 relative group">
                    <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px]" />
                    <button className="absolute right-4 top-4 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white transition-all text-xs font-bold flex items-center gap-1.5 opacity-0 group-hover:opacity-100">
                        <Camera size={14} />
                        <span className="hidden sm:inline">Chanje Banner</span>
                    </button>
                </div>

                {/* Pwofil rapid anba Banner la */}
                <div className="px-6 pb-6 pt-12 md:pt-14 relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Ti kare Logo a ki monte sou Banner la */}
                    <div className="absolute -top-12 left-6 w-24 h-24 rounded-2xl border-4 border-white dark:border-zinc-900 bg-gray-100 dark:bg-zinc-800 shadow-md overflow-hidden group">
                        <img
                            src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=200"
                            alt="Logo"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white cursor-pointer transition-opacity">
                            <Camera size={16} />
                        </div>
                    </div>

                    <div>
                        <h2 className="text-base font-black text-gray-900 dark:text-zinc-100 flex items-center gap-1.5">
                            {storeName || "Non Restoran an"}
                            <ShieldCheck size={16} className="text-emerald-500 dark:text-emerald-400 fill-emerald-50 dark:fill-emerald-950/30" />
                        </h2>
                        <p className="text-xs text-gray-400 dark:text-zinc-500 font-medium">{address || "Pa gen adrès fiks"}</p>
                    </div>
                </div>
            </div>

            {/* 3. SISTÈM TABS (NAVIGATION) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-gray-200 dark:border-zinc-800 scrollbar-none">
                {[
                    { id: 'profile', label: 'Pwofil Jeneral', icon: Store },
                    { id: 'hours', label: 'Orè Travay', icon: Clock },
                    { id: 'delivery', label: 'Zòn Livrezon', icon: MapPin },
                    { id: 'advanced', label: 'Avanse & Peman', icon: ShieldCheck },
                ].map((tab) => {
                    const Icon = tab.icon;
                    const isSelected = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 relative whitespace-nowrap ${
                                isSelected ? 'text-orange-600 dark:text-orange-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300'
                            }`}
                        >
                            <Icon size={14} />
                            <span>{tab.label}</span>
                            {isSelected && (
                                <motion.div
                                    layoutId="activeTabIndicator"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* 4. KONTNI TAB YO AK ANIMASYON CONTENANT */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 min-h-[300px] shadow-sm">
                <form onSubmit={handleSaveSettings}>
                    <AnimatePresence mode="wait">

                        {/* TAB 1: PROFILE */}
                        {activeTab === 'profile' && (
                            <motion.div
                                key="profile-tab"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Non Restoran an</label>
                                        <input
                                            type="text"
                                            value={storeName}
                                            onChange={(e) => setStoreName(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-gray-800 dark:text-zinc-200 focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:border-orange-500 dark:focus:border-orange-500 transition-all"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Nimewo Telefòn</label>
                                        <input
                                            type="text"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-gray-800 dark:text-zinc-200 focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:border-orange-500 dark:focus:border-orange-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Adrès Restoran</label>
                                        <input
                                            type="text"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-gray-800 dark:text-zinc-200 focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:border-orange-500 dark:focus:border-orange-500 transition-all"
                                        />
                                </div>
                            </motion.div>
                        )}

                        {/* TAB 2: HOURS */}
                        {activeTab === 'hours' && (
                            <motion.div
                                key="hours-tab"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-3"
                            >
                                <div className="mb-2">
                                    <h3 className="text-xs font-bold text-gray-800 dark:text-zinc-200">Orè Operasyon yo</h3>
                                    <p className="text-[11px] text-gray-400 dark:text-zinc-500">Aktive jou restoran an ap travay epi mete lè ouvèti/fèmti.</p>
                                </div>

                                <motion.div layout="position" transition={springTransition} className="space-y-2">
                                    <HoursRow day="Lendi" initialIsOpen={true} />
                                    <HoursRow day="Madi" initialIsOpen={true} />
                                    <HoursRow day="Mèkredi" initialIsOpen={true} />
                                    <HoursRow day="Jedi" initialIsOpen={true} />
                                    <HoursRow day="Venredi" initialIsOpen={true} />
                                    <HoursRow day="Samdi" initialIsOpen={true} />
                                    <HoursRow day="Dimanch" initialIsOpen={false} />
                                </motion.div>
                            </motion.div>
                        )}

                        {/* TAB 3: DELIVERY PARAMETERS */}
                        {activeTab === 'delivery' && (
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
                                        <span className="text-xs font-black text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 px-2.5 py-0.5 rounded-lg">{deliveryRadius} KM</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="20"
                                        value={deliveryRadius}
                                        onChange={(e) => setDeliveryRadius(parseInt(e.target.value))}
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
                                            value={deliveryFee || ''}
                                            onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)}
                                            className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-gray-800 dark:text-zinc-200 focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:border-orange-500 dark:focus:border-orange-500 transition-all"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* TAB 4: ADVANCED SETTINGS */}
                        {activeTab === 'advanced' && (
                            <motion.div
                                key="advanced-tab"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <AdvancedSettings />
                            </motion.div>
                        )}

                    </AnimatePresence>
                </form>
            </div>

        </div>
    );
};

export default RestaurantSettings;