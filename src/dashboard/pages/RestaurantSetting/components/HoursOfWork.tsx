import { useState, useEffect } from "react";
import HoursRow from "../HoursRow";
import { AnimatePresence, motion } from 'framer-motion';
import { useProfile } from "../../../../Contexts/ProfileContext";
import { Loader2, Check } from "lucide-react";
import { Notification } from "../../../../notification/Notification";

const DAYS = ["Lendi", "Madi", "Mèkredi", "Jedi", "Venredi", "Samdi", "Dimanch"];

export default function HouseOfWork() {
    const { profile, updateWorkingHours, loading } = useProfile();
    const [notification, setNotification] = useState<{ message: string, type: 'error' | 'success' } | null>(null);

    const [hoursState, setHoursState] = useState<
        Record<string, { isOpen: boolean; openTime: string; closeTime: string }>
    >({
        Lendi: { isOpen: true, openTime: "08:00 AM", closeTime: "05:00 PM" },
        Madi: { isOpen: true, openTime: "08:00 AM", closeTime: "05:00 PM" },
        Mèkredi: { isOpen: true, openTime: "08:00 AM", closeTime: "05:00 PM" },
        Jedi: { isOpen: true, openTime: "08:00 AM", closeTime: "05:00 PM" },
        Venredi: { isOpen: true, openTime: "08:00 AM", closeTime: "05:00 PM" },
        Samdi: { isOpen: true, openTime: "08:00 AM", closeTime: "05:00 PM" },
        Dimanch: { isOpen: false, openTime: "08:00 AM", closeTime: "05:00 PM" },
    });

    // Lè pwofil la chaje, mete eta a jou yon sèl fwa
    useEffect(() => {
        if (profile?.workingHours && profile.workingHours.length > 0) {
            const newHours: Record<string, { isOpen: boolean; openTime: string; closeTime: string }> = {};
            profile.workingHours.forEach((h: any) => {
                newHours[h.day] = {
                    isOpen: h.isOpen,
                    openTime: h.openTime || "08:00 AM",
                    closeTime: h.closeTime || "05:00 PM",
                };
            });
            setHoursState((prev) => ({ ...prev, ...newHours }));
        }
    }, [profile]);

    const handleDayChange = (day: string, data: { isOpen: boolean; openTime: string; closeTime: string }) => {
        setHoursState((prev) => ({
            ...prev,
            [day]: data,
        }));
    };

    const handleSave = async () => {
        const formattedData = DAYS.map((day) => ({
            day,
            isOpen: hoursState[day]?.isOpen ?? false,
            openTime: hoursState[day]?.openTime ?? "08:00 AM",
            closeTime: hoursState[day]?.closeTime ?? "05:00 PM",
        }));

        try {
            await updateWorkingHours(formattedData);
            setNotification({ message: "modifye ak sikse!", type: 'success' });
        } catch (error: any) {
            setNotification({
                message: error.message || "Imèl oswa modpas mal.",
                type: 'error'
            });
        }
    };
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    return (
        <motion.div
            key="hours-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4  mx-auto pb-6"
        >
            <AnimatePresence>
                {notification && (
                    <Notification
                        key="login-notification"
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotification(null)}
                    />
                )}
            </AnimatePresence>
            {/* Header ak Bouton Sove */}
            <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-1 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-xs">
                <div>
                    <h3 className="text-sm font-bold text-gray-800 dark:text-zinc-100">Orè Operasyon yo</h3>
                    <p className="text-xs text-gray-400 dark:text-zinc-400 mt-0.5">Konfigure lè restoran an ap louvri pou chak jou nan semenn nan.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    type="button"
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                    <span>Sove Orè yo</span>
                </button>
            </div>

            {/* Lis tout jou yo ansanm */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-4 shadow-xs space-y-3">
                {DAYS.map((day) => (
                    <HoursRow
                        key={day}
                        day={day}
                        isOpen={hoursState[day]?.isOpen ?? true}
                        openTime={hoursState[day]?.openTime ?? "08:00 AM"}
                        closeTime={hoursState[day]?.closeTime ?? "05:00 PM"}
                        onChange={(data) => handleDayChange(day, data)}
                    />
                ))}
            </div>
        </motion.div>
    );
}