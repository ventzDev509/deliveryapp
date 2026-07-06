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
    const [uploadingFile, setUploadingFile] = useState(false);
    const [notification, setNotification] = useState<{ message: string, type: 'error' | 'success' } | null>(null);
    
    const [formData, setFormData] = useState({
        username: '',
        bio: '',
        location: '',
        lat: '',
        lng: '',
        phone: '',
        documentUrl: '', 
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingFile(true);
        setNotification(null);

        try {
            // 🚨 RANPLASE BLÒK SA A AK LOGIK UPLOAD PA W LA (Cloudinary, AWS S3, etc.)
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const mockUrl = `https://bous-ak-dokiman-ou.com/uploads/${file.name}`;

            setFormData((prev) => ({ ...prev, documentUrl: mockUrl }));
            setNotification({ message: 'Dokiman an telechaje avèk siksè!', type: 'success' });
        } catch (error) {
            setNotification({ message: 'Erè lè n ap telechaje dokiman an. Rele ankò.', type: 'error' });
        } finally {
            setUploadingFile(false);
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
                setLoadingLocation(false); // 🔥 Ranje: Kounye a li rele korekteman "setLoadingLocation"
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setNotification(null);

        if (!formData.username || !formData.location || !formData.phone || !formData.lat || !formData.lng || !formData.documentUrl) {
            setNotification({ message: 'Tanpri ranpli tout chan yo epi ajoute pyès idantite w.', type: 'error' });
            setLoading(false);
            return;
        }

        const payload: BecomeSellerPayload = {
            username: formData.username,
            bio: formData.bio || undefined,
            location: formData.location,
            lat: parseFloat(formData.lat),
            lng: parseFloat(formData.lng),
            phone: formData.phone,
            documentUrl: formData.documentUrl,
        };

        try {
            await becomeSeller(payload);

            setNotification({ message: 'Demann ou an voye avèk siksè! Admin pral verifye l talè.', type: 'success' });
            setFormData({ username: '', bio: '', location: '', lat: '', lng: '', phone: '', documentUrl: '' });
            
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
            className="min-h-screen bg-white flex items-center justify-center p-6"
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
                {/* Imaj bò gòch */}
                <div className="hidden md:flex justify-center">
                    <img src={imgAuth} alt="Become Seller" className="w-80 h-80 object-contain" />
                </div>
                
                {/* Imaj pou telefòn */}
                <div className="flex justify-center w-36 h-36 m-auto p-4 bg-orange-400 rounded-full md:hidden mb-2">
                    <img src={imgAuth} alt="Logo" className="object-contain" />
                </div>

                <div className="w-full max-w-[450px] mx-auto md:mx-0 flex flex-col gap-6">
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Devni Machann.</h1>
                        <p className="text-gray-500">Voye enfòmasyon ak pyès ou pou admin ka valide biznis ou.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            type="text"
                            name="username"
                            placeholder="Non Boutik / Restoran"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-4 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all"
                        />

                        <textarea
                            name="bio"
                            placeholder="Deskripsyon kout sou sa w vann"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={2}
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-4 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all resize-none"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="phone"
                                placeholder="Nimewo Telefòn"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-4 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all"
                            />
                            <input
                                type="text"
                                name="location"
                                placeholder="Adrès Fizik (Boutik)"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-4 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all"
                            />
                        </div>

                        {/* Blòk Upload Dokiman adaptè ak sijesyon yo */}
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-2">
                            <label className="text-xs font-semibold text-gray-700 block uppercase tracking-wide">
                                Pyès Idantite oswa Dokiman Biznis
                            </label>
                            
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={handleFileChange}
                                disabled={uploadingFile || loading}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer disabled:opacity-50"
                            />

                            {/* Ti Gid pou moun nan ka konnen kisa li ka voye */}
                            <p className="text-[11px] text-gray-400 leading-normal mt-1">
                                <span className="font-medium text-gray-500">Kisa ki akseptab:</span> Foto klè oswa PDF ki gen swa Patant, NIF konpayi, Kat Idantite Nasyonal (CIN / Elektoral), oswa Pasapò.
                            </p>

                            {uploadingFile && <p className="text-xs text-orange-400 animate-pulse mt-1">N ap telechaje fichiye a...</p>}
                            {formData.documentUrl && !uploadingFile && (
                                <p className="text-xs text-green-600 font-medium mt-1">✓ Fichiye pare pou soumèt</p>
                            )}
                        </div>

                        {/* Blòk Jeolokalizasyon */}
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <div className="text-xs font-semibold text-gray-600">KOWÒDONE GPS BOUTIK</div>
                                <button
                                    type="button"
                                    onClick={handleGetLocation}
                                    disabled={loadingLocation}
                                    className="text-xs bg-orange-400 text-white font-bold py-1.5 px-3 rounded-md hover:bg-orange-500 transition-all disabled:opacity-50"
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
                                    className="w-full bg-white border border-gray-200 text-gray-900 p-3 rounded-lg text-sm focus:outline-none focus:border-orange-400 transition-all"
                                />
                                <input
                                    type="text"
                                    name="lng"
                                    placeholder="Lonjitid"
                                    value={formData.lng}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white border border-gray-200 text-gray-900 p-3 rounded-lg text-sm focus:outline-none focus:border-orange-400 transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || uploadingFile}
                            className="w-full bg-orange-400 text-white font-bold py-4 rounded-lg hover:bg-orange-500 transition-all shadow-md disabled:opacity-70 flex items-center justify-center mt-2"
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