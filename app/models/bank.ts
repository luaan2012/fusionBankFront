import { AdvantageType } from './enum/advantageType';
import type { BankType } from './enum/bankType'

export interface Bank {
  bankId: string,
  name: string,
  nameNormalized: string,
  ispb: string,
  city: string,
  state: string,
  address: string,
  swiftCode: string
  maintenanceFee: number
  bankType: BankType
  bankAdvantages: BankAdvantages[]
}

export interface BankAdvantages
{
    isActive: boolean,
    title: string,
    type: AdvantageType
}