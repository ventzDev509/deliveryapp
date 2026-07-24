import { createContext, useContext, useState, type ReactNode } from 'react';
import api from './api/axios';
import toast from 'react-hot-toast';
import type { Profile, ProfileContextType } from '../types/profileType';

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Fonksyon pou kapte ak fòmate tout mesaj erè ki soti nan backend
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

    //  Mizajou pwofil la
    const updateProfile = async (userId: string, data: any): Promise<any> => {
        setLoading(true);
        try {
            const response = await api.patch(`/profiles/${userId}`, data);
            setProfile(response.data);
           
            toast.success("Pwofil la mete ajou ak siksè!");
            return response;
        } catch (error:any) {
             throw error.response?.data || { message: error.message || "Erè ajou wòl itilizatè." };

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