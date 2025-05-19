import type { AccountType } from "~/models/enum/accountType"

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

export const CleanString = (str: string)  => {
  return str.replace(/[.\-/]/g, '');
}

export const formatNumberAccount = (account: string): string => {
  if(account === '' || account === null || account === undefined) return '';
  
  const clean = account.replace(/\D/g, ''); // remove não dígitos
  if (clean.length <= 5) return clean;
  return `${clean.slice(0, clean.length - 1)}-${clean.slice(-1)}`;
};

export const formatToBRL = (value: number | string): string => {
  if(value === undefined || value === null || Number.isNaN(value)) return '0';

  const numeric = typeof value === 'string' ? parseFloat(value) : value;
  return numeric.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export const formatToBRL2 = (value: number): string => {
  return (value || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
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

export function formatDateBR(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR');
}

export function formatCardNumber(cardNumber: string | undefined): string {
  if (!cardNumber) {
    return '**** **** **** ****'; // Valor padrão para evitar erros
  }
  return cardNumber.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
}

export function formatarBoleto(linhaDigitavel: string): string {
  const somenteNumeros = linhaDigitavel.replace(/\D/g, '');

  if (somenteNumeros.length !== 47 && somenteNumeros.length !== 48) {
    return linhaDigitavel; // Retorna como está se o tamanho for inesperado
  }

  if (somenteNumeros.length === 47) {
    // Boleto bancário
    return [
      somenteNumeros.slice(0, 5),
      somenteNumeros.slice(5, 10),
      somenteNumeros.slice(10, 15),
      somenteNumeros.slice(15, 21),
      somenteNumeros.slice(21, 26),
      somenteNumeros.slice(26, 32),
      somenteNumeros.slice(32, 33),
      somenteNumeros.slice(33, 47),
    ].join(' ');
  }

  if (somenteNumeros.length === 48) {
    // Boleto de concessionária
    return [
      somenteNumeros.slice(0, 12),
      somenteNumeros.slice(12, 24),
      somenteNumeros.slice(24, 36),
      somenteNumeros.slice(36, 48),
    ].join(' ');
  }

  return linhaDigitavel;
}

export const formatDateToInput = (isoDate: Date) => {
  if (!isoDate) return '';
  return new Date(isoDate).toISOString().split('T')[0];
};

export const isValidBirthDate = (birthDate: string, minAge: number = 18): boolean => {
  const today = new Date();
  const birth = new Date(birthDate);
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birth.getDate())
  ) {
    return age - 1 >= minAge;
  }
  return age >= minAge;
};

export const formatAmount = (value: string | number): string => {
  if (!value) return '';
  // Converte para número, garantindo que seja em reais (não centavos)
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
  if (isNaN(numericValue)) return '';
  // Formata com 2 casas decimais e separadores de milhar
  return numericValue.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
};

export const formatPercent = (value: number, digits = 1): string =>
  `${(value * 100).toFixed(digits)}%`;

export const normalizeInvestmentType = (type: string): string => {
  switch (type.toUpperCase()) {
    case 'STOCK':
      return 'AÇÃO';
    case 'CDB':
    case 'FII':
    case 'TESOURO':
    case 'LCI':
    case 'LCA':
      return type.toUpperCase();
    default:
      return type.toUpperCase();
  }
};