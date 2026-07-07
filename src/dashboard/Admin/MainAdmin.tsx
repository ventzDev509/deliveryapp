import Sidebar from "../menu/Sidebar";
import TopBar from "../menu/TopBar";
import AdminValidation from "./AdminValidation";


const AdminValidations = () => {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 flex dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-300">
            {/* Sidebar Bò Gòch la */}
            <Sidebar />

            {/* Kontenè Prensipal la - Ak sipò nèt pou dark mode */}
            <div className="flex-1 flex flex-col gap-4 p-4 md:p-6 lg:ml-64 mb-20 md:mb-0">
                <TopBar />

                <main className="w-full flex flex-col gap-4">
                    <AdminValidation />
                </main>
            </div>
        </div>
    );
};

export default AdminValidations;