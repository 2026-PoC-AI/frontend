// src/store/image/imageStore.js
import { create } from "zustand";
export const useImageStore = create((set,get) => ({
  file: null,
  previewUrl: null,
  isAnalyzing: false,
  analysisId: null,
  result: null,
  report: null,
  isReportLoading: false,
  reportError: null,
  step: "upload",
  artifacts: null,

  setStep: (step) => set({ step }),

  setFile: (file, previewUrl) =>
    set({ file, previewUrl }),

  clearFile: () =>
    set({
      file: null,
      previewUrl: null,
      analysisId: null,
      result: null,
      report: null,
      isReportLoading: false,
      reportError: null,
      step: "upload",
      isAnalyzing: false,
    }),

  setAnalyzing: (value) =>
    set({ isAnalyzing: value }),

  setAnalysisId: (id) =>
    set({ analysisId: id }),

  setResult: (r) =>
    set({ result: r }),

  setReport: (report) => set({ report }),
  setReportLoading: (v) => set({ isReportLoading: v }),
  setReportError: (e) => set({ reportError: e }),

  addToHistoryFromResult: () => {
    const r = get().result;
    if (!r?.job?.jobUuid) return;

    const list = JSON.parse(
      localStorage.getItem("fakehunters:image:jobUuids") || "[]"
    );

    if (!list.includes(r.job.jobUuid)) {
      localStorage.setItem(
        "fakehunters:image:jobUuids",
        JSON.stringify([r.job.jobUuid, ...list])
      );
    }
  },
}));