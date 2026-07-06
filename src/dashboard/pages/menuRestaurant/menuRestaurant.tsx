import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, ToggleLeft, ToggleRight, Flame, Utensils, Layers, Clock } from 'lucide-react'; // 🚀 Mwen ajoute ikon Clock la isit la
import MenuDrawer from './MenuDrawer';

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  salesCount: number;
  prepTime: number; 
}
const initialDishes: Dish[] = [
  // --- MANJE PRENSIPAL (Main) ---
  {
    id: "DISH-001",
    name: "Griot ak Bannann Peze",
    description: "Moso vyann kochon byen rousi, sèvi ak bannann peze, pikliz pikant ak sòs.",
    price: 15.00,
    category: "Main",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400",
    isAvailable: true,
    salesCount: 142,
    prepTime: 25
  },
  {
    id: "DISH-002",
    name: "Diri Kole ak Poul Sòs",
    description: "Diri ak pwa nwa nasyonal, sèvi ak moso poul peyi byen fennen nan sòs ak legim.",
    price: 18.50,
    category: "Main",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400",
    isAvailable: true,
    salesCount: 98,
    prepTime: 30
  },
  {
    id: "DISH-003",
    name: "Tassot Kabrit ak Diri Djon djon",
    description: "Moso vyann kabrit byen fri epi kroustiyan, sèvi ak diri djon djon ak pwa frans.",
    price: 22.00,
    category: "Main",
    image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&q=80&w=400",
    isAvailable: true,
    salesCount: 75,
    prepTime: 35
  },
  {
    id: "DISH-004",
    name: "Legim Ayisyen ak Krab",
    description: "Yon bon melanj berejèn, Chouchou, ak zepina, byen kwit ak krab ak vyann bèf, sèvi ak diri blan.",
    price: 20.00,
    category: "Main",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=400",
    isAvailable: true,
    salesCount: 110,
    prepTime: 40
  },

  // --- BWASON (Drinks) ---
  {
    id: "DISH-005",
    name: "Ji Sitwon ak Mant",
    description: "Ji sitwon fre byen glase, melanje ak ti fèy mant pou yon frajilite total.",
    price: 4.50,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400",
    isAvailable: true,
    salesCount: 215,
    prepTime: 5
  },
  {
    id: "DISH-006",
    name: "Kòktèl Jwèt Sanfout la",
    description: "Yon bon ji fwi natirèl melanje ak wonm kleren oswa wonm lokal, siwo grenadin, ak anana.",
    price: 8.00,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=400",
    isAvailable: true,
    salesCount: 134,
    prepTime: 7
  },

  // --- DESÈ (Desserts) ---
  {
    id: "DISH-007",
    name: "Pen Patat Tradisyonèl",
    description: "Gato patat dous ayisyen an, byen aromatize ak epis santi bon tankou kanèl ak noutmèg.",
    price: 6.00,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400",
    isAvailable: true,
    salesCount: 89,
    prepTime: 15
  },
  {
    id: "DISH-008",
    name: "Blan Manje Kokoye",
    description: "Yon ti desè lejè ak lèt kokoye, lèt kondanse, ak yon ti gou sitwon vèt.",
    price: 5.50,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&q=80&w=400",
    isAvailable: false, // Pou n ka teste jan sa parèt lè yon plat fini
    salesCount: 52,
    prepTime: 10
  }
];
const springTransition = { type: "spring", stiffness: 200, damping: 25, mass: 0.8 } as const;

const MenuPage = () => {
  const [dishes, setDishes] = useState<Dish[]>(initialDishes);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Drawer States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  const handleOpenDrawer = (dish: Dish | null = null) => {
    if (dish) {
      setSelectedDish(dish);
    } else {
      setSelectedDish({
        id: `DISH-00${dishes.length + 1}`,
        name: '',
        description: '',
        price: 0,
        category: 'Main',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400',
        isAvailable: true,
        salesCount: 0,
        prepTime: 20 // 🚀 20 minit pa defo lè y ap kreye yon nouvo plat
      });
    }
    setIsDrawerOpen(true);
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDish) return;

    if (dishes.some(d => d.id === selectedDish.id)) {
      setDishes(dishes.map(d => d.id === selectedDish.id ? selectedDish : d));
    } else {
      setDishes([...dishes, selectedDish]);
    }
    setIsDrawerOpen(false);
  };

  const toggleAvailability = (id: string) => {
    setDishes(dishes.map(dish => dish.id === id ? { ...dish, isAvailable: !dish.isAvailable } : dish));
  };

  const filteredDishes = dishes.filter(dish => {
    const matchesCategory = activeCategory === 'All' || dish.category === activeCategory;
    return matchesCategory && (dish.name.toLowerCase().includes(searchQuery.toLowerCase()) || dish.description.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* 1. TÈT PAJ LA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">Meni Restoran</h1>
          <p className="text-xs text-gray-400 mt-0.5">Ajoute plat, chanje pri, epi mete manje disponib.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Chache yon manje..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none focus:border-orange-500 transition-colors shadow-sm"
            />
          </div>
          <button onClick={() => handleOpenDrawer(null)} className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-orange-500/10 active:scale-95">
            <Plus size={16} />
            <span>Nouvo Plat</span>
          </button>
        </div>
      </div>

      {/* 2. FILTRE KATEGORI */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-gray-100">
        {[
          { id: 'All', label: 'Tout', icon: Utensils },
          { id: 'Main', label: 'Manje Prensipal', icon: Flame },
          { id: 'Drinks', label: 'Bwason', icon: Layers },
        ].map((cat) => {
          const Icon = cat.icon;
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                isSelected ? 'bg-gray-950 text-white shadow-lg shadow-gray-950/10' : 'bg-white text-gray-500 border border-gray-100'
              }`}
            >
              <Icon size={14} className={isSelected ? "text-orange-500" : "text-gray-400"} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 3. GRID LIS PLAT YO */}
      <motion.div layout="position" transition={springTransition} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredDishes.map((dish) => (
            <motion.div
              key={dish.id}
              layout="position"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -10 }}
              transition={springTransition}
              className={`bg-white rounded-2xl border flex flex-col justify-between overflow-hidden ${
                dish.isAvailable ? 'border-gray-200 shadow-sm' : 'border-gray-100 bg-gray-50/40 opacity-75'
              }`}
            >
              {/* Kontni Kat la */}
              <div className="p-4 flex gap-4">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 relative">
                  <img src={dish.image} alt={dish.name} className={`w-full h-full object-cover ${!dish.isAvailable && 'grayscale'}`} />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-black text-gray-900 truncate">{dish.name}</h3>
                    <span className="text-xs font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-lg">${dish.price.toFixed(2)}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">{dish.description}</p>
                  
                  {/* Ti liy pou statistik ak tan preparasyon */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="text-[10px] text-gray-400 font-bold">🔥 kòmande {dish.salesCount} fwa</div>
                    <div className="flex items-center gap-1 text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-md font-bold">
                      <Clock size={10} className="text-gray-500" />
                      <span>{dish.prepTime} min</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pye Kat la (Bouton yo) */}
              <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between gap-4">
                <button onClick={() => toggleAvailability(dish.id)} className="flex items-center gap-2 text-left">
                  {dish.isAvailable ? <ToggleRight className="text-emerald-500" size={24} /> : <ToggleLeft className="text-gray-300" size={24} />}
                  <span className={`text-[11px] font-bold ${dish.isAvailable ? 'text-emerald-700' : 'text-gray-400'}`}>{dish.isAvailable ? 'Disponib' : 'Fini'}</span>
                </button>
                <button onClick={() => handleOpenDrawer(dish)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-[11px] font-bold shadow-sm transition-all active:scale-95">
                  <Edit2 size={12} />
                  <span>Edite</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* 📥 KAN POU NOU RELE NOUVO KONPOZAN AN */}
      <MenuDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedDish={selectedDish}
        onChangeDish={setSelectedDish}
        onSave={handleSaveChanges}
      />

    </div>
  );
};

export default MenuPage;