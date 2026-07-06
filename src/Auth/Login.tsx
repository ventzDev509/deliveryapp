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
            /* BG Premium: zinc-950 bay yon nwa pwofon ki trè sofistike */
            className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center p-6 transition-colors duration-300"
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

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Imaj bò gòch - ajoute yon ti efè refleksyon (glow) nan dark mode */}
                <div className="hidden md:flex justify-center relative group">
                    <div className="absolute inset-0 bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <img src={imgAuth} alt="Food Delivery" className="w-80 h-80 object-contain relative z-10" />
                </div>
                
                {/* Imaj pou telefòn */}
                <div className="flex justify-center w-36 h-36 m-auto p-4 bg-orange-400 dark:bg-orange-500/90 rounded-full md:hidden mb-2 shadow-lg shadow-orange-500/20">
                    <img src={imgAuth} alt="Logo" className="object-contain" />
                </div>

                <div className="w-full max-w-[400px] mx-auto md:mx-0 flex flex-col gap-6">
                    <div className="text-center md:text-left">
                        {/* Tit ak yon ti gradyan trè fen nan Dark Mode pou l parèt prim */}
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-zinc-50 tracking-tight mb-2">
                            Byenveni.
                        </h1>
                        <p className="text-gray-500 dark:text-zinc-400 font-medium">
                            Konekte pou w kontinye lakay ou
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Input Imèl - border trè fen ak yon background ki detache de fon an */}
                        <input
                            type="email"
                            name="email"
                            placeholder="Adrès imel"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-4 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all dark:bg-zinc-900 dark:border-zinc-800/80 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-orange-500 dark:focus:ring-orange-500"
                        />
                        {/* Input Modpas */}
                        <input
                            type="password"
                            name="password"
                            placeholder="Modpas"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-4 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all dark:bg-zinc-900 dark:border-zinc-800/80 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-orange-500 dark:focus:ring-orange-500"
                        />
                        
                        {/* Lyen Forgot Password */}
                        <div className="text-right">
                            <Link to="/forgot-password" className="text-sm text-gray-500 dark:text-zinc-400 hover:text-orange-400 dark:hover:text-orange-400 font-medium hover:underline transition-all">
                                Ou bliye modpas ou?
                            </Link>
                        </div>

                        {/* Bouton Konekte ak yon ti efè shadow nan dark mode */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-400 dark:bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-500 dark:hover:bg-orange-600 transition-all shadow-md shadow-orange-500/10 dark:shadow-orange-500/20 disabled:opacity-70 flex items-center justify-center"
                        >
                            {loading ? <WhiteLoader size={24} /> : 'Konekte'}
                        </button>
                    </form>

                    {/* Divizè OSWA */}
                    <div className="flex items-center gap-4">
                        <div className="h-px bg-gray-200 dark:bg-zinc-800/60 flex-1"></div>
                        <span className="text-gray-400 dark:text-zinc-500 text-xs font-bold tracking-wider">OSWA</span>
                        <div className="h-px bg-gray-200 dark:bg-zinc-800/60 flex-1"></div>
                    </div>

                    {/* Bouton Google - Border blan kase trè pro */}
                    <button
                        onClick={loginWithGoogle}
                        className="w-full bg-white border border-gray-200 text-gray-700 py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all dark:bg-zinc-900 dark:border-zinc-800/80 dark:text-zinc-200 dark:hover:bg-zinc-800/60 dark:hover:border-zinc-700"
                    >
                        <FcGoogle size={20} /> Kontinye ak Google
                    </button>

                    {/* Lyen Enskri */}
                    <p className="text-center md:text-left text-gray-500 dark:text-zinc-400 text-sm">
                        Ou pa gen yon kont?
                        <button onClick={onToggle} className="text-orange-400 dark:text-orange-400 font-bold hover:underline ml-1">
                            Enskri
                        </button>
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default Login;