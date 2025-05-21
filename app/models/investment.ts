import type { InvestmentType } from "./enum/investmentType"

export interface Investment {
  id: string;
  accountId: string;
  symbol: string;
  shortName: string;
  name: string;
  logourl: string;
  balance: number,
  paidOff: number,
  totalBalance: number,
  quantity: number,
  unitPrice: number,
  regularMarketPrice: number,
  percentageChange: number,
  entries: InvestmentEntry[];
  investmentType: InvestmentType,
  dateInvestment: Date
}

export interface InvestmentEntry{
  amount: number,
  date: Date,
  decimal: number,
  unitPrice: number,
  quantity: number
}