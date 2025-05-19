import type { BankAdvantages } from "./bank"
import type { InvestmentType } from "./enum/investmentType"

export interface LastTransction{
  icon: any
  iconColor: string
  bg: string
  title: string
  description: string
  amount: string
  balance: number
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

export interface BankRegister {
    name: string,
    icon: any,
    iconBg: string,
    iconColor: string,
    features: BankAdvantages[],
    fee: string
    bankISBP: string
}