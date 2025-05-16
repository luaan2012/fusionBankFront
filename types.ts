import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import type { StatusAccount } from "~/models/enum/statusAccount"

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

export interface Card {
  id: number;
  type: 'physical' | 'virtual';
  brand: string;
  number: string;
  holder: string;
  expiry: string;
  cvv: string;
  availableLimit: string;
  isBlocked?: boolean;
  cardIcon?: string;
  blockIcon?: string;
}

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

export interface FileInfo {
  name: string;
  size: number;
  type: string;
}

export interface ConfirmationDetails {
  amount: string;
  tax: string;
  total: string;
  destination: string;
  description: string;
  scheduleDate?: boolean;
}

export interface ResponseStore {
  message: string,
  success: boolean
}

export interface AccountRequest {
  name: string;
  lastName: string;
  salaryPerMonth: string;
  email: string;
  phoneNumber: string;
  document: string;
  birthDate: string;
  expensePerDay: number;
  darkMode: boolean;
  status: StatusAccount;
}