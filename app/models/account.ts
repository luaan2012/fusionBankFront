import type { CreditCard } from "./creditCard"
import type { AccountType } from "./enum/accountType"
import type { StatusAccount } from "./enum/statusAccount"

export interface Account {
  accountId: string; // Guid → string
  name: string;
  lastName: string;
  fullName: string;
  bankName: string;
  bankISBP: string;
  keyAccount: string;
  accountNumber: string;
  agency: string;
  balance: number; // decimal → number
  expenseDay: number;
  transferLimit: number;
  salaryPerMonth: number;
  creditCards: CreditCard[];
  accountType: AccountType;
  status: StatusAccount;
  documentType: DocumentType;
  document: string;
  email: string;
  password: string;
  darkMode: boolean;
  phoneNumber: string;
  birthDate: Date;
  expensePerDay: number;
  passwordTransaction: string;
  investmentProfile: InvestmentProfile;
  keyTypePix: TypeKeyPix
}

export interface InvestmentProfile {
  experience: string
  financialGoals: string
  investmentHorizon: string
  riskTolerance: number
  lastUpdated: Date
}

export enum TypeKeyPix {
  CPF = 'CPF',
  CNPJ = 'CNPJ',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  RANDOM = 'RANDOM'
}