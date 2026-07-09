import type { CreateDriverDto } from "./dto/create-driver.dto";

export interface Driver {
    id: string;
    name: string;
    status: 'AVAILABLE' | 'ON_DELIVERY' | 'BROKEN_DOWN' | 'IN_TRAFFIC' | 'OFFLINE';
    currentLat: number | null;
    phone:string;
    email:string;
    isVerified:boolean;
    currentLng: number | null;
    vehicleType: 'MOTORCYCLE' | 'BICYCLE' | 'CAR' | 'TRUCK';
    vehiclePlate?: string;
    user: { id: string; fullName: string; email: string };
}

export interface DriverContextType {
    drivers: Driver[];
    loading: boolean;
    fetchDrivers: () => Promise<void>;
    createDriver: (data: CreateDriverDto) => Promise<boolean>;
    updateDriverStatus: (id: string, status: string) => Promise<boolean>;
    deleteDriver: (id: string) => Promise<boolean>;
    approveDriver: (id: string) => Promise<boolean>;
    updateDriver: (id: string, data: Partial<Driver>) => Promise<boolean>;
    getDriverStats: (id: string) => Promise<any>;
}