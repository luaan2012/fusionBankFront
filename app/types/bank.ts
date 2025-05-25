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

export interface BankRegister {
    name: string,
    icon: any,
    iconBg: string,
    iconColor: string,
    features: BankAdvantages[],
    fee: string
    bankISBP: string
}

export enum AdvantageType{
  TEDFREE = "TEDFREE",
  CARDFREE = "CARDFREE",
  CASHBACK1 = "CASHBACK1",
  CASHBACK2 = "CASHBACK2",
  CASHBACK5 = "CASHBACK5",
  CASHBACK10 = "CASHBACK10",
  CDB150 = "CDB150",
  CONSULTANCY = "CONSULTANCY",
  CARDPLATINUM = "CARDPLATINUM",
  CARDBLACK = "CARDBLACK",
  MILESILIMITED = "MILESILIMITED",
  FEE1 = "FEE1",
  FEE2 = "FEE2",
  APPROVAL24 = "APPROVAL24",
  FEELESSTOPAY = "FEELESSTOPAY"
}

export enum BankType{
  DIGITAL = "DIGITAL",
  INVEST = "INVEST",
  CARD = "CARD",
  LOAN = "LOAN"
}