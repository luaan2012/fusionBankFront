import type { InvestmentType } from "../enum/investmentType"

export interface InvestmentRequest {
  accountId: string
  investmentId?: string
  amount: number,
  symbol: string
  investmentType: InvestmentType
}