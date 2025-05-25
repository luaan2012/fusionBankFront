import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import type { TransferType } from "./transaction"

export interface Notification {
  id: string;
  icon: IconDefinition;
  iconColor: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  link?: string;
  type?: 'security' | 'transaction' | 'account';
}

export interface Toast {
  id: number;
  message: string;
}

export interface EventMessage{
  eventId: string,
  date: Date | string
  action: NotificationType
  accountId: string
  fullName: string
  accountType: string
  userOwner: string
  userReceive: string
  keyAccount: string
  amountTransfer: string
  investment: string
  investmentAmount: string
  dateSchedule: Date
  creditCardType: string
  creditCardNumber: string
  creditCardLimit: string 
  codeGenerate: string
  balance: string
  transferType: TransferType
  amount: string
  typeCarditle: string
  details: string
  title: string
  read: boolean
 }

 export enum NotificationType{
  LOGIN = 'LOGIN',
  ACCOUNT_CREATED = "ACCOUNT_CREATED",
  KEY_CREATED = "KEY_CREATED",
  KEY_DELETED = "KEY_DELETED",
  KEY_EDITED = "KEY_EDITED",
  TRANSFER_MADE = "TRANSFER_MADE",
  TRANSFER_RECEIVE = "TRANSFER_RECEIVE" ,
  TRANSFER_SCHEDULED = "TRANSFER_SCHEDULED",
  INVESTMENT = "INVESTMENT",
  BILLET_MADE = "BILLET_MADE",
  DEPOSIT_CREATE = "DEPOSIT_CREATE",
  DEPOSIT_MADE = "DEPOSIT_MADE",
  DEPOSIT_DIRECT_CREATE = "DEPOSIT_DIRECT_CREATE",
  DEPOSIT_DIRECT_MADE = "DEPOSIT_DIRECT_MADE", 
  BILLET_GENERATED = "BILLET_GENERATED",
  BILLET_WILL_EXPIRE = "BILLET_WILL_EXPIRE",
  BILLET_DUE = "BILLET_DUE",
  ACCOUNT_EDITED = "ACCOUNT_EDITED",
  CREDITCARD_REQUESTED = "CREDITCARD_REQUESTED",
  CREDITCARD_RESPONSED = "CREDITCARD_RESPONSED",
  CREDITCARD_FAILED = "CREDITCARD_FAILED"
}