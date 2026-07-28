import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Trash2, Loader2, Layers } from 'lucide-react';
import { Notification } from '../../notification/Notification';

interface Category {
    id?: string;
    name: string;
}

interface CategoryDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    selectedCategory: Category | null;
    onChangeCategory: React.Dispatch<React.SetStateAction<Category | null>>;
    onSave: (category: Category) => Promise<void>;
    onDelete?: (id: string) => Promise<void>;
    loading?: boolean;
}

const CategoryDrawer = ({
    isOpen,
    onClose,
    selectedCategory,
    onChangeCategory,
    onSave,
    onDelete,
    loading = false
}: CategoryDrawerProps) => {
    if (!selectedCategory) return null;
    const [notification, setNotification] = useState<{ message: string, type: 'error' | 'success' } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(selectedCategory);
    };

    const handleDeleteClick = async () => {
        if (selectedCategory.id && onDelete) {
            if (window.confirm("Èske w sèten ou vle efase kategori sa a?")) {
                try {
                    await onDelete(selectedCategory.id);
                    setNotification({ message: "Kategori siprime!", type: 'success' });
                } catch (error: any) {
                    setNotification({
                        message: error.message || "Imèl oswa modpas mal.",
                        type: 'error'
                    });
                }
            }
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
        <AnimatePresence>
            <AnimatePresence>
                {notification && (
                    <Notification
                        key="login-notification"
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotification(null)}
                    />
                )}
            </AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop Translucide */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50"
                    />

                    {/* Kontni Drawer (Slide-over) */}
                    <motion.div
                        initial={{ x: window.innerWidth < 768 ? 0 : "100%", y: window.innerWidth < 768 ? "100%" : 0 }}
                        animate={{ x: 0, y: 0 }}
                        exit={{ x: window.innerWidth < 768 ? 0 : "100%", y: window.innerWidth < 768 ? "100%" : 0 }}
                        transition={{ type: "spring", damping: 30, stiffness: 240 }}
                        className="fixed right-0 bottom-0 w-full md:w-[420px] h-[60vh] md:h-screen bg-white dark:bg-[#16161a] shadow-2xl z-50 flex flex-col justify-between rounded-t-3xl md:rounded-t-none md:rounded-l-3xl border-l border-gray-100 dark:border-[#24242b]"
                    >
                        {/* Tèt Drawer */}
                        <div className="p-6 border-b border-gray-100 dark:border-[#24242b] flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 rounded-xl">
                                    <Layers size={18} />
                                </div>
                                <div>
                                    <h2 className="text-base font-black text-gray-900 dark:text-gray-100">
                                        {selectedCategory.id ? 'Modifye Kategori' : 'Ajoute yon Kategori'}
                                    </h2>
                                    <p className="text-[11px] text-gray-400 dark:text-gray-500">Jere non kategori manman yo.</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 bg-gray-50 hover:bg-gray-100 dark:bg-[#24242b] dark:hover:bg-[#2e2e38] rounded-full text-gray-500 dark:text-gray-400 transition-colors">
                                <X size={16} />
                            </button>
                        </div>

                        {/* Kò Fòm nan */}
                        <form
                            id="category-form"
                            onSubmit={handleSubmit}
                            className="flex-1 overflow-y-auto p-6 space-y-5"
                        >
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Non Kategori a</label>
                                <input
                                    type="text"
                                    required
                                    value={selectedCategory.name}
                                    onChange={(e) => onChangeCategory({ ...selectedCategory, name: e.target.value })}
                                    placeholder="Egz: Griyaj ak Fritay"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0c0c0e] border border-gray-200 dark:border-[#24242b] rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:bg-white dark:focus:bg-[#16161a] focus:border-orange-500 dark:focus:border-orange-500 transition-all"
                                />
                            </div>
                        </form>

                        {/* Pye Drawer la */}
                        <div className="p-6 border-t border-gray-100 dark:border-[#24242b] bg-gray-50/50 dark:bg-[#16161a]/50 flex items-center gap-3">
                            {selectedCategory.id && onDelete && (
                                <button
                                    type="button"
                                    onClick={handleDeleteClick}
                                    disabled={loading}
                                    className="p-3 border border-red-200 dark:border-red-950/50 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center"
                                    title="Efase kategori"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="flex-1 py-3 border border-gray-200 dark:border-[#24242b] bg-white dark:bg-[#16161a] hover:bg-gray-50 dark:hover:bg-[#2e2e38] text-gray-500 dark:text-gray-400 text-xs font-bold rounded-xl transition-all active:scale-95"
                            >
                                Anile
                            </button>
                            <button
                                type="submit"
                                form="category-form"
                                disabled={loading}
                                className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-orange-500/10 active:scale-95"
                            >
                                {loading ? (
                                    <Loader2 size={14} className="animate-spin" />
                                ) : (
                                    <Save size={14} />
                                )}
                                <span>Sove</span>
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CategoryDrawer;