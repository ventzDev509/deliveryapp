import { createContext, useContext, useState, type ReactNode } from 'react';
import api from './api/axios';
import toast from 'react-hot-toast';
import type { Profile, ProfileContextType } from '../types/profileType';

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

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

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(false);

    // 1. Jwenn pwofil yon itilizatè an patikilye
    const fetchProfile = async (userId: string) => {
        setLoading(true);
        try {
            const response = await api.get<Profile>(`/profiles/${userId}`);
            setProfile(response.data);
        } catch (error) {
            showApiErrors(error);
        } finally {
            setLoading(false);
        }
    };

    // 2. Mizajou pwofil la (Tèks / Enfòmasyon)
    const updateProfile = async (userId: string, data: any): Promise<any> => {
        setLoading(true);
        try {
            const response = await api.patch(`/profiles/${userId}`, data);
            setProfile(response.data);

            toast.success("Pwofil la mete ajou ak siksè!");
            return response.data;
        } catch (error: any) {
            showApiErrors(error);
            throw error.response?.data || { message: error.message || "Erè ajou pwofil." };
        } finally {
            setLoading(false);
        }
    };

    // 3. Mizajou foto pwofil ak banyè (Banner)
    const updateProfileImages = async (userId: string, profileImage?: File, bannerImage?: File): Promise<any> => {
        setLoading(true);
        try {
            const formData = new FormData();

            if (profileImage) {
                formData.append('profileImage', profileImage);
            }
            if (bannerImage) {
                formData.append('bannerImage', bannerImage);
            }

            const response = await api.put(`/profiles/upload-images`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setProfile(response.data);
            toast.success("Foto yo mete ajou ak siksè!");
            return response.data;
        } catch (error: any) {
            showApiErrors(error);
            throw error.response?.data || { message: error.message || "Erè nan chajman foto yo." };
        } finally {
            setLoading(false);
        }
    };

    // 4. NOUVO: Mizajou orè operasyon yo (WorkingHours nan fòma 12h)
    const updateWorkingHours = async (hours: Array<{ day: string; isOpen: boolean; openTime: string; closeTime: string }>): Promise<any> => {
        setLoading(true);
        try {
            const response = await api.put('/profiles/working-hours', { hours });
            
            setProfile(response.data);
            toast.success("Orè operasyon yo mete ajou ak siksè!");
            return response.data;
        } catch (error: any) {
            showApiErrors(error);
            throw error.response?.data || { message: error.message || "Erè nan Mizajou orè yo." };
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProfileContext.Provider value={{
            profile,
            loading,
            fetchProfile,
            updateProfile,
            updateProfileImages,
            updateWorkingHours, 
            setProfile
        }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile dwe itilize anndan yon ProfileProvider');
    }
    return context;
};