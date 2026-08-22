import { DebtLoan } from "../model/types";
import { Decimal } from "../primitives/money";

export interface LoanPayment {
  monthIndex: number;
  payment: Decimal;
  interest: Decimal;
  principal: Decimal;
  remainingBalance: Decimal;
}

export interface LoanSchedule {
  loanId: string;
  monthlyPayment: Decimal;
  totalInterest: Decimal;
  totalRepayment: Decimal;
  payments: LoanPayment[];
}

/**
 * Standard amortizing loan schedule with monthly compounding.
 * A zero interest loan divides principal evenly across the term.
 */
export function amortizeLoan(loan: DebtLoan): LoanSchedule {
  const term = Math.max(1, Math.round(loan.termMonths));
  const principal = Decimal.max(0, new Decimal(loan.principal));
  const monthlyRate = Decimal.max(0, new Decimal(loan.annualInterestRatePercent))
    .dividedBy(100)
    .dividedBy(12);

  let monthlyPayment: Decimal;
  if (monthlyRate.isZero()) {
    monthlyPayment = principal.dividedBy(term);
  } else {
    const factor = new Decimal(1)
      .plus(monthlyRate)
      .pow(-term);
    monthlyPayment = principal.times(monthlyRate).dividedBy(new Decimal(1).minus(factor));
  }

  const payments: LoanPayment[] = [];
  let balance = principal;
  let totalInterest = new Decimal(0);

  for (let i = 0; i < term; i += 1) {
    const interest = balance.times(monthlyRate);
    let principalPart = monthlyPayment.minus(interest);
    if (principalPart.greaterThan(balance)) {
      principalPart = balance;
    }
    balance = balance.minus(principalPart).toDecimalPlaces(10);
    const payment = interest.plus(principalPart);
    totalInterest = totalInterest.plus(interest);
    payments.push({
      monthIndex: i,
      payment,
      interest,
      principal: principalPart,
      remainingBalance: Decimal.max(0, balance),
    });
  }

  return {
    loanId: loan.id,
    monthlyPayment,
    totalInterest,
    totalRepayment: principal.plus(totalInterest),
    payments,
  };
}

/** Debt service due at a given model month index across all loans. */
export function debtServiceForMonth(
  loans: DebtLoan[],
  schedules: Map<string, LoanSchedule>,
  monthIndex: number
): Decimal {
  let total = new Decimal(0);
  for (const loan of loans) {
    const schedule = schedules.get(loan.id);
    if (!schedule) continue;
    const offset = Math.max(0, loan.startMonth);
    const within = monthIndex - offset;
    if (within >= 0 && within < schedule.payments.length) {
      total = total.plus(schedule.payments[within].payment);
    }
  }
  return total;
}

/** Principal amounts landing in cash at a given month index. */
export function debtInflowForMonth(
  loans: DebtLoan[],
  monthIndex: number
): Decimal {
  return loans
    .filter((l) => Math.max(0, l.startMonth) === monthIndex)
    .reduce((acc, l) => acc.plus(Math.max(0, l.principal)), new Decimal(0));
}
