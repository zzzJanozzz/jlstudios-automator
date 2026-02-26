// src/lib/store.ts
import { create } from "zustand";
import { AppState, BusinessData, DesignSystem, ExtractedItem, ContactInfo, Niche } from "./types";

export const useAppStore = create<AppState>((set) => ({
  step:           "upload",
  niche:          null,
  uploadedFiles:  [],
  businessData:   null,
  isProcessing:   false,
  error:          null,

  setStep:  (step)  => set({ step }),
  setNiche: (niche) => set({ niche }),
  setUploadedFiles: (files) => set({ uploadedFiles: files }),

  setBusinessData: (data) =>
    set({ businessData: data, step: "editing", isProcessing: false }),

  updateDesignSystem: (updates: Partial<DesignSystem>) =>
    set((state) => {
      if (!state.businessData) return state;
      return {
        businessData: {
          ...state.businessData,
          designSystem: { ...state.businessData.designSystem, ...updates },
        },
      };
    }),

  updateItem: (id: string, updates: Partial<ExtractedItem>) =>
    set((state) => {
      if (!state.businessData) return state;
      return {
        businessData: {
          ...state.businessData,
          items: state.businessData.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        },
      };
    }),

  updateContactInfo: (updates: Partial<ContactInfo>) =>
    set((state) => {
      if (!state.businessData) return state;
      return {
        businessData: {
          ...state.businessData,
          contactInfo: { ...state.businessData.contactInfo, ...updates },
        },
      };
    }),

  updateBusinessField: (field: keyof BusinessData, value: unknown) =>
    set((state) => {
      if (!state.businessData) return state;
      return {
        businessData: { ...state.businessData, [field]: value },
      };
    }),

  setProcessing: (v) => set({ isProcessing: v }),
  setError:      (e) => set({ error: e }),

  reset: () =>
    set({
      step:          "upload",
      niche:         null,
      uploadedFiles: [],
      businessData:  null,
      isProcessing:  false,
      error:         null,
    }),
}));
