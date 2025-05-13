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
