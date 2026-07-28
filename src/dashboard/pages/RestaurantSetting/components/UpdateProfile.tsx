import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { User, Smartphone, FileText, MapPin, Power, Globe } from 'lucide-react';
import { BsInstagram } from 'react-icons/bs';
import { FaFacebook } from 'react-icons/fa';
import { useAuth } from '../../../../Contexts/AuthContext';
import { useProfile } from '../../../../Contexts/ProfileContext';
import WhiteLoader from '../../../../loader/WhiteLoader';
import { Notification } from '../../../../notification/Notification';

export default function UpdateProfile() {
    const { profile, fetchProfile, updateProfile, loading } = useProfile();
    const { user } = useAuth();
    const [_, setIsUpdate] = useState(false);
    const [notification, setNotification] = useState<{ message: string, type: 'error' | 'success' } | null>(null);

    const [formData, setFormData] = useState({
        username: '',
        phone: '',
        bio: '',
        location: '',
        storeStatus: 'CLOSED', // OPEN, BUSY, oswa CLOSED
        socialLinks: {
            instagram: '',
            facebook: '',
            tiktok: '',
            youtube: ''
        }
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
                location: profile.location || '',
                storeStatus: profile.storeStatus || 'CLOSED',
                socialLinks: {
                    instagram: (profile.socialLinks as any)?.instagram || '',
                    facebook: (profile.socialLinks as any)?.facebook || '',
                    tiktok: (profile.socialLinks as any)?.tiktok || '',
                    youtube: (profile.socialLinks as any)?.youtube || ''
                }
            });
        }
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            socialLinks: {
                ...formData.socialLinks,
                [e.target.name]: e.target.value
            }
        });
    };

    // Fonksyon pou soumèt fòm nan (save)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = user?.id;
        if (!userId) return;

        try {
            await updateProfile(userId, formData);
            setIsUpdate(true);
            setNotification({ message: "Pwofil la modifye ak siksè!", type: 'success' });
        } catch (error: any) {
            setNotification({
                message: error.message || "Erè pandan n ap sove a.",
                type: 'error'
            });
        } finally {
            setIsUpdate(false);
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
            className="space-y-6 transition-colors duration-300"
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

            {/* SEKSYON 1: ENFÒMASYON BAZIK AK ESTATI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                        <User size={12} className="text-orange-500" /> Non Restoran an
                    </label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Non restoran an"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-gray-800 dark:text-zinc-200 focus:outline-none focus:bg-white dark:focus:bg-zinc-900 focus:border-orange-500 dark:focus:border-orange-500 transition-all"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                        <Smartphone size={12} className="text-emerald-500" /> Nimewo Telefòn / WhatsApp
                    </label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Egz: +509 3700-0000"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-gray-800 dark:text-zinc-200 focus:outline-none focus:bg-white dark:focus:bg-zinc-900 focus:border-orange-500 dark:focus:border-orange-500 transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                        <FileText size={12} className="text-blue-500" /> Deskripsyon (Bio)
                    </label>
                    <input
                        type="text"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Deskripsyon kout"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-gray-800 dark:text-zinc-200 focus:outline-none focus:bg-white dark:focus:bg-zinc-900 focus:border-orange-500 dark:focus:border-orange-500 transition-all"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                        <MapPin size={12} className="text-rose-500" /> Adrès Restoran
                    </label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Lokasyon"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-gray-800 dark:text-zinc-200 focus:outline-none focus:bg-white dark:focus:bg-zinc-900 focus:border-orange-500 dark:focus:border-orange-500 transition-all"
                    />
                </div>
            </div>

            {/* Seksyon Estati Restoran an (Store Status) */}
            <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                    <Power size={12} className="text-orange-500" /> Estati Restoran an
                </label>
                <select
                    name="storeStatus"
                    value={formData.storeStatus}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-gray-800 dark:text-zinc-200 focus:outline-none focus:bg-white dark:focus:bg-zinc-900 focus:border-orange-500 dark:focus:border-orange-500 transition-all appearance-none cursor-pointer"
                >
                    <option value="OPEN">LOUVRI (OPEN)</option>
                    <option value="BUSY">OKIPE / ANBACHAJ (BUSY)</option>
                    <option value="CLOSED">FÈMEN (CLOSED)</option>
                </select>
            </div>

            {/* SEKSYON 2: REZO SOSYAL YO */}
            <div className="space-y-3 pt-2">
                <div>
                    <h3 className="text-xs font-bold text-gray-800 dark:text-zinc-200 flex items-center gap-1.5">
                        <Globe size={14} className="text-orange-500" /> Rezo Sosyal yo
                    </h3>
                    <p className="text-[11px] text-gray-400 dark:text-zinc-500">Mete non itilizatè (username) rezo sosyal restoran an.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Instagram */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                            <BsInstagram size={12} className="text-pink-500" /> Instagram Username
                        </label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 text-xs font-bold">@</span>
                            <input
                                type="text"
                                name="instagram"
                                value={formData.socialLinks.instagram}
                                onChange={handleSocialChange}
                                placeholder="username_restoran"
                                className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-gray-800 dark:text-zinc-200 focus:outline-none focus:bg-white dark:focus:bg-zinc-900 focus:border-orange-500 dark:focus:border-orange-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Facebook */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                            <FaFacebook size={12} className="text-blue-600" /> Facebook Page ID
                        </label>
                        <input
                            type="text"
                            name="facebook"
                            value={formData.socialLinks.facebook}
                            onChange={handleSocialChange}
                            placeholder="Egz: paj_restoran"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-gray-800 dark:text-zinc-200 focus:outline-none focus:bg-white dark:focus:bg-zinc-900 focus:border-orange-500 dark:focus:border-orange-500 transition-all"
                        />
                    </div>

                    {/* TikTok */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                            <Globe size={12} className="text-cyan-500" /> TikTok Username
                        </label>
                        <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 text-xs font-bold">@</span>
                            <input
                                type="text"
                                name="tiktok"
                                value={formData.socialLinks.tiktok}
                                onChange={handleSocialChange}
                                placeholder="username_tiktok"
                                className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-gray-800 dark:text-zinc-200 focus:outline-none focus:bg-white dark:focus:bg-zinc-900 focus:border-orange-500 dark:focus:border-orange-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* YouTube */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                            <Globe size={12} className="text-red-500" /> YouTube Channel
                        </label>
                        <input
                            type="text"
                            name="youtube"
                            value={formData.socialLinks.youtube}
                            onChange={handleSocialChange}
                            placeholder="YouTube channel name"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-gray-800 dark:text-zinc-200 focus:outline-none focus:bg-white dark:focus:bg-zinc-900 focus:border-orange-500 dark:focus:border-orange-500 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Bouton pou Anrejistre a */}
            <div className="pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 cursor-pointer flex items-center justify-center min-w-[100px]"
                >
                    {!loading ? 'Anrejistre' : <WhiteLoader size={20} />}
                </button>
            </div>
        </motion.form>
    );
}