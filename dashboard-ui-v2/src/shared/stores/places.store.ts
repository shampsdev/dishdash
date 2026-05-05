import { Tag } from "@/interfaces/place.interface";
import { create } from "zustand";

interface DashboardState {
    tags: Tag[];
    setTags: (tags: Tag[]) => void;
}

export const useDashboardStore = create<DashboardState>()(
    (set) => ({
        tags: [],
        setTags: (tags: Tag[]) => set({ tags })
    }),
)
