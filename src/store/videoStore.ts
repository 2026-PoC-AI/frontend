import { create } from 'zustand';

interface FrameAnalysis {
    frameNumber: number;
    timestamp: number;
    confidence: number;
    anomalyRegions: {
        x: number;
        y: number;
        width: number;
        height: number;
        type: string;
    }[];
}

interface DetectedTechnique {
    name: string;
    confidence: number;
    icon: string;
}

interface VideoResults {
    isDeepfake: boolean;
    confidenceScore: number;
    detectedTechniques: DetectedTechnique[];
    frameAnalyses: FrameAnalysis[];
    metadata: {
        duration: number;
        fps: number;
        resolution: string;
        codec: string;
    };
}

interface VideoState {
    results: VideoResults | null;
    isPlaying: boolean;
    isMuted: boolean;
    currentTime: number;
    hoveredFrame: number | null;
    setResults: (results: VideoResults) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    setIsMuted: (isMuted: boolean) => void;
    setCurrentTime: (time: number) => void;
    setHoveredFrame: (frame: number | null) => void;
    reset: () => void;
}

export const useVideoStore = create<VideoState>((set) => ({
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