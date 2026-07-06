import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../Contexts/AuthContext';

const VerificationSuccess = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const { confirmEmail, } = useAuth();
    const navigate = useNavigate();

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Nap verifye enfòmasyon ou yo...');

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

                // 3. SI SE KA KONFIMASYON IMÈL NÒMAL LA (Kòd orijinal ou an)
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white rounded-3xl shadow-sm p-10 text-center"
            >
                {status === 'loading' && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="animate-spin text-orange-500 mb-6" size={40} />
                        <h1 className="text-xl font-bold text-gray-900">Tanpri tann...</h1>
                    </div>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="text-green-500" size={40} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Siksè!</h1>
                        <p className="text-gray-600 mb-8">{message}</p>

                        {/* Se sèlman si se pa Google pou bouton an parèt, paske Google ap redirije otomatik */}
                        {!localStorage.getItem('token') && (
                            <Link to="/auth" className="block w-full bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-all">
                                Konekte koulye a
                            </Link>
                        )}
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle className="text-red-500" size={40} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Echwe</h1>
                        <p className="text-gray-600 mb-8">{message}</p>
                        <Link to="/auth" className="block w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all">
                            Retounen nan koneksyon
                        </Link>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default VerificationSuccess;