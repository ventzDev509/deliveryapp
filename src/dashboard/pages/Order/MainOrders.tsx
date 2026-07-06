import Sidebar from "../../menu/Sidebar";
import TopBar from "../../menu/TopBar";
import OrdersPage from "./OrdersPage";

const MainOrder = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex dark:bg-zinc-950 transition-colors duration-300">
            {/* Sidebar Bò Gòch la */}
            <Sidebar />
            
            {/* Kontenè Prensipal la */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 md:p-6 lg:ml-64 mb-20 md:mb-0">
                
                {/* ZÒN PRENSIPAL (Nou mete l col-span-4 pou l pran tout lajè a nèt) */}
                <main className="lg:col-span-4 flex flex-col gap-4">
                    <TopBar />
                    <OrdersPage />
                </main>
                
            </div>
        </div>
    );
};

export default MainOrder;