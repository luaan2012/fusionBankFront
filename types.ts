import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { number } from "zod"
import type { InvestmentType } from "~/models/enum/investmentType"
import type { StatusAccount } from "~/models/enum/statusAccount"

export interface Notification {
  id: string;
  icon: IconDefinition;
  iconColor: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  link?: string;
  type?: 'security' | 'transaction' | 'account';
}
export interface Toast {
  id: number;
  message: string;
}

export interface Card {
  id: number;
  type: 'physical' | 'virtual';
  brand: string;
  number: string;
  holder: string;
  expiry: string;
  cvv: string;
  availableLimit: string;
  isBlocked?: boolean;
  cardIcon?: string;
  blockIcon?: string;
}

export interface PendingBoleto {
  name: string;
  dueDate: string;
  amount: string;
}

export interface DepositDetails {
  amount: string;
  description?: string;
}

export interface BoletoDetails {
  code: string;
  amount: string;
  dueDate: string;
  beneficiary?: string;
  nossoNumero?: string;
  fees?: string;
  total?: string;
}

export interface FileInfo {
  name: string;
  size: number;
  type: string;
}

export interface ConfirmationDetails {
  amount: string;
  tax: string;
  total: string;
  destination: string;
  description: string;
  scheduleDate?: boolean;
}

export interface ResponseStore {
  message: string,
  success: boolean
}

export interface AccountRequest {
  name: string;
  lastName: string;
  salaryPerMonth: string;
  email: string;
  phoneNumber: string;
  document: string;
  birthDate: string;
  expensePerDay: number;
  darkMode: boolean;
  status: StatusAccount;
}

export interface AvailableInvestment {
  id: string
  currency: string
  marketCap: number
  shortName: string
  longName: string
  regularMarketChange: number
  regularMarketChangePercent: number
  regularMarketTime: Date
  regularMarketPrice: number
  regularMarketDayHigh: number
  regularMarketDayRange: number
  regularMarketDayLow: number
  regularMarketVolume: number
  regularMarketPreviousClose: number
  regularMarketOpen: number
  fiftyTwoWeekRange: string
  fiftyTwoWeekLow: number
  fiftyTwoWeekHigh: number
  symbol: string
  priceEarnings: number
  earningsPerShare: number
  logourl: string
  onMyPocket: boolean
  type: InvestmentType
}