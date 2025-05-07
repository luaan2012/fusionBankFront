import type { InvestmentType } from "./enum/investmentType"

export interface Investment {
  id: string;
  balance: number,
  paidOff: number,
  totalBalance: number,
  entries: InvestmentEntry[];
  investmentType: InvestmentType,
  dateInvestment: Date
}

export interface InvestmentEntry{
  amount: number,
  date: Date,
}