"use client";

import { create } from "zustand";
import type { BusinessModel } from "@/domain/model/types";
import { createEmptyModel, SCHEMA_VERSION, createId } from "@/domain/model/defaults";
import { MODEL_TEMPLATES } from "@/domain/model/templates";
import {
  allModels,
  putModel,
  deleteModel as dbDelete,
  clearModels,
  type StoredModel,
} from "@/infrastructure/persistence/db";

interface ModelStoreState {
  models: BusinessModel[];
  hydrated: boolean;
  activeModelId: string | null;
}

interface ModelStoreActions {
  hydrate: () => Promise<void>;
  ensureSeeded: () => Promise<void>;
  setActiveModel: (id: string | null) => void;
  getModel: (id: string | null | undefined) => BusinessModel | undefined;
  createFromTemplate: (
    templateId: string,
    name?: string
  ) => Promise<BusinessModel>;
  createBlank: (name: string, businessType: BusinessModel["businessType"]) => Promise<BusinessModel>;
  updateModel: (id: string, updater: (model: BusinessModel) => void) => Promise<void>;
  replaceModel: (model: BusinessModel) => Promise<void>;
  duplicateModel: (id: string) => Promise<BusinessModel | null>;
  archiveModel: (id: string, archived: boolean) => Promise<void>;
  removeModel: (id: string) => Promise<void>;
  resetAll: () => Promise<void>;
}

function touch(model: BusinessModel): BusinessModel {
  return {
    ...model,
    metadata: { ...model.metadata, updatedAt: new Date().toISOString() },
  };
}

/** Automatically detects and removes race-condition duplicate seed models from IndexedDB. */
function deduplicateStoredModels(stored: StoredModel[]): StoredModel[] {
  const seenIds = new Set<string>();
  const seenSeedTypes = new Set<string>();
  const unique: StoredModel[] = [];
  const duplicateIdsToRemove: string[] = [];

  for (const s of stored) {
    // Exact ID collision
    if (seenIds.has(s.id)) {
      duplicateIdsToRemove.push(s.id);
      continue;
    }
    seenIds.add(s.id);

    // Duplicate starter seed template check
    const isSeed =
      (s.name === "SaaS Product" && s.model.businessType === "subscription-saas") ||
      (s.name === "Digital Product" && s.model.businessType === "one-time-product") ||
      (s.name === "Enterprise Product" && s.model.businessType === "b2b-enterprise");

    if (isSeed) {
      if (seenSeedTypes.has(s.model.businessType)) {
        duplicateIdsToRemove.push(s.id);
        continue;
      }
      seenSeedTypes.add(s.model.businessType);
    }

    unique.push(s);
  }

  // Cleanup removed duplicate records from local IndexedDB
  if (duplicateIdsToRemove.length > 0) {
    for (const dupId of duplicateIdsToRemove) {
      void dbDelete(dupId);
    }
  }

  return unique;
}

let hydratingPromise: Promise<void> | null = null;

export const useModelStore = create<ModelStoreState & ModelStoreActions>()(
  (set, get) => ({
    models: [],
    hydrated: false,
    activeModelId: null,

    hydrate: async () => {
      if (get().hydrated) return;
      if (hydratingPromise) return hydratingPromise;

      hydratingPromise = (async () => {
        const stored = await allModels();
        if (stored.length === 0) {
          await get().ensureSeeded();
          return;
        }

        const uniqueStored = deduplicateStoredModels(stored);
        const models = uniqueStored.map((s) => s.model);

        set({
          models,
          hydrated: true,
          activeModelId: models[0]?.id ?? null,
        });
      })().finally(() => {
        hydratingPromise = null;
      });

      return hydratingPromise;
    },

    ensureSeeded: async () => {
      const seeded = MODEL_TEMPLATES.map((t) => {
        const m = t.build();
        m.id = `seed_${t.id.replace(/-/g, "_")}`;
        return m;
      });
      for (const model of seeded) {
        await putModel(model);
      }
      set({
        models: seeded,
        hydrated: true,
        activeModelId: seeded[0]?.id ?? null,
      });
    },

    setActiveModel: (activeModelId) => set({ activeModelId }),

    getModel: (id) => get().models.find((m) => m.id === id),

    createFromTemplate: async (templateId, name) => {
      const template = MODEL_TEMPLATES.find((t) => t.id === templateId);
      const model = template
        ? template.build()
        : createEmptyModel({
            name: name ?? "Untitled model",
            businessType: "custom",
          });
      model.id = createId("model");
      if (name) model.name = name;
      await putModel(model);
      set((state) => ({
        models: [model, ...state.models],
        activeModelId: model.id,
      }));
      return model;
    },

    createBlank: async (name, businessType) => {
      const model = createEmptyModel({ name, businessType });
      await putModel(model);
      set((state) => ({
        models: [model, ...state.models],
        activeModelId: model.id,
      }));
      return model;
    },

    updateModel: async (id, updater) => {
      const current = get().models.find((m) => m.id === id);
      if (!current) return;
      const draft: BusinessModel = structuredClone(current);
      updater(draft);
      const updated = touch({
        ...draft,
        schemaVersion: SCHEMA_VERSION,
      });
      await putModel(updated);
      set((state) => ({
        models: state.models.map((m) => (m.id === id ? updated : m)),
      }));
    },

    replaceModel: async (model) => {
      const updated = touch(model);
      await putModel(updated);
      set((state) => ({
        models: state.models.map((m) => (m.id === updated.id ? updated : m)),
      }));
    },

    duplicateModel: async (id) => {
      const source = get().models.find((m) => m.id === id);
      if (!source) return null;
      const now = new Date().toISOString();
      const copy: BusinessModel = structuredClone(source);
      copy.id = createId("model");
      copy.name = `${source.name} copy`;
      copy.metadata = {
        ...copy.metadata,
        createdAt: now,
        updatedAt: now,
        archived: false,
      };
      // Fresh ids so scenarios and streams never collide.
      copy.revenueStreams = copy.revenueStreams.map((s) => ({
        ...s,
        id: createId("rev"),
      }));
      await putModel(copy);
      set((state) => ({ models: [copy, ...state.models] }));
      return copy;
    },

    archiveModel: async (id, archived) => {
      await get().updateModel(id, (m) => {
        m.metadata.archived = archived;
      });
    },

    removeModel: async (id) => {
      await dbDelete(id);
      set((state) => {
        const models = state.models.filter((m) => m.id !== id);
        return {
          models,
          activeModelId:
            state.activeModelId === id ? (models[0]?.id ?? null) : state.activeModelId,
        };
      });
    },

    resetAll: async () => {
      await clearModels();
      set({ models: [], activeModelId: null });
      await get().ensureSeeded();
    },
  })
);
