import type { TransactionType } from "./transaction"

export interface ConfirmationDetails {
  amount: string;
  tax: string;
  total?: string;
  destination?: string;
  description?: string;
  scheduleDate?: boolean;
  transactionType?: TransactionType
  action?: InvestmentAction
  details?: Record<string, string>;
}

export interface AvailableInvestment {
  id?: string
  currency?: string
  marketCap?: number
  shortName?: string
  longName?: string
  regularMarketChange?: number
  regularMarketChangePercent?: number
  regularMarketTime?: Date
  regularMarketPrice?: number
  regularMarketDayHigh?: number
  regularMarketDayRange?: number
  regularMarketDayLow?: number
  regularMarketVolume?: number
  regularMarketPreviousClose?: number
  regularMarketOpen?: number
  fiftyTwoWeekRange?: string
  fiftyTwoWeekLow?: number
  fiftyTwoWeekHigh?: number
  symbol?: string
  priceEarnings?: number
  earningsPerShare?: number
  logourl?: string
  onMyPocket?: boolean
  type?: InvestmentType
}

export interface ModalInvestment {
  id?: string;
  symbol: string;
  shortName: string;
  type: string;
  regularMarketPrice: number;
  regularMarketChangePercent?: number;
  ownedShares?: number;
  logourl?: string;
}

export interface InvestmentProfile {
  type: string,
  lastUpdated: Date,
  riskTolerance: number,
  experience: string,
  financialGoals: string,
  investmentHorizon: string,
}

export interface InvestmentDisplay {
  name: string;
  value: string;
  color: string;
  items: string[]
}

export interface Asset {
  investmentId: string;
  name: string;
  shortName: string; 
  symbol: string; 
  details: string; 
  valueNumber: number;
  value: string; 
  quantity: number; 
  ownedShares: number;
  balance: number; 
  share: string; 
  performance: string;
  regularMarketChangePercent: number; 
  yield: string; 
  color: string; 
  logourl: string; 
  type: InvestmentType; 
  regularMarketPrice: number;
  totalBalance: number
}

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

export interface InvestmentHome{
  type: InvestmentType,
  name: string,
  rate: string,
  value: string,
  valueNormalized: number,
  applied: string,
  yield: string,
  regularMarketChangePercent: number
}

export enum InvestmentType {
  CDB = 'CDB',
  LCI = 'LCI',
  LCA = 'LCA',
  STOCK = 'STOCK',
  FII = 'FII'
}

export type InvestmentAction = 'buy' | 'sell'

export interface InvestmentRequest {
  accountId: string
  investmentId?: string
  amount: number,
  symbol: string
  investmentType: InvestmentType
}