import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { number } from "zod"
import type { InvestmentType } from "~/models/enum/investmentType"
import type { StatusAccount } from "~/models/enum/statusAccount"
import type { InvestmentAction, TransactionType } from "~/models/enum/transferType"

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
  total?: string;
  destination?: string;
  description?: string;
  scheduleDate?: boolean;
  transactionType?: TransactionType
  action?: InvestmentAction
  details?: Record<string, string>;
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

export interface Asset {
  investmentId: string;
  name: string; // Nome do ativo (ex.: símbolo, como "PETR4")
  shortName: string; // Nome completo ou descritivo (ex.: "Petrobras PN")
  symbol: string; // Símbolo do ativo (ex.: "PETR4")
  details: string; // Tipo normalizado (ex.: "Ação", "CDB")
  valueNumber: number; // Valor investido em número (ex.: 1000.50)
  value: string; // Valor investido formatado (ex.: "R$ 1.000,50")
  quantity: number; // Quantidade de cotas (para STOCK/FII) ou equivalente
  ownedShares: number; // Número de cotas disponíveis (sinônimo de quantity para STOCK/FII)
  balance: number; // Saldo total do investimento (sinônimo de valueNumber para não STOCK/FII)
  share: string; // Percentual na carteira (ex.: "25%")
  performance: string; // Rentabilidade formatada (ex.: "+5%")
  regularMarketChangePercent: number; // Percentual de variação (ex.: 0.05 para 5%)
  yield: string; // Rendimento em BRL (ex.: "R$ 50,00")
  color: string; // Cor para exibição
  logourl: string; // URL do logo
  type: InvestmentType; // Tipo do investimento (ex.: "STOCK", "CDB")
  regularMarketPrice: number; // Preço atual por cota (ex.: 30.25)
  totalBalance: number
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