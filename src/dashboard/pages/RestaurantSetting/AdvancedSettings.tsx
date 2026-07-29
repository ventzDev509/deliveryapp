import { useState, useEffect } from 'react';
import { Wallet } from 'lucide-react';

import { useProfile } from '../../../Contexts/ProfileContext';
import { useAuth } from '../../../Contexts/AuthContext';
import { Notification } from '../../../notification/Notification';

const AdvancedSettings = () => {
  const { fetchProfile } = useProfile();
  const { user } = useAuth();
  const [notification, setNotification] = useState<{ message: string, type: 'error' | 'success' } | null>(null);

  // 2. State pou Metòd Peman yo (Sèlman cash ki aktif, lòt yo desaktive)
  const [payments, setPayments] = useState({
    cash: true,
    moncash: false,
    natcash: false,
    card: false,
  });

  // Chache pwofil la lè konpozan an monte
  useEffect(() => {
    const userId = user?.id;
    if (userId) {
      fetchProfile(userId);
    }
  }, [user]);

  // Efase notifikasyon apre 3 segond
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="space-y-6 transition-colors duration-300 relative w-full">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={8000}
          onClose={() => setNotification(null)}
        />
      )}

      {/* SEKSYON 2: METÒD PEMAN */}
      <div className="space-y-3">
        <div>
          <h3 className="text-xs font-bold text-gray-800 dark:text-zinc-200 flex items-center gap-1.5">
            <Wallet size={14} className="text-amber-500" />
            Metòd Peman yo Aksepte
          </h3>
          <p className="text-[11px] text-gray-400 dark:text-zinc-500">Chwazi kijan kliyan yo ka peye pou manje a.</p>
        </div>

        {/* Chanje grid-cols-2 an grid-cols-1 sm:grid-cols-2 pou l responsif sou telefòn */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { id: 'cash', label: 'Kach nan Livrezon', sub: 'Lajan kach (COD)', disabled: false },
            { id: 'moncash', label: 'MonCash', sub: 'Peman mobil Digicel', disabled: true },
            { id: 'natcash', label: 'Natcash', sub: 'Peman mobil Natcom', disabled: true },
            { id: 'card', label: 'Kat Kredi / Debit', sub: 'Stripe / Visa / Master', disabled: true },
          ].map((item) => {
            const isChecked = payments[item.id as keyof typeof payments];
            return (
              <label 
                key={item.id}
                className={`p-3 rounded-xl border flex items-start gap-3 transition-all select-none relative ${
                  item.disabled 
                    ? 'opacity-60 bg-gray-100/50 dark:bg-zinc-900/30 border-gray-200 dark:border-zinc-800 cursor-not-allowed'
                    : isChecked 
                      ? 'bg-white dark:bg-zinc-900 border-amber-500 shadow-sm cursor-pointer' 
                      : 'bg-gray-50/30 dark:bg-zinc-900/10 border-gray-100 dark:border-zinc-800 cursor-pointer'
                }`}
              >
                <input 
                  type="checkbox"
                  checked={isChecked}
                  disabled={item.disabled}
                  onChange={() => !item.disabled && setPayments({ ...payments, [item.id]: !isChecked })}
                  className="mt-0.5 h-3.5 w-3.5 rounded-md border-gray-300 dark:border-zinc-700 text-amber-500 focus:ring-amber-500 accent-amber-500 cursor-pointer"
                />
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-800 dark:text-zinc-200">{item.label}</span>
                    {item.disabled && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-amber-400 rounded-md uppercase tracking-wider">
                        Soon
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium">{item.sub}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;