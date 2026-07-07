import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { PendingSellerRequest } from '../types/admin.types';
import api from './api/axios';

interface AdminContextType {
    requests: PendingSellerRequest[];
    loading: boolean;
    fetchPendingRequests: () => Promise<void>;
    approveSeller: (profileId: string) => Promise<void>;
    rejectSeller: (profileId: string, reason: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
    children: ReactNode;
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
    const [requests, setRequests] = useState<PendingSellerRequest[]>([]);
    const [loading, setLoading] = useState(false);

    // 1. Rale tout demand machann ki annatant (PENDING) yo nan backend lan
    const fetchPendingRequests = async () => {
        setLoading(true);
        try {
            // Rele endpoint NestJS la: GET /admin/pending-sellers
            const response = await api.get<PendingSellerRequest[]>('/admin/pending-sellers');
            setRequests(response.data);
        } catch (error: any) {
            console.error("Erè lè n ap chaje demand yo nan sèvè a:", error);
            
            // 💡 Ti sekirite pou tès: Si API a bay erè (paske sèvè a fèmen), nou mete done simulation
            if (requests.length === 0) {
                const mockData: PendingSellerRequest[] = [
                    {
                        id: "req-101",
                        username: "Griot Lakay",
                        phone: "+509 3737-1234",
                        location: "Pétion-Ville, Rue Panamericaine",
                        lat: 18.512345,
                        lng: -72.284567,
                        bio: "Nou fè pi bon griot ak banann peze nan zòn lan.",
                        documentUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                        createdAt: "2026-07-06T14:30:00Z",
                        user: { id: "u-99", email: "griotlakay@gmail.com", fullName: "Jean Jean" }
                    }
                ];
                setRequests(mockData);
            }
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // 2. Apwouve yon demand: PUT /admin/sellers/:id/approve
    const approveSeller = async (profileId: string) => {
        try {
            await api.put(`/admin/sellers/${profileId}/approve`);
            
            // Retire l nan lis la depi backend lan reponn 200 OK
            setRequests((prev) => prev.filter((req) => req.id !== profileId));
        } catch (error: any) {
            console.error("Erè pandan apwobasyon an nan backend:", error);
            throw error;
        }
    };

    // 3. Refize yon demand ak yon rezon: PUT /admin/sellers/:id/reject
    const rejectSeller = async (profileId: string, reason: string) => {
        try {
            // Voye rezon an nan kò rekèt la (body)
            await api.put(`/admin/sellers/${profileId}/reject`, { reason });
            
            // Retire l nan lis la tou
            setRequests((prev) => prev.filter((req) => req.id !== profileId));
        } catch (error: any) {
            console.error("Erè lè n ap refize demand la nan backend:", error);
            throw error;
        }
    };

    // Chaje demand yo otomatikman lè modil la monte si sa nesesè
    useEffect(() => {
        fetchPendingRequests().catch(() => {});
    }, []);

    return (
        <AdminContext.Provider value={{ requests, loading, fetchPendingRequests, approveSeller, rejectSeller }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin dwe itilize anndan yon AdminProvider');
    }
    return context;
};