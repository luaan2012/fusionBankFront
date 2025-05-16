export interface DepositBillet {
  code: string
  paymentType: PaymentType
}

export enum PaymentType{
  CREDIT = "CREDIT",
  DEBIT = "DEBIT"
}