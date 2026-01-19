// src/store/image/imageStore.js
import { create } from "zustand";

export const useImageStore = create((set) => ({
  file: null,
  previewUrl: null,
  isAnalyzing: false,
  analysisId: null,
  result: null,

  step: "upload",

  setStep: (step) => set({ step }),

  setFile: (file, previewUrl) =>
    set({ file, previewUrl }),

  clearFile: () =>
    set({
      file: null,
      previewUrl: null,
      analysisId: null,
      result: null,
      step: "upload",
      isAnalyzing: false,
    }),

  setAnalyzing: (value) =>
    set({ isAnalyzing: value }),

  setAnalysisId: (id) =>
    set({ analysisId: id }),

  setResult: (r) =>
    set({ result: r }),
}));