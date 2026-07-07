import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useAdmin } from '../../Contexts/AdminContext'; 
import { Notification } from '../../notification/Notification';
import WhiteLoader from '../../loader/WhiteLoader';

const AdminValidation = () => {
    // 2. Rale tout leta ak fonksyon yo dirèkteman nan Context la
    const { requests, loading, fetchPendingRequests, approveSeller, rejectSeller } = useAdmin();
    
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ message: string, type: 'error' | 'success' } | null>(null);
    
    // 🚨 CHANJMAN: selectedDocs kounye a se yon tablo string[], epi nou gen yon index pou konnen kilès n ap gade
    const [selectedDocs, setSelectedDocs] = useState<string[] | null>(null);
    const [currentDocIndex, setCurrentDocIndex] = useState<number>(0);

    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState('');

    // 3. Chaje demand yo nan API a lè paj la monte
    useEffect(() => {
        const loadData = async () => {
            try {
                await fetchPendingRequests();
            } catch (error) {
                setNotification({ message: "Nou pa ka chaje demand yo depi nan sèvè a.", type: "error" });
            }
        };
        loadData();
    }, []);

    // 4. Apwouve demand la nan API a via Context
    const handleApprove = async (id: string) => {
        setActionLoading(id);
        try {
            await approveSeller(id);
            setNotification({ message: "Machann nan apwouve avèk siksè!", type: "success" });
        } catch (error) {
            setNotification({ message: "Erè pandan apwobasyon an.", type: "error" });
        } finally {
            setActionLoading(null);
        }
    };

    // 5. Refize demand la ak yon rezon nan API a via Context
    const handleRejectSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rejectingId || !rejectReason.trim()) return;

        const idToReject = rejectingId;
        setActionLoading(idToReject);
        setRejectingId(null); // Fèmen modal la rapid

        try {
            await rejectSeller(idToReject, rejectReason);
            setNotification({ message: "Demand lan refize.", type: "success" });
            setRejectReason('');
        } catch (error) {
            setNotification({ message: "Erè lè n ap refize demand lan.", type: "error" });
        } finally {
            setActionLoading(null);
        }
    };

    // 🚨 NAVIGASYON KAROUSEL
    const handleNextDoc = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!selectedDocs) return;
        setCurrentDocIndex((prev) => (prev + 1) % selectedDocs.length);
    };

    const handlePrevDoc = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!selectedDocs) return;
        setCurrentDocIndex((prev) => (prev - 1 + selectedDocs.length) % selectedDocs.length);
    };

    const handleOpenCarousel = (docs: any) => {
        if (!docs) return;
        // Si se yon string senp (pa egzanp yon sèl URL), nou mete l nan yon tablo
        const docsArray = Array.isArray(docs) ? docs : [docs];
        setSelectedDocs(docsArray);
        setCurrentDocIndex(0);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0c0c0e] p-4 sm:p-6 md:p-12 transition-colors duration-200">
            <AnimatePresence>
                {notification && (
                    <Notification
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotification(null)}
                    />
                )}
            </AnimatePresence>

            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Verifikasyon Machann</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Apwouve oswa refize demand itilizatè ki vle vann sou platfòm lan.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="bg-white dark:bg-[#16161a] rounded-xl p-12 text-center border border-gray-100 dark:border-[#24242b] shadow-sm">
                        <p className="text-gray-400 dark:text-gray-500 font-medium text-lg">Pa gen okenn demand ki annatant pou kounye a. 🎉</p>
                    </div>
                ) : (
                    <>
                        {/* 📱 1. DISPLAY CARDS POU MOBIL */}
                        <div className="grid grid-cols-1 gap-4 md:hidden">
                            {requests.map((req) => (
                                <div key={req.id} className="bg-white dark:bg-[#16161a] p-5 rounded-xl border border-gray-200 dark:border-[#24242b] shadow-sm flex flex-col gap-4">
                                    <div>
                                        <div className="font-bold text-base text-gray-900 dark:text-gray-100">{req.username}</div>
                                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{req.user?.email}</div>
                                        {req.bio && <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-2 line-clamp-2">{req.bio}</p>}
                                    </div>

                                    <hr className="border-gray-100 dark:border-[#24242b]" />

                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <span className="block text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider text-[10px]">Kontak</span>
                                            <div className="text-gray-700 dark:text-gray-300 font-medium mt-0.5">{req.phone}</div>
                                        </div>
                                        <div>
                                            <span className="block text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider text-[10px]">GPS</span>
                                            <div className="text-gray-600 dark:text-gray-400 font-mono mt-0.5">
                                                {req.lat ? req.lat.toFixed(4) : '0.0000'}, {req.lng ? req.lng.toFixed(4) : '0.0000'}
                                            </div>
                                        </div>
                                        <div className="col-span-2 mt-1">
                                            <span className="block text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider text-[10px]">Adrès</span>
                                            <div className="text-gray-500 dark:text-gray-400 truncate">{req.location}</div>
                                        </div>
                                    </div>

                                    <div className="mt-2">
                                        <button
                                            onClick={() => handleOpenCarousel(req.documentUrl)}
                                            className="w-full text-center text-xs bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 font-bold px-3 py-2.5 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-950/40 transition-all border border-orange-200/50 dark:border-orange-900/30"
                                        >
                                            👁️ Gade Dokiman ({Array.isArray(req.documentUrl) ? req.documentUrl.length : 1})
                                        </button>
                                    </div>

                                    <div className="flex gap-2 mt-1">
                                        <button
                                            onClick={() => handleApprove(req.id)}
                                            disabled={actionLoading !== null}
                                            className="flex-1 bg-green-600 text-white font-bold text-xs py-2.5 rounded-lg hover:bg-green-700 transition-all disabled:opacity-40 flex items-center justify-center min-h-[36px]"
                                        >
                                            {actionLoading === req.id ? <WhiteLoader size={14} /> : 'Apwouve'}
                                        </button>
                                        <button
                                            onClick={() => setRejectingId(req.id)}
                                            disabled={actionLoading !== null}
                                            className="flex-1 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/30 font-bold text-xs py-2.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-950/40 transition-all disabled:opacity-40"
                                        >
                                            Refize
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 💻 2. DISPLAY TABLE POU DESKTOP */}
                        <div className="hidden md:block bg-white dark:bg-[#16161a] rounded-xl border border-gray-200 dark:border-[#24242b] shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-[#0c0c0e]/60 border-b border-gray-200 dark:border-[#24242b] text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                            <th className="p-4">Boutik / Itilizatè</th>
                                            <th className="p-4">Kontak & Adrès</th>
                                            <th className="p-4">Dokiman</th>
                                            <th className="p-4">GPS (Lat, Lng)</th>
                                            <th className="p-4 text-right">Aksyon</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-[#24242b] text-sm">
                                        {requests.map((req) => (
                                            <tr key={req.id} className="hover:bg-gray-50/70 dark:hover:bg-[#0c0c0e]/40 transition-colors">
                                                <td className="p-4">
                                                    <div className="font-bold text-gray-900 dark:text-gray-100">{req.username}</div>
                                                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{req.user?.email}</div>
                                                    {req.bio && <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-1 max-w-[200px] truncate">{req.bio}</p>}
                                                </td>
                                                <td className="p-4">
                                                    <div className="text-gray-700 dark:text-gray-300 font-medium">{req.phone}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">{req.location}</div>
                                                </td>
                                                <td className="p-4">
                                                    <button
                                                        onClick={() => handleOpenCarousel(req.documentUrl)}
                                                        className="text-xs bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 font-bold px-3 py-1.5 rounded hover:bg-orange-100 dark:hover:bg-orange-950/40 transition-all border border-orange-200/50 dark:border-orange-900/30"
                                                    >
                                                        Gade Pyès yo ({Array.isArray(req.documentUrl) ? req.documentUrl.length : 1})
                                                    </button>
                                                </td>
                                                <td className="p-4 font-mono text-xs text-gray-600 dark:text-gray-400">
                                                    <div>{req.lat}</div>
                                                    <div>{req.lng}</div>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleApprove(req.id)}
                                                            disabled={actionLoading !== null}
                                                            className="bg-green-600 text-white font-bold text-xs px-3 py-2 rounded-lg hover:bg-green-700 transition-all disabled:opacity-40 min-w-[75px] flex items-center justify-center"
                                                        >
                                                            {actionLoading === req.id ? <WhiteLoader size={14} /> : 'Apwouve'}
                                                        </button>
                                                        <button
                                                            onClick={() => setRejectingId(req.id)}
                                                            disabled={actionLoading !== null}
                                                            className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/30 font-bold text-xs px-3 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-950/40 transition-all disabled:opacity-40"
                                                        >
                                                            Refize
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* ================= 🚨 MODAL AJOU AK KAROUSEL DOKIMAN ================= */}
            <AnimatePresence>
                {selectedDocs && selectedDocs.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedDocs(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 15 }}
                            className="bg-white dark:bg-[#16161a] rounded-xl p-4 max-w-3xl w-full max-h-[90vh] md:max-h-[85vh] flex flex-col gap-4 shadow-2xl border border-gray-100 dark:border-[#24242b]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header Modal la */}
                            <div className="flex justify-between items-center border-b border-gray-100 dark:border-[#24242b] pb-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-gray-100">Verifikasyon Dokiman</h3>
                                    <span className="text-xs bg-gray-100 dark:bg-[#24242b] text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full font-semibold">
                                        {currentDocIndex + 1} / {selectedDocs.length}
                                    </span>
                                </div>
                                <button onClick={() => setSelectedDocs(null)} className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 text-xs sm:text-sm font-bold">Fèmen [X]</button>
                            </div>

                            {/* Zòn Karousèl la */}
                            <div className="relative flex-1 overflow-y-auto bg-gray-100 dark:bg-[#0c0c0e] rounded-lg flex items-center justify-center min-h-[320px] md:min-h-[420px] group">
                                
                                {/* 🔀 Ti flèch a goch la (Montre sèlman si gen plis pase 1 dokiman) */}
                                {selectedDocs.length > 1 && (
                                    <button 
                                        onClick={handlePrevDoc}
                                        className="absolute left-3 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all backdrop-blur-sm opacity-80 md:opacity-0 md:group-hover:opacity-100"
                                    >
                                        ◀
                                    </button>
                                )}

                                {/* Kontni dokiman an ak animasyon tranzisyon */}
                                <div className="w-full h-full flex items-center justify-center p-2">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentDocIndex}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="w-full flex items-center justify-center"
                                        >
                                            {selectedDocs[currentDocIndex].endsWith('.pdf') ? (
                                                <iframe src={selectedDocs[currentDocIndex]} className="w-full h-[450px] md:h-[500px] rounded-lg border-0" title="Dokiman Machann" />
                                            ) : (
                                                <img src={selectedDocs[currentDocIndex]} alt={`Dokiman Idantite ${currentDocIndex + 1}`} className="max-w-full max-h-[450px] md:max-h-[500px] object-contain rounded-lg shadow-sm" />
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                {/* 🔀 Ti flèch a dwat la */}
                                {selectedDocs.length > 1 && (
                                    <button 
                                        onClick={handleNextDoc}
                                        className="absolute right-3 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all backdrop-blur-sm opacity-80 md:opacity-0 md:group-hover:opacity-100"
                                    >
                                        ▶
                                    </button>
                                )}
                            </div>

                            {/* Ti pwen (Dots) anba yo pou endike pozisyon an */}
                            {selectedDocs.length > 1 && (
                                <div className="flex justify-center gap-1.5 -mt-1">
                                    {selectedDocs.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentDocIndex(idx)}
                                            className={`h-2 rounded-full transition-all duration-200 ${idx === currentDocIndex ? 'w-6 bg-orange-500' : 'w-2 bg-gray-300 dark:bg-gray-700'}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ================= MODAL POU REFIZE AK REZON ================= */}
            <AnimatePresence>
                {rejectingId && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div 
                            initial={{ y: 30, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 30, scale: 0.95 }}
                            className="bg-white dark:bg-[#16161a] rounded-xl p-5 sm:p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 border border-gray-100 dark:border-[#24242b]"
                        >
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">Poukisa w ap refize demand sa a?</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 -mt-2">Itilizatè a ap resevwa rezon an pou l ka korije sa ki nesesè.</p>
                            
                            <form onSubmit={handleRejectSubmit} className="flex flex-col gap-4">
                                <textarea
                                    required
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="Egzanp: Foto CIN lan pa klè ditou / Dokiman Patant lan ekspire..."
                                    rows={3}
                                    className="w-full bg-gray-50 dark:bg-[#0c0c0e] border border-gray-200 dark:border-[#24242b] rounded-lg p-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 resize-none"
                                />
                                <div className="flex justify-end gap-2 text-xs font-bold mt-1">
                                    <button 
                                        type="button" 
                                        onClick={() => { setRejectingId(null); setRejectReason(''); }}
                                        className="px-4 py-2.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                    >
                                        Anile
                                    </button>
                                    <button 
                                        type="submit"
                                        className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                                    >
                                        Voye Refi
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminValidation;