import { Search } from 'lucide-react';
import { useState } from 'react';
import { Drawer } from './Drawer';
import { DriverForm } from './DriverDrawer';

interface FilterProps {
  search: string;
  setSearch: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
}

export const DriverFilter = ({ search, setSearch, statusFilter, setStatusFilter }: FilterProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  return (
    <div className="flex flex-col sm:flex-row gap-3 p-4">
      {/* Search Bar */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 text-zinc-400" size={16} />
        <input
          type="text"
          placeholder="Chèche yon chofè..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm outline-none"
        />
      </div>

      {/* Status Filter */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="px-4 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm outline-none cursor-pointer"
      >
        <option value="ALL">Tout Estati</option>
        <option value="AVAILABLE">Disponib</option>
        <option value="ON_DELIVERY">Livrezon</option>
        <option value="OFFLINE">Deploge</option>
      </select>

      <div>
        <button className='bg-orange-500 text-black px-1  py-2 rounded-xl font-semibold' onClick={() => setIsDrawerOpen(true)}>Ajoute Chofè</button>

        {/* Itilizasyon Drawer + Form */}
        <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
          <DriverForm onClose={() => setIsDrawerOpen(false)} />
        </Drawer>
      </div>
    </div>
  );
};