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
    const navigate = useNavigate();

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
                navigate("/verify-email");
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
        /* Veso Prensipal la - Tranzisyon dous ak BG Premium zinc-950 */
        <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center p-6 transition-colors duration-300">
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
                {/* Imaj bò gòch ak efè refleksyon (Glow) pou Dark Mode */}
                <div className="hidden md:flex justify-center relative group">
                    <div className="absolute inset-0 bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <motion.img
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        src={imgAuth}
                        alt="Logo"
                        className="w-80 h-80 object-contain relative z-10"
                    />
                </div>

                {/* Imaj pou telefòn */}
                <div className="flex justify-center w-36 h-36 m-auto p-4 bg-orange-400 dark:bg-orange-500/90 rounded-full md:hidden mb-2 shadow-lg shadow-orange-500/20">
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
                        {/* Tit Premium */}
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-zinc-50 tracking-tight mb-2">
                            Kreye kont ou.
                        </h1>
                        <p className="text-gray-500 dark:text-zinc-400 font-medium">
                            Antre enfòmasyon w pou kòmanse
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input 
                            type="text" 
                            name="name" 
                            placeholder="Non konplè" 
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-4 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all dark:bg-zinc-900 dark:border-zinc-800/80 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-orange-500 dark:focus:ring-orange-500" 
                        />
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Adrès imel" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-4 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all dark:bg-zinc-900 dark:border-zinc-800/80 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-orange-500 dark:focus:ring-orange-500" 
                        />
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="Modpas" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-4 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all dark:bg-zinc-900 dark:border-zinc-800/80 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-orange-500 dark:focus:ring-orange-500" 
                        />

                        {/* Bouton Enskri */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-400 dark:bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-500 dark:hover:bg-orange-600 transition-all shadow-md shadow-orange-500/10 dark:shadow-orange-500/20 disabled:opacity-70 flex items-center justify-center"
                        >
                            {loading ? <WhiteLoader size={24} /> : 'Enskri'}
                        </button>
                    </form>

                    {/* Divizè OSWA (Si ou genyen l menm jan ak Login) */}
                    <div className="flex items-center gap-4">
                        <div className="h-px bg-gray-200 dark:bg-zinc-800/60 flex-1"></div>
                        <span className="text-gray-400 dark:text-zinc-500 text-xs font-bold tracking-wider">OSWA</span>
                        <div className="h-px bg-gray-200 dark:bg-zinc-800/60 flex-1"></div>
                    </div>

                    {/* Bouton Google */}
                    <button 
                        onClick={loginWithGoogle} 
                        className="w-full bg-white border border-gray-200 text-gray-700 py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all dark:bg-zinc-900 dark:border-zinc-800/80 dark:text-zinc-200 dark:hover:bg-zinc-800/60 dark:hover:border-zinc-700"
                    >
                        <FcGoogle size={20} /> Kontinye ak Google
                    </button>

                    {/* Lyen retounen nan Login */}
                    <p className="text-center md:text-left text-gray-500 dark:text-zinc-400 text-sm">
                        Èske w deja gen yon kont?
                        <button onClick={onToggle} className="text-orange-400 dark:text-orange-400 font-bold hover:underline ml-1">
                            Konekte
                        </button>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Register;