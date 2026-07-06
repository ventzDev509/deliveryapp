import Sidebar from './menu/Sidebar';
import TopBar from './menu/TopBar';
import RightSidebarDelivery from './RightSidebarDelivery/RightSidebarDelivery';
import StatCards from './statsCard/StatCards';
import RecentOrdersTable from './table/RecentOrdersTable';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex dark:bg-zinc-950 transition-colors duration-300">
            <Sidebar />
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 md:p-6 lg:ml-64 mb-20 md:mb-0">
                {/* ZÒN PRENSIPAL LA (3 Kolòn) */}
                <main className="lg:col-span-3 flex flex-col gap-1">
                    <TopBar />

                    <StatCards />
                    <div className="block lg:hidden">
                        <RightSidebarDelivery />
                    </div>
                    <RecentOrdersTable />
                </main>

                {/* ASIDE (1 Kolòn) - Nou rann li Sticky pou l swiv Scroll la */}
                <aside className="hidden lg:block lg:col-span-1 sticky top-6 h-fit">
                    <RightSidebarDelivery />
                </aside>
            </div>
        </div>
    );
};

export default MainLayout;