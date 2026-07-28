import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Clock, ShieldCheck,  } from 'lucide-react';

import AdvancedSettings from './AdvancedSettings';
import UpdateProfile from './components/UpdateProfile';
import ProfileBanner from './components/ProfileBanner';
import HouseOfWork from './components/HoursOfWork';

const RestaurantSettings = () => {
    const [activeTab, setActiveTab] = useState<'profile' | 'hours' | 'delivery' | 'advanced'>('profile');
   

    return (
        <div className="w-full  mx-auto flex flex-col gap-6 pb-12 transition-colors duration-300">

            {/* 1. TÈT PAJ LA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-zinc-50 tracking-tight">Konfigirasyon Restoran</h1>
                    <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Jere enfòmasyon piblik, orè travay, ak paramèt livrezon ou.</p>
                </div>
            </div>

            {/* 2. DESIGN PREMIUM BANNER AK LOGO */}
            <ProfileBanner />

            {/* 3. SISTÈM TABS (NAVIGATION) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-gray-200 dark:border-zinc-800 scrollbar-none">
                {[
                    { id: 'profile', label: 'Pwofil Jeneral', icon: Store },
                    { id: 'hours', label: 'Orè Travay', icon: Clock },
                    { id: 'advanced', label: 'Avanse & Peman', icon: ShieldCheck },
                ].map((tab) => {
                    const Icon = tab.icon;
                    const isSelected = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 relative whitespace-nowrap ${isSelected ? 'text-orange-600 dark:text-orange-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300'
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
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-4 min-h-[300px] shadow-sm">
                
                    <AnimatePresence mode="wait">

                        {/* TAB 1: PROFILE */}
                        {activeTab === 'profile' && (
                            <UpdateProfile />
                        )}

                        {/* TAB 2: HOURS */}
                        {activeTab === 'hours' && (
                            <HouseOfWork />
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
             
            </div>

        </div>
    );
};

export default RestaurantSettings;