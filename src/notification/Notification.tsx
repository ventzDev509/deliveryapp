import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

interface NotificationProps {
    message: string;
    type: 'error' | 'success';
    onClose: () => void;
    duration?: number;
}

export const Notification = ({ message, type, onClose, duration = 5000 }: NotificationProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            className={`fixed top-6 -6 w-80 overflow-hidden rounded-2xl border backdrop-blur-xl shadow-2xl z-[100] ${
                type === 'error' 
                    ? 'bg-red-500/90 border-orange-400/50' 
                    : 'bg-emerald-600/90 border-emerald-500/50'
            }`}
        >
            {/* Kontni */}
            <div className="flex items-center gap-3 p-4 text-white">
                <div className="shrink-0">
                    {type === 'error' ? <AlertCircle size={24} /> : <CheckCircle2 size={24} />}
                </div>
                
                <p className="flex-1 text-sm font-medium leading-tight">
                    {message}
                </p>

                <button 
                    onClick={onClose} 
                    className="shrink-0 rounded-full p-1 transition-colors hover:bg-white/20"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Ba pwogrè (Progress Bar) */}
            <motion.div 
                className={`h-1 ${type === 'error' ? 'bg-white' : 'bg-emerald-200'}`}
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: duration / 1000, ease: "linear" }}
            />
        </motion.div>
    );
};