import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
    api_key: string;
    setApiKey: (api_key: string) => void;
}

export const useSettingsStore = create<SettingsState>()(persist(
    (set) => ({
        api_key: '',
        setApiKey: (api_key: string) => set({ api_key })
    }),
    {
        name: 'key-storage',
    })
)
