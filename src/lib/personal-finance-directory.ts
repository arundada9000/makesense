export interface PersonalFinanceEntry {
  slug: string;
  name: string;
  tagline: string;
  question: string;
}

/** Single source of truth for the personal finance calculator directory. */
export const PERSONAL_FINANCE_DIRECTORY: PersonalFinanceEntry[] = [
  {
    slug: "/personal-finance/salary-calculator",
    name: "Salary calculator",
    tagline: "Hourly, daily, weekly, monthly and yearly income",
    question: "How much do I really earn each year?",
  },
  {
    slug: "/personal-finance/savings-goal-calculator",
    name: "Savings goal",
    tagline: "Time to reach a goal at your current savings",
    question: "When can I afford what I want?",
  },
  {
    slug: "/personal-finance/income-expense-calculator",
    name: "Income vs expenses",
    tagline: "Surplus, deficit and savings rate each month",
    question: "Where does my money go?",
  },
  {
    slug: "/personal-finance/emergency-fund-calculator",
    name: "Emergency fund",
    tagline: "Months of cover and how long to build it",
    question: "How much should I set aside?",
  },
];