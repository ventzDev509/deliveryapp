import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type User, type AuthContextType, type AuthResponse, type BecomeSellerPayload } from '../types/auth.types';
import api from './api/axios';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const token = localStorage.getItem('lky');
        if (token) {
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get<User>('/auth/profile');
            setUser(res.data);
        } catch {
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials: any): Promise<AuthResponse> => {
        try {
            const res = await api.post<AuthResponse>('/auth/login', credentials);
            if (res.data.token) {
                localStorage.setItem('lky', res.data.token);
                setUser(res.data.user || null);
            }
            return res.data;
        } catch (error: any) {
            throw error.response?.data || { message: "Erè pandan koneksyon an." };
        }
    };

    const register = async (data: any): Promise<AuthResponse> => {
        try {
            const res = await api.post<AuthResponse>('/auth/register', data);
            return res.data;
        } catch (error: any) {
            // Nou voye mesaj erè a ki soti nan backend la
            throw error.response?.data || { message: "Erè pandan enskripsyon an." };
        }
    };

    const requestEmailConfirmation = async (email: string): Promise<AuthResponse> => {

        try {
            const res = await api.post<AuthResponse>('/auth/requestEmailConfimation', { email });
            return res.data
        } catch (error: any) {
            throw error.response?.data || { message: "Erè nan send konfimasyon imèl." };
        }
    }

    const loginWithGoogle = () => {
        window.location.href = `${api.defaults.baseURL}/auth/google`;
    };

    const confirmEmail = async (token: string): Promise<AuthResponse> => {
        try {
            const res = await api.get<AuthResponse>(`/auth/confirm/${token}`);
            return res.data;
        } catch (error: any) {
            console.log(error)
            throw error.response?.data || { message: "Erè konfimasyon imèl." };
        }
    };



    const forgotPassword = async (email: string): Promise<AuthResponse> => {
        try {
            const res = await api.post<AuthResponse>('/auth/forgot-password', { email });
            return res.data;
        } catch (error: any) {
            throw error.response?.data || { message: "Erè voye imèl modpas." };
        }
    };

    const resetPassword = async (token: string, newPassword: string): Promise<AuthResponse> => {
        try {
            const res = await api.post<AuthResponse>('/auth/reset-password', { token, newPassword });
            return res.data;
        } catch (error: any) {
            throw error.response?.data || { message: "Erè chanje modpas." };
        }
    };

    // Asire w interfaces ou yo deklare konsa oswa menm jan an:


    const becomeSeller = async (payload: BecomeSellerPayload): Promise<void> => {
        try {
            // 1. Kreye yon objè FormData pou ka jere fichye yo
            const formData = new FormData();

            // 2. Ajoute chan tèks yo ladan l
            formData.append('username', payload.username);
            if (payload.bio) {
                formData.append('bio', payload.bio);
            }
            formData.append('location', payload.location);
            formData.append('lat', String(payload.lat));
            formData.append('lng', String(payload.lng));
            formData.append('phone', payload.phone);


            if (payload.documents && payload.documents.length > 0) {
                payload.documents.forEach((file) => {
                    formData.append('documents', file);
                });
            } else {
                throw new Error("Ou dwe chwazi omwen yon dokiman validasyon.");
            }
            console.log(Object.fromEntries(formData.entries()));
            // 4. Voye requet la bay backend la ak Headers multipart/form-data
            const res = await api.patch<User>('/auth/become-seller', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // 5. Mete eta user a ajou ak nouvo pwofil la
            setUser(res.data);

        } catch (error: any) {
            throw error.response?.data || { message: error.message || "Erè ajou wòl itilizatè." };
        }
    };

    const logout = () => {
        // localStorage.removeItem('lky');
        // setUser(null);
        // window.location.href = '/auth';
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            becomeSeller,
            loginWithGoogle,
            confirmEmail,
            forgotPassword,
            resetPassword,
            requestEmailConfirmation
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth dwe itilize anndan yon AuthProvider');
    return context;
};