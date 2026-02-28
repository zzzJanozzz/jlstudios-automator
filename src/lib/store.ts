// src/lib/store.ts
import { create } from "zustand";
import { AppState, BusinessData, DesignSystem, ExtractedItem, ContactInfo } from "./types";

let itemCounter = 1000;
function newId(): string { return `item_${++itemCounter}`; }

export const useAppStore = create<AppState>((set, get) => ({
  step: "upload", niche: null, uploadedFiles: [], businessData: null,
  isProcessing: false, error: null,

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
          items: state.businessData.items.map(item =>
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
      return { businessData: { ...state.businessData, [field]: value } };
    }),

  addItem: (category: string) =>
    set((state) => {
      if (!state.businessData) return state;
      const { NICHE_CONFIGS } = require("./types");
      const itemLabel = NICHE_CONFIGS[state.businessData.niche]?.itemLabel || "ítem";
      const newItem: ExtractedItem = {
        id: newId(),
        name: `Nuevo ${itemLabel}`,
        description: "",
        price: null,
        category,
      };
      return {
        businessData: {
          ...state.businessData,
          items: [...state.businessData.items, newItem],
        },
      };
    }),

  removeItem: (id: string) =>
    set((state) => {
      if (!state.businessData) return state;
      return {
        businessData: {
          ...state.businessData,
          items: state.businessData.items.filter(it => it.id !== id),
        },
      };
    }),

  addCategory: (name: string) =>
    set((state) => {
      if (!state.businessData) return state;
      if (state.businessData.categories.includes(name)) return state;
      return {
        businessData: {
          ...state.businessData,
          categories: [...state.businessData.categories, name],
        },
      };
    }),

  removeCategory: (name: string) =>
    set((state) => {
      if (!state.businessData) return state;
      return {
        businessData: {
          ...state.businessData,
          categories: state.businessData.categories.filter(c => c !== name),
          items: state.businessData.items.filter(it => it.category !== name),
        },
      };
    }),

  setProcessing: (v) => set({ isProcessing: v }),
  setError: (e) => set({ error: e }),

  reset: () =>
    set({
      step: "upload", niche: null, uploadedFiles: [],
      businessData: null, isProcessing: false, error: null,
    }),
}));
