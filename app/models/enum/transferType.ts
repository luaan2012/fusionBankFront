export enum TransferType {
  PIX = "PIX",
  TED = "TED",
  DOC = "DOC",
  BOLETO = "BOLETO",
  DEPOSITO = "DEPOSITO"
}

export type TransactionType = 'transfer' | 'investment' | 'billPayment' | 'deposit';

export type InvestmentAction = 'buy' | 'sell'
