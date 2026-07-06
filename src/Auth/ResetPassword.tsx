import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle2 } from 'lucide-react';
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
        if (!token) return;
        
        setStatus('loading');
        try {
            await resetPassword(token, password);
            setStatus('success');
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center"
            >
                {status === 'success' ? (
                    <div>
                        <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Modpas chanje!</h2>
                        <p className="text-gray-500 mb-8">Modpas ou byen modifye. Ou ka konekte kounye a.</p>
                        <Link to="/auth" className="block w-full bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600">
                            Konekte
                        </Link>
                    </div>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Nouvo modpas</h1>
                        <p className="text-gray-500 mb-8">Antre nouvo modpas ou anba a.</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center"
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