import React, { useEffect, useState } from 'react';
import { X, Save, User, Phone, Mail, CreditCard, ShieldCheck } from 'lucide-react';
import type { Driver } from '../../../types/driver.types';
import { useDriver } from '../../../Contexts/DriverContext';
import WhiteLoader from '../../../loader/WhiteLoader';
import { AnimatePresence } from 'framer-motion';
import { Notification } from '../../../notification/Notification';

interface DriverFormProps {
  onClose: () => void;
  driverToEdit?: Driver | null;
}

export const DriverForm = ({ onClose, driverToEdit }: DriverFormProps) => {
  const { createDriver, updateDriver, loading } = useDriver();
  const [notification, setNotification] = useState<{ message: string, type: 'error' | 'success' } | null>(null);

  const [formData, setFormData] = useState({
    name: driverToEdit?.name || '',
    phone: driverToEdit?.phone || '',
    email: driverToEdit?.email || '',
    vehicleType: driverToEdit?.vehicleType || 'MOTORCYCLE',
    vehiclePlate: driverToEdit?.vehiclePlate || '',
    status: driverToEdit?.status || 'AVAILABLE',
    isVerified: driverToEdit?.isVerified || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    try {
      let success = false;
      if (driverToEdit) {
        success = await updateDriver(driverToEdit.id, formData);
        
        if (success) setNotification({ message: "Chofè a modifiye avèk siksè!", type: 'success' });
      } else {
        success = await createDriver(formData as any);
        if (success) setNotification({ message: "Chofè a kreye avèk siksè!", type: 'success' });
      }

      if (success) setTimeout(onClose, 1500);
      else setNotification({ message: "Yon erè te rive pandan anrejistreman an.", type: 'error' });
    } catch (error) {
      setNotification({ message: "Yon erè teknik te rive.", type: 'error' });
    }
  };

  useEffect(() => {
    if (driverToEdit) {
      setFormData({
        name: driverToEdit.name || '',
        phone: driverToEdit.phone || '',
        email: driverToEdit.email || '',
        vehicleType: driverToEdit.vehicleType || 'MOTORCYCLE',
        vehiclePlate: driverToEdit.vehiclePlate || '',
        status: driverToEdit.status || 'AVAILABLE',
        isVerified: driverToEdit.isVerified || false,
      });
    }
  }, [driverToEdit]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="absolute top-4 left-6 right-6 z-[9999]">
        <AnimatePresence>
          {notification && (
            <Notification
              key={notification.message}
              message={notification.message}
              type={notification.type}
              onClose={() => setNotification(null)}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <h2 className="text-lg font-black">{driverToEdit ? 'Modifye Chofè' : 'Ajoute Chofè'}</h2>
        <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors">
          <X size={18} className="text-zinc-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Enfòmasyon Pèsonèl</h3>
          <InputGroup icon={<User size={16} />} label="Non Konplè" value={formData.name} onChange={(v: string) => setFormData({ ...formData, name: v })} />
          <div className="grid grid-cols-2 gap-4">
            <InputGroup icon={<Phone size={16} />} label="Telefòn" value={formData.phone} onChange={(v: string) => setFormData({ ...formData, phone: v })} />
            <InputGroup icon={<Mail size={16} />} label="Imèl" value={formData.email} onChange={(v: string) => setFormData({ ...formData, email: v })} />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Administrasyon & Veyikil</h3>

          <label className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:border-orange-500 transition-colors">
            <input type="checkbox" checked={formData.isVerified} onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })} className="accent-orange-500" />
            <span className="text-sm font-bold flex items-center gap-2"><ShieldCheck size={16} className="text-blue-500" /> Chofè verifye</span>
          </label>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400">Kalite Veyikil</label>
              <select value={formData.vehicleType} onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value as any })} className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm outline-none">
                <option value="MOTORCYCLE">MOTORCYCLE</option>
                <option value="CAR">CAR</option>
                <option value="BICYCLE">BICYCLE</option>
                <option value="TRUCK">TRUCK</option>
              </select>
            </div>
            <InputGroup icon={<CreditCard size={16} />} label="Nimewo Plak" value={formData.vehiclePlate} onChange={(v: string) => setFormData({ ...formData, vehiclePlate: v })} />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400">Estati Chofè</label>
            <div className="grid grid-cols-3 gap-2">
              {['AVAILABLE', 'ON_DELIVERY', 'BROKEN_DOWN', 'IN_TRAFFIC', 'OFFLINE', 'SUSPENDED'].map((s) => (
                <button key={s} type="button" onClick={() => setFormData({ ...formData, status: s as any })}
                  className={`py-2 text-[10px] font-bold border rounded-lg transition-all ${formData.status === s ? 'border-orange-500 bg-orange-500/10 text-orange-600' : 'border-zinc-200 dark:border-zinc-800'}`}>
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </form>

      <div className="p-6 border-t border-zinc-100 dark:border-zinc-800">
        <button type="submit" onClick={handleSubmit} disabled={loading} className="w-full py-3 rounded-xl bg-zinc-900 dark:bg-orange-500 text-white font-bold flex justify-center gap-2 hover:opacity-90 transition-opacity">
          {loading ? <WhiteLoader size={24} /> : <><Save size={16} /> Sove Enfòmasyon yo</>}
        </button>
      </div>
    </div>
  );
};

const InputGroup = ({ icon, label, value, onChange }: any) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">{icon} {label}</label>
    <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm outline-none" />
  </div>
);