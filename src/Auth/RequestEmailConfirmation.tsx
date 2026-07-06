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
            console.log(error)
            alert('Erè: Tanpri verifye imèl la.');
            setStatus('idle');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10"
            >
                {status === 'success' ? (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tcheke imèl ou</h2>
                        <p className="text-gray-500 mb-8">
                            Nou voye yon lyen pou konfime imèl ou nan {email}
                        </p>
                        <Link to="/auth" className="text-orange-500 font-semibold hover:underline">
                            Retounen nan koneksyon
                        </Link>
                    </div>
                ) : (
                    <>
                       

                        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Ou poko verifye kont ou?</h1>
                        <p className="text-gray-500 mb-8 text-center">
                            Pa enkyete w! Antre imèl ou epi n ap voye enstriksyon yo ba ou.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-4 top-4 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    required
                                    placeholder="itilizatè@email.com"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center"
                            >
                                {status === 'loading' ? (
                                   <WhiteLoader size={24} />
                                ) : (
                                    'Voye enstriksyon'
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <Link to="/auth" className="text-gray-400 hover:text-gray-600 flex items-center justify-center gap-2 text-sm">
                                <ArrowLeft size={16} /> Retounen nan koneksyon
                            </Link>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default RequestEmailConfimation;