import { create } from 'zustand';

interface AuthState {
  token: string | null;
  userId: number | null;
  email: string | null;
  nickname: string | null;
  role: string | null;
  login: (token: string, user: {
    id: number; email: string; nickname: string; role: string;
  }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  userId: localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null,
  email: localStorage.getItem('email'),
  nickname: localStorage.getItem('nickname'),
  role: localStorage.getItem('role'),
  login: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', String(user.id));
    localStorage.setItem('email', user.email);
    localStorage.setItem('nickname', user.nickname);
    localStorage.setItem('role', user.role);
    set({ token, userId: user.id, email: user.email, nickname: user.nickname, role: user.role });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('nickname');
    localStorage.removeItem('role');
    set({ token: null, userId: null, email: null, nickname: null, role: null });
  },
}));
