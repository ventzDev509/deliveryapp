export interface PendingSellerRequest {
    id: string;
    username: string;
    phone: string;
    location: string;
    lat: number;
    lng: number;
    bio?: string;
    documentUrl: string;
    createdAt: string;
    user: {
        id: string;
        email: string;
        fullName?: string;
    };
}