export type CurrencyCode =
  | "NPR"
  | "USD"
  | "EUR"
  | "GBP"
  | "INR"
  | "AUD"
  | "CAD"
  | "JPY"
  | "CNY";

export interface CurrencyInfo {
  readonly code: CurrencyCode;
  readonly name: string;
  readonly symbol: string;
  readonly decimals: number;
}

export const CURRENCIES: Readonly<Record<CurrencyCode, CurrencyInfo>> = {
  NPR: { code: "NPR", name: "Nepalese Rupee", symbol: "Rs.", decimals: 2 },
  USD: { code: "USD", name: "US Dollar", symbol: "$", decimals: 2 },
  EUR: { code: "EUR", name: "Euro", symbol: "\u20AC", decimals: 2 },
  GBP: { code: "GBP", name: "British Pound", symbol: "\u00A3", decimals: 2 },
  INR: { code: "INR", name: "Indian Rupee", symbol: "\u20B9", decimals: 2 },
  AUD: { code: "AUD", name: "Australian Dollar", symbol: "A$", decimals: 2 },
  CAD: { code: "CAD", name: "Canadian Dollar", symbol: "C$", decimals: 2 },
  JPY: { code: "JPY", name: "Japanese Yen", symbol: "\u00A5", decimals: 0 },
  CNY: { code: "CNY", name: "Chinese Yuan", symbol: "\u00A5", decimals: 2 },
};

export const CURRENCY_CODES = Object.keys(CURRENCIES) as CurrencyCode[];

export const DEFAULT_CURRENCY: CurrencyCode = "NPR";

export function isCurrencyCode(value: string): value is CurrencyCode {
  return Object.prototype.hasOwnProperty.call(CURRENCIES, value);
}

export function currencyInfo(code: string): CurrencyInfo {
  return isCurrencyCode(code) ? CURRENCIES[code] : CURRENCIES[DEFAULT_CURRENCY];
}
