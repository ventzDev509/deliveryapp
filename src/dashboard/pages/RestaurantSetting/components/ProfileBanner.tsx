import { useRef, useState, useEffect } from "react";
import { Camera, ShieldCheck, Loader2, Check, X } from "lucide-react";
import { useProfile } from "../../../../Contexts/ProfileContext";
import { useAuth } from "../../../../Contexts/AuthContext";
import { AnimatePresence } from "framer-motion";
import { Notification } from "../../../../notification/Notification";

export default function ProfileBanner() {
    const { profile, fetchProfile, updateProfileImages, loading } = useProfile();
    const { user } = useAuth();
    const [notification, setNotification] = useState<{ message: string, type: 'error' | 'success' } | null>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);
    const profileInputRef = useRef<HTMLInputElement>(null);

    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [profileFile, setProfileFile] = useState<File | null>(null);

    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [profilePreview, setProfilePreview] = useState<string | null>(null);

    // 1. Chache done pwofil yo nan baz done a lè konpozan an monte
    useEffect(() => {
        const userId = user?.id || profile?.userId;
        if (userId && !profile) {
            fetchProfile(userId);
        }
    }, [user, profile, fetchProfile]);

    // 2. Sèvi ak bannerUrl ak avatarUrl ki soti nan baz done a
    useEffect(() => {
        if (profile?.bannerUrl && !bannerFile) {
            setBannerPreview(profile.bannerUrl);
        }
        if (profile?.avatarUrl && !profileFile) {
            setProfilePreview(profile.avatarUrl);
        }
    }, [profile, bannerFile, profileFile]);

    const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setBannerFile(file);
            setBannerPreview(URL.createObjectURL(file));
        }
    };

    const handleProfileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileFile(file);
            setProfilePreview(URL.createObjectURL(file));
        }
    };

    const handleCancel = () => {
        setBannerFile(null);
        setProfileFile(null);
        setBannerPreview(profile?.bannerUrl || null);
        setProfilePreview(profile?.avatarUrl || null);
        if (bannerInputRef.current) bannerInputRef.current.value = "";
        if (profileInputRef.current) profileInputRef.current.value = "";
    };

    const handleSave = async () => {
        const userId = profile?.userId || user?.id;
        if (!userId) return;
        if (!bannerFile && !profileFile) return;

        try {
            await updateProfileImages(
                userId,
                profileFile || undefined,
                bannerFile || undefined
            );
            setBannerFile(null);
            setProfileFile(null);
            fetchProfile(userId);
            setNotification({ message: "modifikasyon an fet!", type: 'success' });
        } catch (error: any) {
            setNotification({
                message: error.message || "Imèl oswa modpas mal.",
                type: 'error'
            });
        }
    };

    const hasChanges = bannerFile !== null || profileFile !== null;
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);
    return (
        <div className="relative rounded-3xl overflow-hidden border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
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
            <input
                type="file"
                ref={bannerInputRef}
                onChange={handleBannerSelect}
                accept="image/*"
                className="hidden"
            />

            <input
                type="file"
                ref={profileInputRef}
                onChange={handleProfileSelect}
                accept="image/*"
                className="hidden"
            />

            {/* Banner */}
            <div
                className="h-32 md:h-44 bg-gradient-to-r from-amber-400 to-amber-500 relative group bg-cover  bg-center transition-all"
                style={bannerPreview ? { backgroundImage: `url(${bannerPreview}) `,backgroundRepeat:"no-repeat",backgroundSize:"cover" } : {backgroundRepeat:"no-repeat",backgroundSize:"cover"}}
            >
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[0.5px]" />

                <button
                    onClick={() => bannerInputRef.current?.click()}
                    disabled={loading}
                    type="button"
                    className="absolute right-4 top-4 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white transition-all text-xs font-bold flex items-center gap-1.5 opacity-0 group-hover:opacity-100 disabled:opacity-50"
                >
                    <Camera size={14} />
                    <span className="hidden sm:inline">Chanje Banner</span>
                </button>
            </div>

            {/* Pwofil rapid anba Banner la */}
            <div className="px-6 pb-6 pt-12 md:pt-14 relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div
                    onClick={() => profileInputRef.current?.click()}
                    className="absolute -top-12 left-6 w-24 h-24 rounded-2xl border-4 border-white dark:border-zinc-900 bg-gray-100 dark:bg-zinc-800 shadow-md overflow-hidden group cursor-pointer"
                >
                    <img
                        src={profilePreview || "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=200"}
                        alt="Logo Pwofil"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                        <Camera size={18} />
                    </div>
                </div>

                <div>
                    <h2 className="text-base font-black text-gray-900 dark:text-zinc-100 flex items-center gap-1.5">
                        {profile?.username || "Non Restoran an"}
                        <ShieldCheck size={16} className="text-emerald-500 dark:text-emerald-400 fill-emerald-50 dark:fill-emerald-950/30" />
                    </h2>
                    <p className="text-xs text-gray-400 dark:text-zinc-500 font-medium">
                        {profile?.location || "Pa gen adrès fiks"}
                    </p>
                </div>

                {hasChanges && (
                    <div className="flex items-center gap-2 animate-fadeIn">
                        <button
                            onClick={handleCancel}
                            disabled={loading}
                            type="button"
                            className="px-3 py-2 bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
                        >
                            <X size={14} />
                            <span>Anile</span>
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            type="button"
                            className="px-4 py-2 bg-amber-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                <Check size={14} />
                            )}
                            <span>Sove Chanjman yo</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}