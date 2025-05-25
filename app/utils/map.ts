import { faArrowDown, faArrowUp, faBarcode, faCreditCard, faHandHoldingUsd, faPiggyBank, faUniversity } from "@fortawesome/free-solid-svg-icons"
import { BankType, type Bank, type BankRegister } from "~/types/bank"
import { type Investment, type InvestmentHome, type InvestmentDisplay, InvestmentType } from "~/types/investment"
import { NotificationType, type EventMessage } from "~/types/notification"
import { type LastTransction, BilletType } from "~/types/transaction"
import { formatToBRL } from "./util"

export function mapEventMessagesToTransactions(eventMessages: EventMessage[]): LastTransction[] {
  if(eventMessages?.length <= 0) return [];
  
  return eventMessages.map((event) => {
    const date = typeof event.date === 'string' ? new Date(event.date) : event.date;

    const formattedDate = date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    // Configurações baseadas no notificationType
    switch (event.action as NotificationType) {
      case NotificationType.TRANSFER_MADE:
        return {
          icon: faArrowDown,
          iconColor: 'text-red-800',
          bg: 'bg-red-100',
          textColor: 'text-red-600 dark:text-red-400',
          title: event.title,
          description: `${event.transferType} enviado para ${event.userReceive} • ${formattedDate}`,
          amount: event.amount, 
          balance: 0// Negativo para transferência enviada
        };

      case NotificationType.TRANSFER_RECEIVE:
        return {
          icon: faArrowUp,
          iconColor: 'text-green-800',
          bg: 'bg-green-100',
          textColor: 'text-green-600 dark:text-green-400',
          title: event.title,
          description: `${event.transferType} recebido de ${event.userOwner} • ${formattedDate}`,
          amount: event.amount,
          balance: 0
        };

      case NotificationType.DEPOSIT_DIRECT_MADE:
        return {
          icon: faArrowUp,
          iconColor: 'text-green-800',
          bg: 'bg-green-100',
          textColor: 'text-green-600 dark:text-green-400',
          title: event.title,
          description: `${event.transferType} recebido de ${event.userOwner} • ${formattedDate}`,
          amount: event.amount,
          balance: 0
        };

      case NotificationType.DEPOSIT_MADE:
        return {
          icon: faBarcode,
          iconColor: 'text-blue-600 dark:text-gray-100',
          bg: 'bg-blue-100 dark:bg-blue-900',
          title: event.title,
          textColor: 'text-green-600 dark:text-green-400',
          description: `${event.details} • ${formattedDate}`,
          amount: event.amount,
          balance: 0// Negativo para transferência enviada
        };
      default:
        // Caso notificationType não seja reconhecido
        return {
          icon: faBarcode,
          iconColor: 'text-blue-600 dark:text-gray-100',
          bg: 'bg-blue-100 dark:bg-blue-900',
          title: event.title,
          textColor: 'text-red-600 dark:text-red-400',
          description: `Detalhes: ${event.details} • ${formattedDate}`,
          amount: event.amount,
          balance: 0
        };
    }
  });
}

export function mapInvestmentsToDisplay(investments: Investment[]): InvestmentHome[] {
  if (investments.length <= 0) return [];

  return investments.map((investment) => {
    // Calcula o valor aplicado (soma dos aportes)
    const applied = investment.entries.reduce(
      (sum, entry) => sum + entry.amount,
      0
    );

    const yieldValue = investment.paidOff;

    const rate = '12,5% a.a.';

    // Suposição para rentabilidade percentual (ajuste se disponível no backend)
    const regularMarketChangePercent = investment.percentageChange || 0;

    return {
      type: investment.investmentType,
      name: investment.symbol,
      rate,
      valueNormalized: investment.totalBalance,
      value: formatToBRL(investment.totalBalance),
      applied: formatToBRL(applied),
      yield: formatToBRL(yieldValue),
      regularMarketChangePercent,
    };
  });
}

export function mapBanksToDisplay(banks: Bank[]): BankRegister[] {
  if(banks.length <= 0) return [];
  
  return banks.map((bank) => {
    // Formata valores monetários
    const formatCurrency = (value: number): string =>
      `R$ ${value.toFixed(2).replace('.', ',')}`;

    switch(bank.bankType) {
    case BankType.DIGITAL:
      return {
        name: bank.name,
        icon: faUniversity,
        iconBg: 'bg-blue-100 dark:bg-blue-900',
        iconColor: 'text-blue-600 dark:text-blue-300',
        features: bank.bankAdvantages,
        fee: formatCurrency(bank.maintenanceFee),
        bankISBP: bank.ispb
      };

    case BankType.LOAN:
      return {
        name: bank.name,
        icon: faHandHoldingUsd,
        iconBg: 'bg-yellow-100 dark:bg-yellow-900',
        iconColor: 'text-yellow-600 dark:text-yellow-300',
        features: bank.bankAdvantages,
        fee: formatCurrency(bank.maintenanceFee),
        bankISBP: bank.ispb
      };

    case BankType.CARD:
      return {
        name: bank.name,
        icon: faCreditCard,
        iconBg: 'bg-purple-100 dark:bg-purple-900',
        iconColor: 'text-purple-600 dark:text-purple-300',
        features: bank.bankAdvantages,
        fee: formatCurrency(bank.maintenanceFee),
        bankISBP: bank.ispb
      };

    default:
      // Caso notificationType não seja reconhecido
      return {
        name: bank.name,
        icon: faPiggyBank,
        iconBg: 'bg-green-100 dark:bg-green-900',
        iconColor: 'text-green-600 dark:text-green-300',
        features: bank.bankAdvantages,
        fee: formatCurrency(bank.maintenanceFee),
        bankISBP: bank.ispb
      };
    }
  });
}

export const BilletTypeToString = (type: BilletType): string => {
  switch(type) {
    case BilletType.DEPOSIT:
      return 'Depósito';
    case BilletType.ENTERTEIMANT:
      return 'Entreternimento';
    case BilletType.FOOD:
      return 'Alimentação';
    case BilletType.HEALTH:
      return 'Saúde';
    case BilletType.OTHER:
      return 'Outros';
    case BilletType.TRAVEL:
      return 'Viagens';
    case BilletType.LEISURE:
      return 'Lazer';
    case BilletType.SHOPPING:
      return 'Compras';
  }
}

export const mapInvestmentsToInvestmentDisplay = (investments: Investment[]): InvestmentDisplay[] => {
  // Calculate total balance across all investments
  const totalBalance = investments.reduce((sum, inv) => sum + inv.totalBalance, 0);

  // Group investments by category based on investmentType
  const groupedInvestments: Record<string, Investment[]> = {
    'Renda Fixa': [],
    'Renda Variável': [],
    'Fundos Imobiliários': [],
  };

  investments.forEach((inv) => {
    switch (inv.investmentType) {
      case InvestmentType.CDB:
      case InvestmentType.LCI:
      case InvestmentType.LCA:
        groupedInvestments['Renda Fixa'].push(inv);
        break;
      case InvestmentType.STOCK:
        groupedInvestments['Renda Variável'].push(inv);
        break;
      case InvestmentType.FII:
        groupedInvestments['Fundos Imobiliários'].push(inv);
        break;
      default:
        // Optionally handle unknown types; for now, skip them
        break;
    }
  });

  // Map grouped investments to InvestmentDisplay
  return Object.entries(groupedInvestments)
    .filter(([_, invs]) => invs.length > 0) // Only include categories with investments
    .map(([categoryName, invs]) => {
      // Calculate total balance for this category
      const categoryBalance = invs.reduce((sum, inv) => sum + inv.totalBalance, 0);

      // Calculate percentage (value) for this category
      const value = totalBalance > 0 ? ((categoryBalance / totalBalance) * 100).toFixed(0) : '0';

      // Assign color based on category
      const color = categoryName === 'Renda Fixa' ? 'blue' : categoryName === 'Renda Variável' ? 'green' : 'purple';
      // Create items array
      const items = invs.map((inv) => `${inv.shortName}: ${formatToBRL(inv.totalBalance)}`);
      
      return {
        name: categoryName,
        value,
        color,
        items,
      };
    });
};