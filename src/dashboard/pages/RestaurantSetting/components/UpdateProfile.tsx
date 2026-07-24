import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from '../../../../Contexts/AuthContext';
import { useProfile } from '../../../../Contexts/ProfileContext';
import WhiteLoader from '../../../../loader/WhiteLoader';
import { Notification } from '../../../../notification/Notification';

export default function UpdateProfile() {
    const { profile, fetchProfile, updateProfile, loading } = useProfile();
    const { user } = useAuth();
    const [isUpdate, setIsUpdate] = useState(false)
    const [notification, setNotification] = useState<{ message: string, type: 'error' | 'success' } | null>(null);

    const [formData, setFormData] = useState({
        username: '',
        phone: '',
        bio: '',
    });

    useEffect(() => {
        const userId = user?.id;
        if (userId) {
            fetchProfile(userId);
        }
    }, [user]);

    useEffect(() => {
        if (profile) {
            setFormData({
                username: profile.username || '',
                phone: profile.phone || '',
                bio: profile.bio || '',
            });
        }
    }, [profile]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Fonksyon pou soumèt fòm nan (save)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = user?.id;
        if (!userId) return;


        try {
            await updateProfile(userId, formData);
            setIsUpdate(true)
            setNotification({ message: "pwofil la modifye ak sikse!", type: 'success' });
        } catch (error: any) {
            setNotification({
                message: error.message || "Imèl oswa modpas mal.",
                type: 'error'
            });
        } finally {
            setIsUpdate(false)
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
        <motion.form
            onSubmit={handleSubmit}
            key="profile-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
        >
            <AnimatePresence>
                {notification && (
                    <Notification
                        key="login-notification"
                        message={notification.message}
                        type={notification.type}
                        duration={8000}
                        onClose={() => setNotification(null)}
                    />
                )}
            </AnimatePresence>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Non Restoran an</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Non restoran an"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-gray-800 dark:text-zinc-200 focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:border-orange-500 dark:focus:border-orange-500 transition-all"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Nimewo Telefòn</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Nimewo telefòn"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-gray-800 dark:text-zinc-200 focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:border-orange-500 dark:focus:border-orange-500 transition-all"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Adrès Restoran</label>
                <input
                    type="text"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="deskripsyon"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-gray-800 dark:text-zinc-200 focus:outline-none focus:bg-white dark:focus:bg-zinc-950 focus:border-orange-500 dark:focus:border-orange-500 transition-all"
                />
            </div>

            {/* Bouton pou Anrejistre a */}
            <div className="pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
                >
                    {!loading ? 'anrejistre' : <WhiteLoader size={24} />}
                </button>
            </div>
        </motion.form>
    );
}