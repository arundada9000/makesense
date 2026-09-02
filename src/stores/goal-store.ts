"use client";

import { create } from "zustand";
import type { GoalInput, SavingsGoal } from "@/domain/goals/types";
import { createId } from "@/domain/model/defaults";
import {
  allGoals,
  putGoal,
  deleteGoal as dbDelete,
  clearGoals,
} from "@/infrastructure/persistence/db";

interface GoalStoreState {
  goals: SavingsGoal[];
  hydrated: boolean;
}

interface GoalStoreActions {
  hydrate: () => Promise<void>;
  createGoal: (input: GoalInput) => Promise<SavingsGoal>;
  updateGoal: (id: string, patch: Partial<GoalInput>) => Promise<void>;
  removeGoal: (id: string) => Promise<void>;
  resetAll: () => Promise<void>;
}

let hydratingPromise: Promise<void> | null = null;

export const useGoalStore = create<GoalStoreState & GoalStoreActions>()(
  (set, get) => ({
    goals: [],
    hydrated: false,

    hydrate: async () => {
      if (get().hydrated) return;
      if (hydratingPromise) return hydratingPromise;

      hydratingPromise = allGoals()
        .then((stored) => {
          set({
            goals: stored.map((s) => s.goal),
            hydrated: true,
          });
        })
        .finally(() => {
          hydratingPromise = null;
        });

      return hydratingPromise;
    },

    createGoal: async (input) => {
      const now = new Date().toISOString();
      const goal: SavingsGoal = {
        id: createId("goal"),
        name: input.name.trim() || "Untitled goal",
        targetAmount: Math.max(0, input.targetAmount),
        currentSavings: Math.max(0, input.currentSavings),
        monthlyIncome: Math.max(0, input.monthlyIncome),
        monthlyExpenses: Math.max(0, input.monthlyExpenses),
        createdAt: now,
        updatedAt: now,
      };
      await putGoal(goal);
      set((state) => ({ goals: [goal, ...state.goals] }));
      return goal;
    },

    updateGoal: async (id, patch) => {
      const current = get().goals.find((g) => g.id === id);
      if (!current) return;
      const updated: SavingsGoal = {
        ...current,
        ...patch,
        updatedAt: new Date().toISOString(),
      };
      await putGoal(updated);
      set((state) => ({
        goals: state.goals.map((g) => (g.id === id ? updated : g)),
      }));
    },

    removeGoal: async (id) => {
      await dbDelete(id);
      set((state) => ({
        goals: state.goals.filter((g) => g.id !== id),
      }));
    },

    resetAll: async () => {
      await clearGoals();
      set({ goals: [], hydrated: true });
    },
  })
);