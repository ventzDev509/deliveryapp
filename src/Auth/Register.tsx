import { useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { motion, AnimatePresence } from 'framer-motion';
import imgAuth from "../assets/courier.png";
import { useAuth } from '../Contexts/AuthContext';
import { Notification } from '../notification/Notification';
import { useNavigate } from 'react-router-dom';
import WhiteLoader from '../loader/WhiteLoader';



interface RegisterProps {
    onToggle: () => void;
}



const Register = ({ onToggle }: RegisterProps) => {
    const { register, loginWithGoogle } = useAuth();
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState<{ message: string, type: 'error' | 'success' } | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate()
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setNotification(null);

        try {
            await register(formData);
            setNotification({ message: "Kont ou kreye avèk siksè!", type: 'success' });
            setTimeout(() => {
                navigate("/verify-email")
            }, 3000);
        } catch (error: any) {
            setNotification({
                message: error.message || "Yon erè rive, tanpri eseye ankò.",
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
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [notification]);


    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
            <AnimatePresence>
                {notification && (
                    <Notification
                        key="notification"
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotification(null)}
                    />
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            >
                {/* Imaj la */}
                <div className="hidden md:flex justify-center">
                    <motion.img
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        src={imgAuth}
                        alt="Logo"
                        className="w-80 h-80 object-contain"
                    />
                </div>
                <div className="flex justify-center w-36 h-36 m-auto p-4 bg-orange-400 rounded-full md:hidden mb-2">
                    <img
                        src={imgAuth}
                        alt="Delivery Logo"
                        className="object-contain"
                    />
                </div>

                {/* Fòm nan */}
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="w-full max-w-md mx-auto md:mx-0 flex flex-col gap-6"
                >
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Kreye kont ou.</h1>
                        <p className="text-gray-500">Antre enfòmasyon w pou kòmanse</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input type="text" name="name" placeholder="Non konplè" value={formData.name} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-4 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400" />
                        <input type="email" name="email" placeholder="Adrès imel" value={formData.email} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-4 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400" />
                        <input type="password" name="password" placeholder="Modpas" value={formData.password} onChange={handleChange} required className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-4 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400" />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-400 text-white font-bold py-4 rounded-lg hover:bg-orange-500 transition-all shadow-md disabled:opacity-70 flex items-center justify-center"
                        >
                            {loading ? <WhiteLoader size={24} /> : 'Enskri'}
                        </button>
                    </form>

                    <button onClick={loginWithGoogle} className="w-full bg-white border border-gray-200 text-gray-700 py-4 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50">
                        <FcGoogle size={20} /> Kontinye ak Google
                    </button>

                    <p className="text-center md:text-left text-gray-500 text-sm">
                        Èske w deja gen yon kont?
                        <button onClick={onToggle} className="text-orange-400 font-bold hover:underline ml-1">Konekte</button>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Register;