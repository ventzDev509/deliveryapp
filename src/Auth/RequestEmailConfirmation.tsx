import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import WhiteLoader from '../loader/WhiteLoader';

const RequestEmailConfimation = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    const { requestEmailConfirmation } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await requestEmailConfirmation(email);
            setStatus('success');
        } catch (error) {
            console.log(error);
            alert('Erè: Tanpri verifye imèl la.');
            setStatus('idle');
        }
    };

    return (
        /* Veso prensipal la transparan pou n pwofite background body a, ak tranzisyon dous */
        <div className="min-h-screen flex items-center justify-center bg-transparent p-6 transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="max-w-md w-full bg-white dark:bg-zinc-900/40 dark:border-zinc-800/80 backdrop-blur-xl rounded-[2rem] border border-gray-100 shadow-sm p-8 md:p-10"
            >
                {status === 'success' ? (
                    <div className="text-center flex flex-col items-center">
                        {/* Siksè Icon ak bèl efè nwa/vè */}
                        <div className="w-16 h-16 bg-green-50 dark:bg-green-500/10 text-green-500 dark:text-green-400 rounded-full flex items-center justify-center mb-6 shadow-sm">
                            <CheckCircle2 size={32} />
                        </div>
                        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-zinc-50 tracking-tight mb-2">
                            Tcheke imèl ou
                        </h2>
                        <p className="text-gray-500 dark:text-zinc-400 mb-8 font-medium">
                            Nou voye yon lyen pou konfime imèl ou nan <span className="text-gray-900 dark:text-zinc-200 font-bold">{email}</span>
                        </p>
                        <Link to="/auth" className="text-orange-400 dark:text-orange-400 font-bold hover:underline transition-all">
                            Retounen nan koneksyon
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Yon gwo ikon Mail ki gen yon ti background anime oswa fiks pou kenbe estrikti a pwòp */}
                        <div className="flex justify-center mb-6 relative group">
                            <div className="absolute inset-0 bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl flex items-center justify-center text-orange-400 relative z-10 shadow-sm">
                                <Mail size={36} strokeWidth={1.5} />
                            </div>
                        </div>

                        <div>
                            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-zinc-50 mb-2 text-center tracking-tight">
                                Ou poko verifye kont ou?
                            </h1>
                            <p className="text-gray-500 dark:text-zinc-400 mb-8 text-center font-medium">
                                Pa enkyete w! Antre imèl ou epi n ap voye enstriksyon yo ba ou.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="relative">
                                    <Mail className="absolute left-4 top-4 text-gray-400 dark:text-zinc-500" size={20} />
                                    <input
                                        type="email"
                                        required
                                        placeholder="itilizatè@email.com"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all dark:bg-zinc-900 dark:border-zinc-800/80 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-orange-500 dark:focus:ring-orange-500"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full bg-orange-400 dark:bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-500 dark:hover:bg-orange-600 transition-all shadow-md shadow-orange-500/10 dark:shadow-orange-500/20 disabled:opacity-70 flex items-center justify-center"
                                >
                                    {status === 'loading' ? (
                                       <WhiteLoader size={24} />
                                    ) : (
                                        'Voye enstriksyon'
                                    )}
                                </button>
                            </form>

                            <div className="mt-8 text-center">
                                <Link to="/auth" className="text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 flex items-center justify-center gap-2 text-sm font-bold transition-colors">
                                    <ArrowLeft size={16} /> Retounen nan koneksyon
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default RequestEmailConfimation;