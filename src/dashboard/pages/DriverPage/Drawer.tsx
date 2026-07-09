import { motion, AnimatePresence } from 'framer-motion';
export const Drawer = ({ isOpen, onClose, children }: { isOpen: boolean, onClose: () => void, children: React.ReactNode }) => (
    <AnimatePresence>
        {isOpen && (
            <>
                {/* Backdrop */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={onClose} className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" />
                {/* Sidebar */}
                <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                    className="fixed right-0 top-0 h-full w-[400px] bg-white z-50 shadow-2xl">
                    {children}
                </motion.div>
            </>
        )}
    </AnimatePresence>
);