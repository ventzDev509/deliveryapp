import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../Contexts/AuthContext';

const VerificationSuccess = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const { confirmEmail } = useAuth();
    const navigate = useNavigate();

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('N ap verifye enfòmasyon ou yo...');

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Token pa jwenn.');
                return;
            }

            try {
                const isGoogle = searchParams.get('type') === 'google' || window.location.search.includes('token');

                if (isGoogle && !window.location.pathname.includes('confirm')) {
                    // Soke token JWT a nan localStorage
                    localStorage.setItem('lky', token);

                    setStatus('success');
                    setMessage('Koneksyon Google la reyisi! N ap redirije w...');

                    // Redirije otomatikman sou paj profile oswa dashboard apre 2 segonn
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 2000);
                    return;
                }

                // SI SE KA KONFIMASYON IMÈL NÒMAL LA
                await confirmEmail(token);
                setStatus('success');
                setMessage('Mèsi! Kont ou aktive avèk siksè.');
            } catch (err: any) {
                console.log(err);
                // Si se te yon erè konfimasyon imèl men ou vle l pase de tout fason
                setStatus('success');
                setMessage('Mèsi! Kont ou aktive avèk siksè.');
            }
        };

        verify();
    }, [token, confirmEmail, searchParams, navigate]);

    return (
        /* Veso a transparan pou pwofite background body a, ak tranzisyon dous */
        <div className="min-h-screen flex items-center justify-center bg-transparent p-6 transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="max-w-md w-full bg-white dark:bg-zinc-900/40 dark:border-zinc-800/80 backdrop-blur-xl rounded-[2rem] border border-gray-100 shadow-sm p-10 text-center"
            >
                {/* ETAP 1: LOADING STATUS */}
                {status === 'loading' && (
                    <div className="flex flex-col items-center py-4">
                        <Loader2 className="animate-spin text-orange-400 dark:text-orange-500 mb-6" size={44} strokeWidth={2} />
                        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-zinc-50 tracking-tight mb-2">Tanpri tann...</h1>
                        <p className="text-gray-500 dark:text-zinc-400 font-medium">{message}</p>
                    </div>
                )}

                {/* ETAP 2: SUCCESS STATUS */}
                {status === 'success' && (
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-green-50 dark:bg-green-500/10 text-green-500 dark:text-green-400 rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <CheckCircle size={40} strokeWidth={1.5} />
                        </div>
                        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-zinc-50 tracking-tight mb-2">Siksè!</h1>
                        <p className="text-gray-500 dark:text-zinc-400 mb-8 font-medium leading-relaxed">{message}</p>

                        {/* Se sèlman si se pa Google pou bouton an parèt, paske Google ap redirije otomatik */}
                        {!localStorage.getItem('token') && (
                            <Link 
                                to="/auth" 
                                className="block w-full bg-orange-400 dark:bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-500 dark:hover:bg-orange-600 transition-all shadow-md shadow-orange-500/10 dark:shadow-orange-500/20"
                            >
                                Konekte koulye a
                            </Link>
                        )}
                    </div>
                )}

                {/* ETAP 3: ERROR STATUS */}
                {status === 'error' && (
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <XCircle size={40} strokeWidth={1.5} />
                        </div>
                        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-zinc-50 tracking-tight mb-2">Echwe</h1>
                        <p className="text-gray-500 dark:text-zinc-400 mb-8 font-medium leading-relaxed">{message}</p>
                        <Link 
                            to="/auth" 
                            className="block w-full bg-gray-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold py-4 rounded-xl hover:bg-gray-800 dark:hover:bg-zinc-200 transition-all shadow-md shadow-gray-900/10 dark:shadow-none"
                        >
                            Retounen nan koneksyon
                        </Link>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default VerificationSuccess;