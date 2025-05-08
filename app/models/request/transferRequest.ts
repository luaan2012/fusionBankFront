import type { TransferType } from "../enum/transferType"

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