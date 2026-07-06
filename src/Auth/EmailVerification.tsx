import { motion } from 'framer-motion';
import { Mail, ArrowRight, RefreshCcw, Sparkles } from 'lucide-react';

const EmailVerification = ({ email = "itilizate@email.com" }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-100 flex items-center justify-center p-6">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-md w-full bg-white/70 backdrop-blur-xl rounded-[2.5rem]  p-10 text-center border border-gray-300"
            >
                {/* Ikon ak efè "Sparkle" */}
                <div className="relative w-24 h-24 bg-gradient-to-tr from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-orange-500/30">
                    <Mail className="text-white" size={40} strokeWidth={1.5} />
                    <motion.div 
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="absolute -top-2 -right-2 bg-white p-1 rounded-full shadow-md"
                    >
                        <Sparkles size={16} className="text-orange-500" />
                    </motion.div>
                </div>

                {/* Tit ak Tèks */}
                <h1 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Verifikasyon Imèl</h1>
                <p className="text-gray-600 mb-10 leading-relaxed">
                    Nou voye yon lyen majik nan adrès <span className="font-semibold text-orange-600 underline decoration-orange-200 underline-offset-4">ou antre a</span>. 
                    Tanpri tcheke bwat lèt ou pou aktive kont ou.
                </p>

                {/* Bouton Aksyon */}
                <div className="flex flex-col gap-4">
                    <button 
                        onClick={() => window.open('https://mail.google.com', '_blank')}
                        className="group relative w-full bg-gray-900 text-white font-bold py-5 rounded-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-gray-200"
                    >
                        Louvri bwat lèt mwen an 
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    <button className="text-gray-400 text-sm font-medium hover:text-orange-500 transition-colors flex items-center justify-center gap-2 mt-2">
                        <RefreshCcw size={14} /> Mwen pa resevwa imèl la
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default EmailVerification;