import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from './api/axios';
import type { Driver, DriverContextType } from '../types/driver.types';
import type { CreateDriverDto } from '../types/dto/create-driver.dto';
import toast from 'react-hot-toast';

const DriverContext = createContext<DriverContextType | undefined>(undefined);

// Fonksyon pou kapte ak fòmate tout mesaj erè ki soti nan backend (NestJS)
const showApiErrors = (error: any) => {
  if (error.response?.data?.message) {
    const data = error.response.data.message;
    // Si mesaj la se yon tab (array), montre chak mesaj
    const messages = Array.isArray(data) ? data : [data];
    messages.forEach((msg) => toast.error(msg));
  } else if (error.message) {
    toast.error(error.message);
  } else {
    toast.error("Yon erè enkoni te rive");
  }
};

export const DriverProvider = ({ children }: { children: ReactNode }) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. Rale tout chofè yo
  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const response = await api.get<Driver[]>('/drivers');
      setDrivers(response.data);
    } catch (error) {
      showApiErrors(error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Kreye yon chofè
  const createDriver = async (data: CreateDriverDto): Promise<boolean> => {
    try {
      const response = await api.post('/drivers', data);
      setDrivers((prev) => [...prev, response.data]);
      toast.success("Chofè a ajoute avèk siksè!");
      return true;
    } catch (error: any) {
      showApiErrors(error);
      return false;
    }
  };


const updateDriver = async (id: string, data: any): Promise<boolean> => {
  setLoading(true);
  try {
    // Nou voye tout 'data' la, li gen ladan l status, vehicleType, elatriye
    const response = await api.patch(`/drivers/${id}`, data);
    
    setDrivers((prev) => 
      prev.map(d => d.id === id ? { ...d, ...response.data } : d)
    );
    
    toast.success("Enfòmasyon chofè a ajou!");
    return true;
  } catch (error) {
    showApiErrors(error);
    return false;
  } finally {
    setLoading(false);
  }
};

  // 3. Apwouve chofè
  const approveDriver = async (id: string): Promise<boolean> => {
    try {
      const response = await api.patch(`/drivers/${id}/approve`);
      setDrivers((prev) => prev.map((d) => (d.id === id ? response.data : d)));
      toast.success("Chofè a apwouve!");
      return true;
    } catch (error) {
      showApiErrors(error);
      return false;
    }
  };

  // 4. Jwenn statistik
  const getDriverStats = async (id: string) => {
    try {
      const response = await api.get(`/drivers/${id}/stats`);
      return response.data;
    } catch (error) {
      showApiErrors(error);
      throw error;
    }
  };

  // 5. Mizajou estati
  const updateDriverStatus = async (id: string, status: string): Promise<boolean> => {
    try {
      await api.patch(`/drivers/${id}`, { status });
      setDrivers((prev) => prev.map((d) => (d.id === id ? { ...d, status: status as any } : d)));
      toast.success("Estati a mete ajou!");
      return true;
    } catch (error) {
      showApiErrors(error);
      return false;
    }
  };

  // 6. Efase chofè
  const deleteDriver = async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/drivers/${id}`);
      setDrivers((prev) => prev.filter((d) => d.id !== id));
      toast.success("Chofè a efase.");
      return true;
    } catch (error) {
      showApiErrors(error);
      return false;
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return (
    <DriverContext.Provider value={{ 
      drivers, 
      loading, 
      fetchDrivers, 
      createDriver, 
      updateDriverStatus, 
      deleteDriver,
      approveDriver,
      getDriverStats,
      updateDriver
    }}>
      {children}
    </DriverContext.Provider>
  );
};

export const useDriver = () => {
  const context = useContext(DriverContext);
  if (!context) {
    throw new Error('useDriver dwe itilize anndan yon DriverProvider');
  }
  return context;
};