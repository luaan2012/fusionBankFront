import type { CreditCard } from "./creditCard"
import type { InvestmentProfile } from "./investment"

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

export enum AccountType{
    CheckingAccount,
    SavingsAccount,
    SalaryAccount,
    BusinessAccount,
    JointAccount,
    StudentAccount,        
}

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

export enum TypeKeyPix {
  CPF = 'CPF',
  CNPJ = 'CNPJ',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  RANDOM = 'RANDOM'
}

export enum DocumentType
{
    CPF,
    CNPJ
}

export enum StatusAccount
{
    ACTIVE = 'ACTIVE',
    BLOCKED = 'BLOCKED',
    PENDENT = 'PENDENT'
}

export interface RegisterKeyPix {
  accountId?: string;
  keyPix: string;
  keyTypePix: 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'RANDOM'
}

export interface FormError {
  error: boolean;
  message: string;
}

export interface RegisterRequest {
  name: string;
  lastName: string;
  phoneNumber: string;
  salaryPerMonth: string;
  accountType: string;
  bankISBP: string;
  bankName: string;
  documentType: 'CPF' | 'CNPJ';
  email: string;
  document: string;
  password: string;
  confirmPassword: string;
  birthDate: string;
}

export interface PasswordStrength {
  width: number;
  color: string;
  text: string;
}