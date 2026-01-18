import { create } from "zustand";

export const useImageStore = create((set) => ({
  file: null,
  previewUrl: null,
  isAnalyzing: false,
  result: null,

  setFile: (file, previewUrl) =>
    set({ file, previewUrl }),

  clearFile: () =>
    set({ file: null, previewUrl: null, result: null }),

  setAnalyzing: (value) =>
    set({ isAnalyzing: value }),

  setResult: (result) =>
    set({ result }),
}));
