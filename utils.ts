import type { AccountType } from "~/models/enum/accountType"

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

export const formatNumberAccount = (account: string): string => {
  const clean = account.replace(/\D/g, ''); // remove não dígitos
  if (clean.length <= 5) return clean;
  return `${clean.slice(0, clean.length - 1)}-${clean.slice(-1)}`;
};

export const formatToBRL = (value: number | string): string => {
  const numeric = typeof value === 'string' ? parseFloat(value) : value;
  return numeric.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export const translateAccountType = (type: AccountType): string => {
  const translations: Record<string, string> = {
    CheckingAccount: 'Conta Corrente',
    SavingsAccount: 'Conta Poupança',
    SalaryAccount: 'Conta Salário',
    BusinessAccount: 'Conta Empresarial',
    JointAccount: 'Conta Conjunta',
    StudentAccount: 'Conta Universitária',
  };

  return translations[type] || 'Tipo desconhecido';
};

export const defaultMessage = {
  loading: "Carregando...",
  balance: 0
}