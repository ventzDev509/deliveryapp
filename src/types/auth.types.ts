export interface Profile {
    id: string;
    username: string | null;
    avatarUrl: string | null;
    bannerUrl: string | null;
    bio: string | null;
    location: string | null;
    isSeller: boolean;
    userId: string;
    updatedAt: Date;
}

export interface User {
    id: string;
    email: string;
    name?: string;
    role: 'CUSTOMER' | 'RESTAURANT_OWNER' | 'ADMIN';
    isEmailConfirmed: boolean;
    profile: Profile | null;
    provider?: string | null;
}

export interface AuthResponse {
    success: boolean;
    message?: string;
    token?: string;
    user?: User;
}

export interface BecomeSellerPayload {
  username: string;
  bio?: string;
  location: string;
  lat: number;
  lng: number;
  phone: string;
  documentUrl: string;
}


// Kalite pou sa AuthContext a voye bay konpozan yo
export interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: any) => Promise<AuthResponse>;
    register: (data: any) => Promise<AuthResponse>;
    logout: () => void;
    becomeSeller: (payload:BecomeSellerPayload) => Promise<void>;
    loginWithGoogle: () => void;
    confirmEmail: (token: string) => Promise<AuthResponse>;
    forgotPassword: (email: string) => Promise<AuthResponse>;
    resetPassword: (token: string, newPassword: string) => Promise<AuthResponse>;
    requestEmailConfirmation: (email:string) => Promise<AuthResponse>
}