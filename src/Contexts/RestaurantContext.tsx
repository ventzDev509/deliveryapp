import { createContext, useContext, useState, type ReactNode } from 'react';
import api from './api/axios';
import toast from 'react-hot-toast';

export interface MenuItem {
    id: string;
    name: string;
    price: number;
    description: string;
    image?: string;
    categoryId?: string;
    isAvailable?: boolean;
    prepTime?: number;
}

export interface Restaurant {
    id: string;
    name: string;
    description?: string;
    lat?: number;
    lng?: number;
    menus?: MenuItem[];
    [key: string]: any;
}

interface RestaurantContextType {
    restaurant: Restaurant | null;
    restaurants: Restaurant[];
    loading: boolean;
    fetchAllRestaurants: () => Promise<void>;
    fetchRestaurantById: (id: string) => Promise<any>;
    fetchRestaurantByOwnerId: (ownerId: string) => Promise<any>;
    updateRestaurant: (id: string, data: { name?: string; description?: string; lat?: number; lng?: number }) => Promise<any>;
    createMenuItem: (restaurantId: string, data: any) => Promise<any>;
    updateMenuItem: (itemId: string, data: any) => Promise<any>;
    deleteMenuItem: (itemId: string) => Promise<any>;
    setRestaurant: (restaurant: Restaurant | null) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

const showApiErrors = (error: any) => {
    if (error.response?.data?.message) {
        const data = error.response.data.message;
        const messages = Array.isArray(data) ? data : [data];
        messages.forEach((msg) => toast.error(msg));
    } else if (error.message) {
        toast.error(error.message);
    } else {
        toast.error("Yon erè enkoni te rive");
    }
};

export const RestaurantProvider = ({ children }: { children: ReactNode }) => {
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(false);

    // 1. Jwenn tout restoran yo
    const fetchAllRestaurants = async () => {
        setLoading(true);
        try {
            const response = await api.get<Restaurant[]>('/restaurants');
            setRestaurants(response.data);
        } catch (error) {
            showApiErrors(error);
        } finally {
            setLoading(false);
        }
    };

    // 2. Jwenn yon restoran pa ID l
    const fetchRestaurantById = async (id: string) => {
        setLoading(true);
        try {
            const response = await api.get<Restaurant>(`/restaurants/${id}`);
            setRestaurant(response.data);
            return response.data;
        } catch (error) {
            showApiErrors(error);
        } finally {
            setLoading(false);
        }
    };

    // 3. Jwenn restoran pa Owner ID
    const fetchRestaurantByOwnerId = async (ownerId: string) => {
        setLoading(true);
        try {
            const response = await api.get<Restaurant>(`/restaurants/owner/${ownerId}`);
            setRestaurant(response.data);
            return response.data;
        } catch (error) {
            showApiErrors(error);
        } finally {
            setLoading(false);
        }
    };

    // 4. Mizajou enfòmasyon restoran an
    const updateRestaurant = async (id: string, data: { name?: string; description?: string; lat?: number; lng?: number }): Promise<any> => {
        setLoading(true);
        try {
            const response = await api.put(`/restaurants/${id}`, data);
            setRestaurant(response.data);
            toast.success("Restoran an mete ajou ak siksè!");
            return response.data;
        } catch (error: any) {
            showApiErrors(error);
            throw error.response?.data || { message: error.message || "Erè nan mizajou restoran an." };
        } finally {
            setLoading(false);
        }
    };

    // 5. Kreye yon atik nan meni an (Kòrèk pou voye File / FormData oswa JSON)
    const createMenuItem = async (restaurantId: string, data: any): Promise<any> => {
        setLoading(true);
        try {
            const formData = new FormData();
            for (const key in data) {
                if (data[key] !== undefined && data[key] !== null) {
                    formData.append(key, data[key]);
                }
            }

            const response = await api.post(`/restaurants/${restaurantId}/menu`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success("Atik la ajoute nan meni an ak siksè!");
            return response.data;
        } catch (error: any) {
            showApiErrors(error);
            throw error.response?.data || { message: error.message || "Erè nan kreyasyon atik la." };
        } finally {
            setLoading(false);
        }
    };

    // 6. Mizajou yon atik nan meni an (Kòrèk pou voye File / FormData oswa JSON)
    const updateMenuItem = async (itemId: string, data: any): Promise<any> => {
        setLoading(true);
        try {
            const formData = new FormData();
            for (const key in data) {
                if (data[key] !== undefined && data[key] !== null) {
                    formData.append(key, data[key]);
                }
            }

            const response = await api.put(`/restaurants/menu/item/${itemId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success("Atik la mete ajou ak siksè!");
            return response.data;
        } catch (error: any) {
            showApiErrors(error);
            throw error.response?.data || { message: error.message || "Erè nan mizajou atik la." };
        } finally {
            setLoading(false);
        }
    };

    // 7. Efase yon atik nan meni an
    const deleteMenuItem = async (itemId: string): Promise<any> => {
        setLoading(true);
        try {
            const response = await api.delete(`/restaurants/menu/item/${itemId}`);
            toast.success("Atik la efase ak siksè!");
            return response.data;
        } catch (error: any) {
            showApiErrors(error);
            throw error.response?.data || { message: error.message || "Erè lè w t ap efase atik la." };
        } finally {
            setLoading(false);
        }
    };

    return (
        <RestaurantContext.Provider value={{
            restaurant,
            restaurants,
            loading,
            fetchAllRestaurants,
            fetchRestaurantById,
            fetchRestaurantByOwnerId,
            updateRestaurant,
            createMenuItem,
            updateMenuItem,
            deleteMenuItem,
            setRestaurant
        }}>
            {children}
        </RestaurantContext.Provider>
    );
};

export const useRestaurant = () => {
    const context = useContext(RestaurantContext);
    if (!context) {
        throw new Error('useRestaurant dwe itilize anndan yon RestaurantProvider');
    }
    return context;
};