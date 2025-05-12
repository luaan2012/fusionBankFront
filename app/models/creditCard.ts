import type { CreditCardFlag } from "./enum/creditCardFlag"
import type { CreditCardType } from "./enum/creditCardType"

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
  creditCardVirtual: boolean;
  creditCardTried: boolean;
  creditCardBlocked: boolean;
  creditCardTriedTimes: number;
  creditCardNextAttempt: string;
  virtualCreditCards: VirtualCreditCard[];
}

export interface VirtualCreditCard {
  id: string;
  creditCardNumber: string;
  creditCardName: string;
  creditCardCode: string;
}
