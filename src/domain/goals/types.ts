export interface SavingsGoal {
  id: string;
  name: string;
  /** Amount the user wants to be able to spend or hold. */
  targetAmount: number;
  /** Money already set aside for this goal. */
  currentSavings: number;
  /** Take-home income per month. */
  monthlyIncome: number;
  /** Fixed monthly spending. */
  monthlyExpenses: number;
  createdAt: string;
  updatedAt: string;
}

export type GoalInput = Pick<
  SavingsGoal,
  "name" | "targetAmount" | "currentSavings" | "monthlyIncome" | "monthlyExpenses"
>;