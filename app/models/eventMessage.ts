import type { NotificationType } from "./enum/notificationType"
import type { ServiceType } from "./enum/serviceType"
import type { TransferType } from "./enum/transferType"

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
  service: ServiceType
  read: boolean
 }
 