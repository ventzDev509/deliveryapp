import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Image as ImageIcon, Clock, Loader2, Trash2 } from 'lucide-react';
import { useRestaurant } from '../../../Contexts/RestaurantContext';
import { useCategory } from '../../../Contexts/CategoryContext';
import { Notification } from '../../../notification/Notification';

interface Dish {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string | File;
  isAvailable: boolean;
  salesCount: number;
  prepTime: number;
}

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDish: Dish | null;
  onChangeDish: React.Dispatch<React.SetStateAction<Dish | null>>;
  restaurantId: string;
  onSuccess?: () => void;
}

const MenuDrawer = ({
  isOpen,
  onClose,
  selectedDish,
  onChangeDish,
  restaurantId,
  onSuccess
}: MenuDrawerProps) => {
  const { createMenuItem, updateMenuItem, deleteMenuItem, loading } = useRestaurant();
  const { categories } = useCategory();
  const [notification, setNotification] = useState<{ message: string, type: 'error' | 'success' } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tout Hooks yo dwe toujou pase la chak fwa, menm si selectedDish pa ankò la
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (!selectedDish) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChangeDish({
        ...selectedDish,
        image: file,
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantId) return;

    let validCategoryId = selectedDish.category;
    const categoryExists = categories.some(cat => cat.id === validCategoryId);

    if (!categoryExists) {
      validCategoryId = categories.length > 0 ? categories[0].id : '';
    }

    if (!validCategoryId) {
      setNotification({ message: "Tanpri chwazi yon kategori valab anvan ou sove.", type: 'error' });
      return;
    }

    try {
      if (selectedDish.id) {
        await updateMenuItem(selectedDish.id, {
          name: selectedDish.name,
          price: Number(selectedDish.price),
          description: selectedDish.description,
          image: selectedDish.image,
          categoryId: validCategoryId,
          isAvailable: selectedDish.isAvailable,
          prepTime: Number(selectedDish.prepTime),
        });
        setNotification({ message: "Meni modifye ak siksè!", type: 'success' });
      } else {
        await createMenuItem(restaurantId, {
          name: selectedDish.name,
          price: Number(selectedDish.price),
          description: selectedDish.description,
          image: selectedDish.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
          categoryId: validCategoryId,
          isAvailable: selectedDish.isAvailable ?? true,
          prepTime: Number(selectedDish.prepTime) || 15,
        });
        setNotification({ message: "Meni ajoute ak siksè!", type: 'success' });
      }

      if (onSuccess) {
        onSuccess();
      }
      
      setTimeout(() => {
        onClose();
      }, 800);
      
    } catch (error: any) {
      setNotification({
        message: error.message || "Erè pandan y ap sove a, eseye ankò.",
        type: 'error'
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedDish.id) return;

    const confirmDelete = window.confirm("Èske ou sèten ou vle efase plat sa a nèt?");
    if (!confirmDelete) return;

    try {
      await deleteMenuItem(selectedDish.id);
      setNotification({ message: "Meni efase ak siksè!", type: 'success' });
      
      if (onSuccess) {
        onSuccess();
      }
      
      setTimeout(() => {
        onClose();
      }, 800);
      
    } catch (error: any) {
      setNotification({
        message: error.message || "Erè pandan y ap efase a, eseye ankò.",
        type: 'error'
      });
    }
  };

  const previewImage = selectedDish.image instanceof File
    ? URL.createObjectURL(selectedDish.image)
    : (selectedDish.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c");

  return (
    <>
      {notification && (
        <Notification
          key="login-notification"
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50"
            />

            <motion.div
              initial={{ x: window.innerWidth < 768 ? 0 : "100%", y: window.innerWidth < 768 ? "100%" : 0 }}
              animate={{ x: 0, y: 0 }}
              exit={{ x: window.innerWidth < 768 ? 0 : "100%", y: window.innerWidth < 768 ? "100%" : 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 240 }}
              className="fixed right-0 bottom-0 w-full md:w-[420px] h-[85vh] md:h-screen bg-white dark:bg-[#16161a] shadow-2xl z-50 flex flex-col justify-between rounded-t-3xl md:rounded-t-none md:rounded-l-3xl border-l border-gray-100 dark:border-[#24242b]"
            >
              <div className="p-6 border-b border-gray-100 dark:border-[#24242b] flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-gray-900 dark:text-gray-100">
                    {selectedDish.id ? 'Modifye Plat sa' : 'Ajoute yon Nouvo Plat'}
                  </h2>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">Modifikasyon yo ap parèt an tan reyèl.</p>
                </div>
                <button onClick={onClose} className="p-2 bg-gray-50 hover:bg-gray-100 dark:bg-[#24242b] dark:hover:bg-[#2e2e38] rounded-full text-gray-500 dark:text-gray-400 transition-colors">
                  <X size={16} />
                </button>
              </div>

              <form
                id="menu-dish-form"
                onSubmit={handleSave}
                className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-none"
              >
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Foto Manje a</label>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative h-40 w-full rounded-2xl overflow-hidden bg-gray-50 dark:bg-[#0c0c0e] border border-gray-200 dark:border-[#24242b] group cursor-pointer"
                  >
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
                      <ImageIcon size={16} />
                      <span>Chanje Foto</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Non Plat la</label>
                  <input
                    type="text"
                    required
                    value={selectedDish.name}
                    onChange={(e) => onChangeDish({ ...selectedDish, name: e.target.value })}
                    placeholder="Egz: Griot ak Bannann Peze"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0c0c0e] border border-gray-200 dark:border-[#24242b] rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:bg-white dark:focus:bg-[#16161a] focus:border-orange-500 dark:focus:border-orange-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pri ($ USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={selectedDish.price || ''}
                      onChange={(e) => onChangeDish({ ...selectedDish, price: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0c0c0e] border border-gray-200 dark:border-[#24242b] rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:bg-white dark:focus:bg-[#16161a] focus:border-orange-500 dark:focus:border-orange-500 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kategori</label>
                    <select
                      value={selectedDish.category}
                      onChange={(e) => onChangeDish({ ...selectedDish, category: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0c0c0e] border border-gray-200 dark:border-[#24242b] rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:bg-white dark:focus:bg-[#16161a] focus:border-orange-500 dark:focus:border-orange-500 transition-all appearance-none"
                    >
                      <option value="" disabled>Chwazi yon kategori</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id} className="dark:bg-[#16161a]">
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Clock size={12} className="text-orange-500" /> Tan Preparasyon (Minit)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="1"
                      max="180"
                      value={selectedDish.prepTime || ''}
                      onChange={(e) => onChangeDish({ ...selectedDish, prepTime: parseInt(e.target.value) || 0 })}
                      placeholder="Egz: 25"
                      className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-[#0c0c0e] border border-gray-200 dark:border-[#24242b] rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:bg-white dark:focus:bg-[#16161a] focus:border-orange-500 dark:focus:border-orange-500 transition-all"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase">min</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Deskripsyon</label>
                  <textarea
                    rows={4}
                    value={selectedDish.description}
                    onChange={(e) => onChangeDish({ ...selectedDish, description: e.target.value })}
                    placeholder="Mete engredyan yo..."
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0c0c0e] border border-gray-200 dark:border-[#24242b] rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:bg-white dark:focus:bg-[#16161a] focus:border-orange-500 dark:focus:border-orange-500 transition-all resize-none leading-relaxed"
                  />
                </div>
              </form>

              <div className="p-6 border-t border-gray-100 dark:border-[#24242b] bg-gray-50/50 dark:bg-[#16161a]/50 flex items-center gap-3">
                {selectedDish.id && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={loading}
                    title="Efase Plat la"
                    className="p-3 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-xl transition-all active:scale-95 flex items-center justify-center"
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
                  form="menu-dish-form"
                  disabled={loading}
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-orange-500/10 active:scale-95"
                >
                  {loading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Save size={14} />
                  )}
                  <span>Sove Chanjman</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MenuDrawer;