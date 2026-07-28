export interface WorkingHour {
  id?: string;
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  
}

export interface Profile {
  id?: string;
  userId: string;
  username?: string;
  lat?: number;
  lng?: number;
  location?: string;
  workingHours?: WorkingHour[];
  [key: string]: any;


}

export interface ProfileContextType {
  profile: Profile | null;
  loading: boolean;
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (userId: string, data: any) => Promise<any>;
  updateProfileImages: (userId: string, profileImage?: File, bannerImage?: File) => Promise<any>;
  updateWorkingHours: (hours: Array<{ day: string; isOpen: boolean; openTime: string; closeTime: string }>) => Promise<any>; // <--- Ajoute sa a
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
}