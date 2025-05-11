import type { CreditCardType } from "cleave.js/options/creditCard"
import type { CreditCardFlag } from "./enum/creditCardFlag"

export interface CreditCard {
  id: string; // Guid → string
  accountId: string;
  creditCardNumber: string;
  creditCardName: string;
  creditCardCode: string;
  creditCardLimit: number;
  creditCardUsed: number;
  creditCardAvaliable: number; // calculado no back-end, mas aqui como propriedade direta
  creditCardValidity: Date; // DateTime → string (ISO 8601)
  creditCardType: CreditCardType;
  creditCardFlag: CreditCardFlag;
  creditCardVirtual: boolean;
  creditCardTried: boolean;
  creditCardIsBlocked: boolean;
  creditCardTriedTimes: number;
  creditCardNextAttempt: string;
}
