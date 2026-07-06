import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Utensils, Heart, Settings, LogOut,CarTaxiFront } from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Kòmand', icon: ShoppingBag, path: '/orders' },
  { name: 'Restoran', icon: Utensils, path: '/restaurants' },
  { name: 'Favori', icon: Heart, path: '/favorites' },
  { name: 'Anviwònman', icon: Settings, path: '/settings' },
  { name: 'Livre', icon: CarTaxiFront, path: '/driver' },
];

const Sidebar = () => {
  return (
    <>
      {/* SIDEBAR POU DESKTOP (md ak pi gwo) */}
      <nav className="hidden md:flex flex-col w-64 h-screen bg-white border-r border-gray-200 p-6 justify-between fixed left-0 top-0 dark:bg-zinc-950 dark:border-zinc-900 transition-colors duration-300">
        <div>
          <div className="flex items-center gap-2 mb-10 px-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">D</div>
            <span className="text-xl font-bold text-gray-900 tracking-tight dark:text-zinc-50">DELIVERY</span>
          </div>

          <div className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400' 
                      : 'text-gray-500 hover:bg-gray-50 dark:text-zinc-400 dark:hover:bg-zinc-900/50'
                  }`
                }
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* User Profile Desktop */}
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between dark:bg-zinc-900/40 dark:border-zinc-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold dark:bg-orange-500/10 dark:text-orange-400">CD</div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-zinc-100">Cap-deli.</p>
              <p className="text-[10px] text-gray-500 dark:text-zinc-500">Premium</p>
            </div>
          </div>
          <LogOut size={16} className="text-gray-400 cursor-pointer dark:text-zinc-500" />
        </div>
      </nav>

      {/* BOTTOM MENU POU MOBILE (telefòn) */}
      <nav className="md:hidden bottom-nav fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 flex justify-around items-center p-3 z-50 dark:bg-zinc-950 dark:border-zinc-900 transition-colors duration-300">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-2 ${
                isActive ? 'text-orange-500 dark:text-orange-400' : 'text-gray-400 dark:text-zinc-500'
              }`
            }
          >
            <item.icon size={22} />
            <span className="text-[10px] font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;