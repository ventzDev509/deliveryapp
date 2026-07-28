import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, ToggleLeft, ToggleRight, Utensils, Clock, Loader2 } from 'lucide-react';
import MenuDrawer from './MenuDrawer';
import { useAuth } from '../../../Contexts/AuthContext';
import { useRestaurant } from '../../../Contexts/RestaurantContext';
import { useCategory } from '../../../Contexts/CategoryContext';

interface Dish {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  salesCount: number;
  prepTime: number;
  image: string | File;
}

const springTransition = { type: "spring", stiffness: 200, damping: 25, mass: 0.8 } as const;

const MenuPage = () => {
  const { user } = useAuth();
  const { restaurant, fetchRestaurantByOwnerId, updateMenuItem, loading } = useRestaurant();
  const { categories } = useCategory();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Drawer States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  // Chache restoran an ak meni l yo lè itilizatè a konekte
  const loadRestaurantData = async () => {
    if (user?.id) {
      const data = await fetchRestaurantByOwnerId(user.id);
      if (data && data.menus) {
        const formattedDishes: Dish[] = data.menus.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description || '',
          price: item.price,
          category: item.categoryId || 'Main',
          image: item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400',
          isAvailable: item.isAvailable ?? true,
          salesCount: item.salesCount || 0,
          prepTime: item.prepTime || 20,
        }));
        setDishes(formattedDishes);
      }
    }
  };

  useEffect(() => {
    loadRestaurantData();
  }, [user]);

  const handleOpenDrawer = (dish: Dish | null = null) => {
    if (dish) {
      setSelectedDish(dish);
    } else {
      setSelectedDish({
        id: '',
        name: '',
        description: '',
        price: 0,
        category: 'Main',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
        salesCount: 0,
        prepTime: 20
      });
    }
    setIsDrawerOpen(true);
  };

  const toggleAvailability = async (id: string) => {
    const dishToUpdate = dishes.find(d => d.id === id);
    if (!dishToUpdate) return;

    try {
      const newAvailability = !dishToUpdate.isAvailable;
      await updateMenuItem(id, { isAvailable: newAvailability });
      setDishes(dishes.map(dish => dish.id === id ? { ...dish, isAvailable: newAvailability } : dish));
    } catch (error) {
      console.error("Erè pandan y ap chanje disponiblite a:", error);
    }
  };

  const filteredDishes = dishes.filter(dish => {
    const matchesCategory = activeCategory === 'All' || dish.category === activeCategory;
    return matchesCategory && (dish.name.toLowerCase().includes(searchQuery.toLowerCase()) || dish.description.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <div className="w-full max-w-full flex flex-col gap-6 text-gray-900 dark:text-zinc-100 transition-colors duration-300 overflow-x-hidden">

      {/* 1. TÈT PAJ LA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-zinc-50 tracking-tight">Meni Restoran</h1>
          <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Ajoute plat, chanje pri, epi mete manje disponib.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500" size={16} />
            <input
              type="text"
              placeholder="Chache yon manje..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none focus:border-orange-500 transition-colors shadow-sm dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:focus:border-orange-500"
            />
          </div>
          <button onClick={() => handleOpenDrawer(null)} className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-orange-500/10 active:scale-95 hover:bg-orange-600 whitespace-nowrap">
            <Plus size={16} />
            <span className="hidden xs:inline">Nouvo Plat</span>
          </button>
        </div>
      </div>

      {/* 2. FILTRE KATEGORI */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-gray-100 dark:border-zinc-800/60 w-full max-w-full">
        {/* Bouton Tout */}
        <button
          onClick={() => setActiveCategory('All')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border whitespace-nowrap flex-shrink-0 ${
            activeCategory === 'All'
              ? 'bg-gray-950 text-white border-gray-950 shadow-lg shadow-gray-950/10 dark:bg-zinc-100 dark:text-zinc-950 dark:border-zinc-100'
              : 'bg-white text-gray-500 border-gray-100 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800'
          }`}
        >
          <Utensils size={14} className={activeCategory === 'All' ? "text-orange-500" : "text-gray-400 dark:text-zinc-500"} />
          Tout
        </button>

        {/* Kategori ki soti nan Baz Done / Kontèks la */}
        {categories.map((cat) => {
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border whitespace-nowrap flex-shrink-0 ${
                isSelected
                  ? 'bg-gray-950 text-white border-gray-950 shadow-lg shadow-gray-950/10 dark:bg-zinc-100 dark:text-zinc-950 dark:border-zinc-100'
                  : 'bg-white text-gray-500 border-gray-100 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-orange-500' : 'bg-gray-300 dark:bg-zinc-700'}`} />
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* 3. GRID LIS PLAT YO */}
      {loading && dishes.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-orange-500" />
        </div>
      ) : (
        <motion.div layout="position" transition={springTransition} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredDishes.map((dish) => (
              <motion.div
                key={dish.id}
                layout="position"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: -10 }}
                transition={springTransition}
                className={`bg-white rounded-2xl border flex flex-col justify-between overflow-hidden transition-colors duration-200 w-full ${
                  dish.isAvailable
                    ? 'border-gray-200 shadow-sm dark:bg-zinc-900 dark:border-zinc-800'
                    : 'border-gray-100 bg-gray-50/40 opacity-75 dark:bg-zinc-900/40 dark:border-zinc-800'
                }`}
              >
                {/* Kontni Kat la */}
                <div className="p-3.5 sm:p-4 flex gap-3 sm:gap-4 items-start">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-800 flex-shrink-0 relative">
                    <img
                      src={
                        dish.image instanceof File
                          ? URL.createObjectURL(dish.image)
                          : (dish.image || "")
                      }
                      alt={dish.name}
                      className={`w-full h-full object-cover bg-center ${!dish.isAvailable && 'grayscale'}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xs sm:text-sm font-black text-gray-900 dark:text-zinc-50 truncate">{dish.name}</h3>
                      <span className="text-[11px] sm:text-xs font-black text-orange-600 bg-orange-50 dark:bg-orange-950/40 dark:text-orange-400 px-2 py-0.5 rounded-lg whitespace-nowrap">
                        {dish.price.toFixed(2)} gds
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 dark:text-zinc-400 mt-1 line-clamp-2 break-words">{dish.description}</p>
                    
                    {/* Ti liy pou statistik ak tan preparasyon */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
                      <div className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold whitespace-nowrap">🔥 kòmande {dish.salesCount} fwa</div>
                      <div className="flex items-center gap-1 text-[10px] bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 px-1.5 py-0.5 rounded-md font-bold whitespace-nowrap">
                        <Clock size={10} className="text-gray-500 dark:text-zinc-400" />
                        <span>{dish.prepTime} min</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pye Kat la (Bouton yo) */}
                <div className="px-4 py-3 bg-gray-50/50 dark:bg-zinc-900/50 border-t border-gray-100 dark:border-zinc-800/60 flex items-center justify-between gap-4">
                  <button onClick={() => dish.id && toggleAvailability(dish?.id)} className="flex items-center gap-2 text-left cursor-pointer">
                    {dish.isAvailable ? <ToggleRight className="text-emerald-500 flex-shrink-0" size={24} /> : <ToggleLeft className="text-gray-300 dark:text-zinc-600 flex-shrink-0" size={24} />}
                    <span className={`text-[11px] font-bold ${dish.isAvailable ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-400 dark:text-zinc-500'}`}>
                      {dish.isAvailable ? 'Disponib' : 'Fini'}
                    </span>
                  </button>
                  <button onClick={() => handleOpenDrawer(dish)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-[11px] font-bold shadow-sm transition-all active:scale-95 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700">
                    <Edit2 size={12} />
                    <span>Edite</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* 📥 RELE DRAWER LA */}
      <MenuDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedDish={selectedDish}
        onChangeDish={setSelectedDish}
        restaurantId={restaurant?.id || ""}
        onSuccess={() => {
          loadRestaurantData();
        }}
      />
    </div>
  );
};

export default MenuPage;