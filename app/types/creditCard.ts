import type { BilletType } from "~/models/response/billetResponse"

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

export interface CreditCard {
  id: string; // Guid → string
  accountId: string;
  creditCardNumber: string;
  creditCardName: string;
  creditCardCode: string;
  creditCardLimit: number;
  creditCardUsed: number;
  creditCardAvaliable: number;
  creditCardValidity: Date; 
  creditCardType: CreditCardType;
  creditCardFlag: CreditCardFlag;
  invoices: Invoice[];
  creditCardVirtual: boolean;
  creditCardTried: boolean;
  creditCardBlocked: boolean;
  creditCardTriedTimes: number;
  currentInvoiceAmount: number;
  creditCardNextAttempt: string;
  virtualCreditCards: VirtualCreditCard[];
}

export interface VirtualCreditCard {
  id: string;
  creditCardNumber: string;
  creditCardName: string;
  creditCardCode: string;
}

export interface Invoice {
  periodStart: Date,
  periodEnd: Date,
  dueDate: Date,
  isOpen: boolean,
  expenses: Expense[]
  totalAmount: number
} 

export interface Expense {
  id: string;
  description: string,
  date: Date,
  amount: number
  category: BilletType
}

export enum CreditCardFlag {
    VISA = "VISA",
    MASTERCARD = "MASTERCARD",
    DISCOVER = "DISCOVER",
    AMERICANEXPRESS = "AMERICANEXPRESS",
}

export enum CreditCardType
{
    STANDARD,
    GOLD,
    PLATINUM,
    BLACK,
    INFINITE
}