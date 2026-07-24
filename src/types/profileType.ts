export interface Profile {
  id?: string;
  userId: string;
  username?: string;
  lat?: number;
  lng?: number;
  [key: string]: any;
}

export interface ProfileContextType {
  profile: Profile | null;
  loading: boolean;
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (userId: string, data: any) => Promise<any>;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
}