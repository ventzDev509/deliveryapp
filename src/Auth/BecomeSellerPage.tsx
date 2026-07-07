import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Notification } from '../notification/Notification';
import WhiteLoader from '../loader/WhiteLoader';
import imgAuth from "../assets/best-seller.png"; 
import { useAuth } from '../Contexts/AuthContext'; 
import type { BecomeSellerPayload } from '../types/auth.types';

interface BecomeSellerProps {
    onSuccessClose?: () => void;
}

const BecomeSeller = ({ onSuccessClose }: BecomeSellerProps) => {
    const { becomeSeller } = useAuth(); 
    
    const [loading, setLoading] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [notification, setNotification] = useState<{ message: string, type: 'error' | 'success' } | null>(null);
    
    // 1. Kreye yon eta separe pou n kenbe lis fichye yo chwazi yo
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const [formData, setFormData] = useState({
        username: '',
        bio: '',
        location: '',
        lat: '',
        lng: '',
        phone: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 2. Ranmase tout fichye yo chwazi yo epi mete yo nan array a
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles(filesArray);
            setNotification({ message: `${filesArray.length} dokiman pare pou soumèt!`, type: 'success' });
        } else {
            setSelectedFiles([]);
        }
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            setNotification({
                message: 'Navigatè w la pa sipòte Geolocation. Rantre kowòdone yo alamen.',
                type: 'error'
            });
            return;
        }

        setLoadingLocation(true);
        setNotification(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData((prev) => ({
                    ...prev,
                    lat: position.coords.latitude.toFixed(6),
                    lng: position.coords.longitude.toFixed(6),
                }));
                setLoadingLocation(false);
            },
            (error) => {
                console.error(error);
                setNotification({
                    message: 'Nou pa ka jwenn aksè ak lokasyon w. Verifye pèmisyon yo.',
                    type: 'error'
                });
                loadingLocation && setLoadingLocation(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setNotification(null);

        // 3. Validasyon: tcheke si tout chan yo akompli epi si gen fichye
        if (!formData.username || !formData.location || !formData.phone || !formData.lat || !formData.lng || selectedFiles.length === 0) {
            setNotification({ message: 'Tanpri ranpli tout chan yo epi ajoute omwen yon dokiman.', type: 'error' });
            setLoading(false);
            return;
        }

        // 4. Prepare nouvo payload la ak tablo fichye yo
        const payload: BecomeSellerPayload = {
            username: formData.username,
            bio: formData.bio || undefined,
            location: formData.location,
            lat: parseFloat(formData.lat),
            lng: parseFloat(formData.lng),
            phone: formData.phone,
            documents: selectedFiles,
        };

        try {
            await becomeSeller(payload);

            setNotification({ message: 'Demann ou an voye avèk siksè! Admin pral verifye l talè.', type: 'success' });
            setFormData({ username: '', bio: '', location: '', lat: '', lng: '', phone: '' });
            setSelectedFiles([]);
            
            if (onSuccessClose) {
                setTimeout(onSuccessClose, 2500);
            }
        } catch (error: any) {
            const errMsg = Array.isArray(error.message) ? error.message[0] : error.message;
            setNotification({
                message: errMsg || 'Sèvè a pa ka trete demand lan.',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center p-6 transition-colors duration-300"
        >
            <AnimatePresence>
                {notification && (
                    <Notification
                        key="seller-notification"
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotification(null)}
                    />
                )}
            </AnimatePresence>

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="hidden md:flex justify-center relative group">
                    <div className="absolute inset-0 bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <img src={imgAuth} alt="Become Seller" className="w-80 h-80 object-contain relative z-10" />
                </div>
                
                <div className="flex justify-center w-36 h-36 m-auto p-4 bg-orange-400 dark:bg-orange-500/90 rounded-full md:hidden mb-2 shadow-lg shadow-orange-500/20">
                    <img src={imgAuth} alt="Logo" className="object-contain" />
                </div>

                <div className="w-full max-w-[450px] mx-auto md:mx-0 flex flex-col gap-6">
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-zinc-50 tracking-tight mb-2">
                            Devni Machann.
                        </h1>
                        <p className="text-gray-500 dark:text-zinc-400 font-medium">
                            Voye enfòmasyon ak pyès ou pou admin ka valide biznis ou.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            type="text"
                            name="username"
                            placeholder="Non Boutik / Restoran"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-4 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all dark:bg-zinc-900 dark:border-zinc-800/80 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-orange-500 dark:focus:ring-orange-500"
                        />

                        <textarea
                            name="bio"
                            placeholder="Deskripsyon kout sou sa w vann"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={2}
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-4 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all resize-none dark:bg-zinc-900 dark:border-zinc-800/80 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-orange-500 dark:focus:ring-orange-500"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="phone"
                                placeholder="Nimewo Telefòn"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-4 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all dark:bg-zinc-900 dark:border-zinc-800/80 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-orange-500 dark:focus:ring-orange-500"
                            />
                            <input
                                type="text"
                                name="location"
                                placeholder="Adrès Fizik (Boutik)"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-4 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all dark:bg-zinc-900 dark:border-zinc-800/80 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-orange-500 dark:focus:ring-orange-500"
                            />
                        </div>

                        {/* Blòk Seleksyon Dokiman */}
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex flex-col gap-2 dark:bg-zinc-900/50 dark:border-zinc-800/80">
                            <label className="text-xs font-bold text-gray-700 dark:text-zinc-400 block uppercase tracking-wide">
                                Pyès Idantite oswa Dokiman Biznis (Ou ka chwazi plizyè)
                            </label>
                            
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                multiple // 👈 Pèmèt itilizatè a chwazi plizyè fichye ansanm
                                onChange={handleFileChange}
                                disabled={loading}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 dark:file:bg-zinc-800 dark:file:text-zinc-200 dark:hover:file:bg-zinc-700/80 cursor-pointer disabled:opacity-50"
                            />

                            <p className="text-[11px] text-gray-400 dark:text-zinc-500 leading-normal mt-1">
                                <span className="font-semibold text-gray-500 dark:text-zinc-400">Kisa ki akseptab:</span> Foto klè oswa PDF ki gen swa Patant, NIF konpayi, Kat Idantite Nasyonal (CIN), oswa Pasapò.
                            </p>

                            {selectedFiles.length > 0 && (
                                <div className="mt-2 text-xs text-green-600 dark:text-green-400 font-medium flex flex-col gap-1">
                                    <p>✓ {selectedFiles.length} fichye pare pou telechaje sou Firebase.</p>
                                    <ul className="list-disc pl-4 text-gray-500 dark:text-zinc-400 text-[11px]">
                                        {selectedFiles.map((f, i) => (
                                            <li key={i} className="truncate max-w-[350px]">{f.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Blòk Jeolokalizasyon */}
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex flex-col gap-3 dark:bg-zinc-900/50 dark:border-zinc-800/80">
                            <div className="flex justify-between items-center">
                                <div className="text-xs font-bold text-gray-600 dark:text-zinc-400 uppercase tracking-wide">Kowòdone GPS Boutik</div>
                                <button
                                    type="button"
                                    onClick={handleGetLocation}
                                    disabled={loadingLocation}
                                    className="text-xs bg-orange-400 dark:bg-orange-500 text-white font-bold py-1.5 px-3 rounded-lg hover:bg-orange-500 dark:hover:bg-orange-600 transition-all disabled:opacity-50 shadow-sm shadow-orange-500/10"
                                >
                                    {loadingLocation ? 'Ap chache...' : '🎯 Pran Lokasyon m'}
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    name="lat"
                                    placeholder="Latitid"
                                    value={formData.lat}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white border border-gray-200 text-gray-900 p-3 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-orange-500"
                                />
                                <input
                                    type="text"
                                    name="lng"
                                    placeholder="Lonjitid"
                                    value={formData.lng}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white border border-gray-200 text-gray-900 p-3 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-orange-500"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || selectedFiles.length === 0}
                            className="w-full bg-orange-400 dark:bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-500 dark:hover:bg-orange-600 transition-all shadow-md shadow-orange-500/10 dark:shadow-orange-500/20 disabled:opacity-70 flex items-center justify-center mt-2"
                        >
                            {loading ? <WhiteLoader size={24} /> : 'Voye Demand Verifikasyon'}
                        </button>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

export default BecomeSeller;