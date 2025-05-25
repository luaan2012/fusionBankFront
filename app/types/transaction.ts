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

export interface LastTransction{
  icon: any
  iconColor: string
  textColor: string
  bg: string
  title: string
  description: string
  amount: string
  balance: number
}

 export interface Transfer {
  transferId: string
  accountId: string
  accountNumberReceive: string 
  keyAccount: string 
  amount: number 
  nameOwner: string 
  nameReceive: string
  documentReceive: string 
  documentOwner: string 
  accountNumberOwner: string 
  isSchedule: string 
  scheduleDate: boolean 
  transferStatus: string
  transferType: string
 }

 export enum TransferType {
  PIX = "PIX",
  TED = "TED",
  DOC = "DOC",
  BOLETO = "BOLETO",
  DEPOSITO = "DEPOSITO"
}

export type TransactionType = 'transfer' | 'investment' | 'billPayment' | 'deposit';

export interface DepositBillet {
  code: string
  paymentType: PaymentType
}

export enum PaymentType{
  CREDIT = "CREDIT",
  DEBIT = "DEBIT"
}

export interface TransferRequest{
  accountId?: string
  accountNumberReceive?: string 
  keyAccount?: string 
  amount?: number 
  namePayer?: string 
  nameReceiver?: string
  documentReceiver?: string 
  documentPayer?: string 
  accountNumberPayer?: string 
  isSchedule?: boolean 
  scheduleDate?: Date 
  transferType?: TransferType
}

export interface Billet {
  depositId: string;
  amount: number,
  fee: number,
  codeGenerate: string,
  description: string,
  billetType: BilletType
  dateExpiration: Date
}

export enum BilletType {
  SHOPPING = 'SHOPPING',
  ENTERTEIMANT = 'ENTERTEIMANT',
  TRAVEL = 'TRAVEL',
  LEISURE = 'LEISURE',
  HEALTH = 'HEALTH',
  FOOD = 'FOOD',
  OTHER = 'OTHER',
  DEPOSIT = 'DEPOSIT',
}