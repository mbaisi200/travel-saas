import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean
  bottomSheet: { open: boolean; content: string | null }
  toggleSidebar: () => void
  openBottomSheet: (content: string) => void
  closeBottomSheet: () => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  bottomSheet: { open: false, content: null },
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  openBottomSheet: (content) => set({ bottomSheet: { open: true, content } }),
  closeBottomSheet: () => set({ bottomSheet: { open: false, content: null } }),
}))
