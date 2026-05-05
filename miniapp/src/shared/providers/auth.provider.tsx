import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { User } from '@/shared/interfaces/user.interface';
import { createUser, getUser } from '../api/auth.api';
import { cloudStorage, initData } from '@telegram-apps/sdk-react';
import { setInitData } from '../initDataToken';

export interface AuthState {
  user: User | null;
}

export interface AuthActions {
  logoutUser: () => Promise<void>;
}

export const AuthContext = createContext<
  (AuthState & AuthActions & { ready: boolean }) | undefined
>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

const initialState: AuthState = {
  user: null,
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [store, setStore] = useState<AuthState>(initialState);
  const [ready, setReady] = useState(false);

  const updateUser = async (partialUser: Omit<User, 'id' | 'createdAt'>) => {
    try {
      const newUser = await createUser(partialUser);
      if (!newUser) {
        console.error('Error: Failed to create or fetch user.');
        return;
      }
      setStore((prev) => ({ ...prev, user: newUser }));
    } catch (error) {
      console.error('updateUser error:', error);
    }
  };

  const logoutUser = async () => {
    try {
      await cloudStorage.setItem('auth', '');
      setStore(initialState);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    const restoreFromStorage = async () => {
      try {
        const raw = initData.raw?.();
        if (raw) setInitData(raw);

        const storedRaw = await cloudStorage.getItem('auth');
        const storedState: AuthState | null =
          typeof storedRaw === 'string' ? JSON.parse(storedRaw) : null;

        if (storedState?.user) {
          const user = await getUser(storedState.user.id);
          if (user) {
            setStore({ ...storedState, user });
          }
        }
      } catch (err) {
        console.warn('Failed to restore auth state:', err);
      } finally {
        setReady(true);
      }
    };

    restoreFromStorage();
  }, []);

  useEffect(() => {
    if (!ready) return;

    const tgUser = initData.user?.();
    if (!store.user && tgUser) {
      updateUser({
        name: tgUser.first_name ?? tgUser.username ?? 'Anonymous',
        avatar: tgUser.photo_url ?? '',
        telegram: tgUser.id
      });
    }
  }, [ready, store.user]);

  useEffect(() => {
    if (!ready) return;

    const persist = async () => {
      try {
        await cloudStorage.setItem('auth', JSON.stringify(store));
      } catch (error) {
        console.error('Persisting auth failed:', error);
      }
    };

    persist();
  }, [store, ready]);

  return (
    <AuthContext.Provider
      value={{ ...store, ready, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
