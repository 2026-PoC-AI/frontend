import { create } from 'zustand';

export const useVideoStore = create((set) => ({
    results: null,
    isPlaying: false,
    isMuted: false,
    currentTime: 0,
    hoveredFrame: null,
    setResults: (results) => set({ results }),
    setIsPlaying: (isPlaying) => set({ isPlaying }),
    setIsMuted: (isMuted) => set({ isMuted }),
    setCurrentTime: (currentTime) => set({ currentTime }),
    setHoveredFrame: (hoveredFrame) => set({ hoveredFrame }),
    reset: () => set({
        results: null,
        isPlaying: false,
        isMuted: false,
        currentTime: 0,
        hoveredFrame: null,
    }),
}));