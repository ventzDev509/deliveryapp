import { useState } from "react";
import CategoryDrawer from "../category/CategoryDrawer";
import Sidebar from "../menu/Sidebar";
import TopBar from "../menu/TopBar";
import AdminValidation from "./AdminValidation";
import { Plus, Edit2, Layers } from "lucide-react";
import { useCategory } from "../../Contexts/CategoryContext";

const AdminValidations = () => {
    // Rekipere tout fonksyon ak done ki nan CategoryContext la
    const { categories, createCategory, updateCategory, deleteCategory, loading } = useCategory();

    const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<{ id?: string; name: string } | null>(null);

    // Fonksyon pou louvri l (pou kreye oswa edite)
    const handleOpenCategoryDrawer = (cat?: { id?: string; name: string }) => {
        setSelectedCategory(cat || { name: '' });
        setIsCategoryDrawerOpen(true);
    };

    // Fonksyon pou sove (Create / Update) nan backend la atravè Context la
    const handleSaveCategory = async (cat: { id?: string; name: string }) => {
        try {
            if (cat.id) {
                await updateCategory(cat.id, { name: cat.name });
            } else {
                await createCategory({ name: cat.name });
            }
            setIsCategoryDrawerOpen(false);
        } catch (error) {
            console.error("Erè pandan y ap sove kategori a:", error);
        }
    };

    // Fonksyon pou efase (Delete) nan backend la atravè Context la
    const handleDeleteCategory = async (id: string) => {
        try {
            await deleteCategory(id);
            setIsCategoryDrawerOpen(false);
        } catch (error) {
            console.error("Erè pandan y ap efase kategori a:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 flex dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-300">
            {/* Sidebar Bò Gòch la */}
            <Sidebar />

            {/* Kontenè Prensipal la - Ak sipò nèt pou dark mode */}
            <div className="flex-1 flex flex-col gap-4 p-4 md:p-6 lg:ml-64 mb-20 md:mb-0">
                <TopBar />

                <main className="w-full flex flex-col gap-6">
                    <CategoryDrawer
                        isOpen={isCategoryDrawerOpen}
                        onClose={() => setIsCategoryDrawerOpen(false)}
                        selectedCategory={selectedCategory}
                        onChangeCategory={setSelectedCategory}
                        onSave={handleSaveCategory}
                        onDelete={handleDeleteCategory}
                        loading={loading}
                    />

                    {/* Tèt ak Bouton pou Ajoute Kategori */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl md:text-2xl font-black tracking-tight">Jere Kategori</h1>
                            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">Kreye ak modifye kategori pou meni restoran yo.</p>
                        </div>
                        <button 
                            onClick={() => handleOpenCategoryDrawer()} 
                            className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-orange-500/10 active:scale-95 hover:bg-orange-600"
                        >
                            <Plus size={16} />
                            <span>Nouvo Kategori</span>
                        </button>
                    </div>

                    {/* Lis Kategori yo k ap afiche an tan reyèl ki soti nan Backend la */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {categories.map((cat) => (
                            <div 
                                key={cat.id} 
                                onClick={() => handleOpenCategoryDrawer(cat)}
                                className="p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl cursor-pointer hover:border-orange-500 dark:hover:border-orange-500 transition-all flex justify-between items-center shadow-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 rounded-xl">
                                        <Layers size={16} />
                                    </div>
                                    <span className="text-xs font-bold">{cat.name}</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-400 dark:text-zinc-500 text-[11px] font-bold">
                                    <Edit2 size={12} />
                                    <span>Edite</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <AdminValidation />
                </main>
            </div>
        </div>
    );
};

export default AdminValidations;