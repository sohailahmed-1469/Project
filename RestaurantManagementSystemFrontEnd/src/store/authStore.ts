import { create } from 'zustand';
import { authAPI } from '../services/api'; // Assuming you have an authAPI service

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userEmail: string | null;
  userRole: string | null;
  isAuthenticated: boolean;
  userProfileImage: string | null;
  setUserProfileImage: (imageUrl: string) => void;
  login: (email: string, password: string) => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  userEmail: localStorage.getItem('userEmail') || null,
  userRole: localStorage.getItem('userRole') || null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  userProfileImage: localStorage.getItem('userProfileImage') || null,

  setUserProfileImage: (imageUrl) => {
    localStorage.setItem('userProfileImage', imageUrl); 
    set({ userProfileImage: imageUrl });
  },

  login: async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });

      if (!response || typeof response !== 'object') {
        throw new Error('Invalid response from server');
      }

      const { accessToken, refreshToken, email: userEmail, role: userRole, profileImage } = response;

      if (!accessToken || !refreshToken || !userEmail || !userRole) {
        throw new Error('Missing required authentication fields');
      }

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userEmail', userEmail);
      localStorage.setItem('userRole', userRole);
      if (profileImage) {
        localStorage.setItem('userProfileImage', profileImage);
      }

      set({ 
        accessToken, 
        refreshToken, 
        userEmail, 
        userRole, 
        isAuthenticated: true,
        userProfileImage: profileImage || null 
      });

    } catch (error) {
      console.error('Login failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Login failed. Please try again.');
    }
  },

  refreshAccessToken: async () => {
    try {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      if (!storedRefreshToken) throw new Error('No refresh token found. Please log in again.');

      const response = await authAPI.refreshToken({ refreshToken: storedRefreshToken });

      if (!response || !response.accessToken) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('accessToken', response.accessToken);
      set({ accessToken: response.accessToken, isAuthenticated: true });
    } catch (error) {
      console.error('Token refresh failed:', error);
      localStorage.clear();
      set({ 
        accessToken: null, 
        refreshToken: null, 
        userEmail: null, 
        userRole: null, 
        isAuthenticated: false,
        userProfileImage: null  
      });
      throw new Error('Session expired, please log in again.');
    }
  },

  logout: () => {
    localStorage.clear();
    set({ 
      accessToken: null, 
      refreshToken: null, 
      userEmail: null, 
      userRole: null, 
      isAuthenticated: false,
      userProfileImage: null 
    });
  },
}));
