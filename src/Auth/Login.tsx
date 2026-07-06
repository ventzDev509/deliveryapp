import { useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import imgAuth from "../assets/food-delivery.png";
import { useAuth } from '../Contexts/AuthContext';
import { Notification } from '../notification/Notification';
import WhiteLoader from '../loader/WhiteLoader';

interface LoginProps {
    onToggle: () => void;
}

const Login = ({ onToggle }: LoginProps) => {
    const { login, loginWithGoogle } = useAuth();
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState<{ message: string, type: 'error' | 'success' } | null>(null);
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setNotification(null);

        try {
            await login(formData);
            setNotification({ message: "Byenveni!", type: 'success' });
        } catch (error: any) {
            setNotification({
                message: error.message || "Imèl oswa modpas mal.",
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
                        key="login-notification"
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotification(null)}
                    />
                )}
            </AnimatePresence>

            <div className="w-full max-w-a4xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Imaj bò gòch */}
                <div className="hidden md:flex justify-center">
                    <img src={imgAuth} alt="Food Delivery" className="w-80 h-80 object-contain" />
                </div>
                
                {/* Imaj pou telefòn */}
                <div className="flex justify-center w-36 h-36 m-auto p-4 bg-orange-400 rounded-full md:hidden mb-2">
                    <img src={imgAuth} alt="Logo" className="object-contain" />
                </div>

                <div className="w-full max-w-[400px] mx-auto md:mx-0 flex flex-col gap-6">
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Byenveni.</h1>
                        <p className="text-gray-500">Konekte pou w kontinye lakay ou</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            type="email"
                            name="email"
                            placeholder="Adrès imel"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-4 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Modpas"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-4 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all"
                        />
                        
                        {/* Lyen Forgot Password */}
                        <div className="text-right">
                            <Link to="/forgot-password" className="text-sm text-gray-500 hover:text-orange-400 hover:underline transition-all">
                                Ou bliye modpas ou?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-400 text-white font-bold py-4 rounded-lg hover:bg-orange-500 transition-all shadow-md disabled:opacity-70 flex items-center justify-center"
                        >
                            {loading ? <WhiteLoader size={24} /> : 'Konekte'}
                        </button>
                    </form>

                    <div className="flex items-center gap-4">
                        <div className="h-px bg-gray-200 flex-1"></div>
                        <span className="text-gray-400 text-sm">OSWA</span>
                        <div className="h-px bg-gray-200 flex-1"></div>
                    </div>

                    <button
                        onClick={loginWithGoogle}
                        className="w-full bg-white border border-gray-200 text-gray-700 py-4 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition-all"
                    >
                        <FcGoogle size={20} /> Kontinye ak Google
                    </button>

                    <p className="text-center md:text-left text-gray-500 text-sm">
                        Ou pa gen yon kont?
                        <button onClick={onToggle} className="text-orange-400 font-bold hover:underline ml-1">
                            Enskri
                        </button>
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default Login;