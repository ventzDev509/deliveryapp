import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Bike, Car, Footprints, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { useDriver } from '../../../Contexts/DriverContext';
import { DriverFilter } from './DriverFilter';
import WhiteLoader from '../../../loader/WhiteLoader';
import { useState } from 'react';
import type { Driver } from '../../../types/driver.types';
import { DriverForm } from './DriverDrawer';

// Fonksyon pou jenere koulè vif pou chak chofè
const getAvatarColor = (name: string) => {
    const colors = [
        "bg-red-500", "bg-orange-500", "bg-amber-500",
        "bg-emerald-500", "bg-blue-500", "bg-indigo-500", "bg-purple-500"
    ];
    const index = name.length % colors.length;
    return colors[index];
};

export default function DriverCard() {
    const { drivers, loading } = useDriver();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [driverToEdit, setDriverToEdit] = useState<Driver | null>(null);
    // Eta pou Filtre
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Lojik pou filtre chofè yo
    const filteredDrivers = drivers.filter((d) => {
        const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
            d.email.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    const handleEditClick = (driver: Driver) => {
        setDriverToEdit(driver);
        setIsDrawerOpen(true);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'AVAILABLE': return <span className="text-[10px] text-green-600 dark:text-green-400 font-bold flex items-center gap-1"><CheckCircle2 size={10} /> Disponib</span>;
            case 'ON_DELIVERY': return <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1"><Clock size={10} /> Livrezon</span>;
            case 'BROKEN_DOWN': return <span className="text-[10px] text-red-600 font-bold flex items-center gap-1"><AlertCircle size={10} /> Panne</span>;
            case 'IN_TRAFFIC': return <span className="text-[10px] text-blue-600 font-bold flex items-center gap-1"><Clock size={10} /> Trafik</span>;
            case 'SUSPENDED': return <span className="text-[10px] text-red-800 font-bold flex items-center gap-1"><AlertCircle size={10} /> Sispann</span>;
            default: return <span className="text-[10px] text-gray-500 font-bold flex items-center gap-1"><AlertCircle size={10} /> Deploge</span>;
        }
    };

    if (loading) return <div className="p-4 text-center text-zinc-500"><WhiteLoader size={30} /></div>;

    return (
        <div className="">
            <DriverFilter
                search={search}
                setSearch={setSearch}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
            />

            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">

                <AnimatePresence mode="popLayout">
                    {filteredDrivers.map((driver) => (
                        <motion.div
                            key={driver.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">ID: {driver.id.slice(0, 8)}</span>
                                {getStatusBadge(driver.status)}
                            </div>

                            <div className="flex items-start gap-3 mb-4">
                                <div className={`w-12 h-12 rounded-xl ${getAvatarColor(driver.name)} flex items-center justify-center font-black text-white text-lg shadow-lg shadow-black/10`}>
                                    {driver.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">{driver.name}</h3>
                                    <p className="text-[10px] text-zinc-500">{driver.email}</p>
                                    {driver.isVerified && (
                                        <span className="text-[9px] text-blue-500 font-bold flex items-center gap-0.5">
                                            <CheckCircle2 size={9} /> Verifie
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-3 mb-4 text-[11px] text-zinc-700 dark:text-zinc-300">
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-1.5 font-bold">
                                        {driver.vehicleType === 'MOTORCYCLE' && <Bike size={14} className="text-orange-500" />}
                                        {driver.vehicleType === 'CAR' && <Car size={14} className="text-blue-500" />}
                                        {driver.vehicleType === 'BICYCLE' && <Footprints size={14} className="text-green-500" />}
                                        {driver.vehicleType}
                                    </span>
                                    <span className="font-black uppercase tracking-wider">{driver.vehiclePlate || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                <a
                                    href={`tel:${driver.phone}`}
                                    className="flex items-center gap-2 text-[11px] font-bold text-zinc-600 hover:text-orange-600 transition-colors"
                                >
                                    <div className="p-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-md text-zinc-500">
                                        <Phone size={12} />
                                    </div>
                                    {driver.phone}
                                </a>

                                <button
                                    onClick={() => handleEditClick(driver)} // Ouvri drawer lè yo klike
                                    className="px-3 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-[11px] font-bold rounded-lg"
                                >
                                    Profile
                                </button>
                            </div>
                        </motion.div>
                    ))}

                    {isDrawerOpen && (
                        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
                            <motion.div
                                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                                className="w-full max-w-md bg-white dark:bg-zinc-950 h-full shadow-2xl"
                            >
                                <DriverForm
                                    onClose={() => setIsDrawerOpen(false)}
                                    driverToEdit={driverToEdit}
                                />
                            </motion.div>
                        </div>
                    )}
                
            </AnimatePresence>
        </motion.div>
        </div >
    );
}