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

export const formatToBRLInput = (value) => {
  if (!value) return '';
  const number = parseFloat(value.replace(',', '.'));
  if (isNaN(number)) return '';
  return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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

export const ActionMapper = (type: AccountType): { action: string, buttonColor: string, route: string }[] => {
  const actionMap: Record<string, { action: string, buttonColor: string, route: string }[]> = {
    CheckingAccount: [
      {
        action: 'Depositar',
        buttonColor: '#4CAF50', // Verde
        route: 'deposit'
      },
      {
        action: 'Transferir',
        buttonColor: '#2196F3', // Azul
        route: 'transfer'
      }
    ],
    SavingsAccount: [
      {
        action: 'Resgatar',
        buttonColor: '#2196F3', // Azul
        route: '/'
      },
      {
        action: 'Aplicar Investimento',
        buttonColor: '#4CAF50', // Verde
        route: 'investments'
      }
    ],
    SalaryAccount: [
      {
        action: 'Ver Extrato',
        buttonColor: '#FFC107', // Amarelo
        route: '/'
      }
    ],
    BusinessAccount: [
      {
        action: 'Gerenciar Pagamentos',
        buttonColor: '#9C27B0', // Roxo
        route: '/business-account/payments'
      },
      {
        action: 'Emitir Fatura',
        buttonColor: '#FF5722', // Laranja
        route: '/business-account/invoice'
      }
    ],
    JointAccount: [
      {
        action: 'Gerenciar Cotas',
        buttonColor: '#FF5722', // Laranja
        route: '/joint-account/shares'
      },
      {
        action: 'Transferir',
        buttonColor: '#2196F3', // Azul
        route: '/joint-account/transfer'
      }
    ],
    StudentAccount: [
      {
        action: 'Consultar Limite',
        buttonColor: '#009688', // Ciano
        route: '/student-account/limit'
      }
    ]
  };

  return actionMap[type] || [
    {
      action: 'Ação desconhecida',
      buttonColor: '#757575', // Cinza
      route: '/unknown'
    }
  ];
};

export const defaultMessage = {
  loading: "Carregando...",
  balance: 0
}