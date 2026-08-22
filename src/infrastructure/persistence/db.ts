"use client";

import Dexie, { type Table } from "dexie";
import type { BusinessModel } from "@/domain/model/types";
import { SCHEMA_VERSION } from "@/domain/model/defaults";

export interface StoredModel {
  id: string;
  name: string;
  updatedAt: string;
  archived: boolean;
  model: BusinessModel;
}

class MakeSenseDatabase extends Dexie {
  models!: Table<StoredModel, string>;

  constructor() {
    super("makesense");
    this.version(1).stores({
      models: "id, name, updatedAt, archived",
    });
  }
}

let dbInstance: MakeSenseDatabase | null = null;

export function getDb(): MakeSenseDatabase {
  if (!dbInstance) dbInstance = new MakeSenseDatabase();
  return dbInstance;
}

export async function allModels(): Promise<StoredModel[]> {
  if (typeof window === "undefined") return [];
  return getDb().models.orderBy("updatedAt").reverse().toArray();
}

export async function putModel(model: BusinessModel): Promise<void> {
  await getDb().models.put({
    id: model.id,
    name: model.name,
    updatedAt: model.metadata.updatedAt,
    archived: model.metadata.archived,
    model,
  });
}

export async function deleteModel(id: string): Promise<void> {
  await getDb().models.delete(id);
}

export async function clearModels(): Promise<void> {
  await getDb().models.clear();
}

/**
 * Validates and migrates an imported model. Unknown schema versions are
 * rejected with a reason rather than silently loaded.
 */
export function validateImportedModel(raw: unknown):
  | { ok: true; model: BusinessModel }
  | { ok: false; error: string } {
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, error: "The file does not contain a model object." };
  }
  const candidate = raw as Record<string, unknown>;
  const version = candidate.schemaVersion;
  if (version !== SCHEMA_VERSION) {
    return {
      ok: false,
      error: `Unsupported schema version ${String(version)}. This build supports version ${SCHEMA_VERSION}.`,
    };
  }
  const requiredKeys: Array<keyof BusinessModel> = [
    "id",
    "name",
    "businessType",
    "baseCurrency",
    "revenueStreams",
    "customers",
    "taxProfile",
    "financing",
    "projectionSettings",
    "metadata",
  ];
  for (const key of requiredKeys) {
    if (!(key in candidate)) {
      return { ok: false, error: `Missing required field "${key}".` };
    }
  }
  // Structural sanity before trusting the file.
  if (!Array.isArray(candidate.revenueStreams)) {
    return { ok: false, error: "revenueStreams must be an array." };
  }
  return { ok: true, model: raw as unknown as BusinessModel };
}
