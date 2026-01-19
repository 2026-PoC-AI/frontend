// src/store/image/imageStore.js
import { create } from "zustand";
import {
  loadImageHistory,
  pushImageHistory,
  removeImageHistory,
  clearImageHistory,
} from "../../features/image/history/imageHistory";

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
  history: loadImageHistory(),

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

    const analysis = r?.results?.[0];
    const entry = {
      jobUuid: r.job.jobUuid,
      createdAt: r.job.createdAt,
      filename: r.input?.filename ?? "unknown",
      status: r.job.status ?? "—",
      label: analysis?.label ?? "—",
      riskLevel: analysis?.riskLevel ?? "—",
      riskScore: analysis?.riskScore ?? 0,
    };

    const next = pushImageHistory(entry);
    set({ history: next });
  },

  removeHistory: (jobUuid) => {
    const next = removeImageHistory(jobUuid);
    set({ history: next });
  },

  clearHistory: () => {
    const next = clearImageHistory();
    set({ history: next });
  },
}));