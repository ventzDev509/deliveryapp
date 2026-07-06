import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle2, XCircle } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import WhiteLoader from '../loader/WhiteLoader';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const { resetPassword } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            setStatus('error');
            return;
        }
        
        setStatus('loading');
        try {
            await resetPassword(token, password);
            setStatus('success');
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        /* Veso a transparan pou pwofite background body a, ak tranzisyon dous */
        <div className="min-h-screen flex items-center justify-center bg-transparent p-6 transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="max-w-md w-full bg-white dark:bg-zinc-900/40 dark:border-zinc-800/80 backdrop-blur-xl rounded-[2rem] border border-gray-100 shadow-sm p-10 text-center"
            >
                {status === 'success' ? (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-green-50 dark:bg-green-500/10 text-green-500 dark:text-green-400 rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <CheckCircle2 size={32} />
                        </div>
                        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-zinc-50 tracking-tight mb-2">
                            Modpas chanje!
                        </h2>
                        <p className="text-gray-500 dark:text-zinc-400 mb-8 font-medium">
                            Modpas ou byen modifye. Ou ka konekte kounye a.
                        </p>
                        <Link 
                            to="/auth" 
                            className="block w-full bg-orange-400 dark:bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-500 dark:hover:bg-orange-600 transition-all shadow-md shadow-orange-500/10 dark:shadow-orange-500/20"
                        >
                            Konekte
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-center mb-6 relative group">
                            <div className="absolute inset-0 bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl flex items-center justify-center text-orange-400 relative z-10 shadow-sm">
                                <Lock size={36} strokeWidth={1.5} />
                            </div>
                        </div>

                        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-zinc-50 mb-2 tracking-tight">
                            Nouvo modpas
                        </h1>
                        <p className="text-gray-500 dark:text-zinc-400 mb-8 font-medium">
                            Antre nouvo modpas ou anba a.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <Lock className="absolute left-4 top-4 text-gray-400 dark:text-zinc-500" size={20} />
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all dark:bg-zinc-900 dark:border-zinc-800/80 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-orange-500 dark:focus:ring-orange-500"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            {status === 'error' && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2 text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 p-3 rounded-xl font-medium text-left"
                                >
                                    <XCircle size={16} className="shrink-0" />
                                    <span>Lyen an ekspire oswa li pa valid. Tanpri refè demann lan.</span>
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full bg-orange-400 dark:bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-500 dark:hover:bg-orange-600 transition-all shadow-md shadow-orange-500/10 dark:shadow-orange-500/20 disabled:opacity-70 flex items-center justify-center"
                            >
                                {status === 'loading' ? <WhiteLoader size={24} /> : 'Chanje modpas'}
                            </button>
                        </form>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default ResetPassword;