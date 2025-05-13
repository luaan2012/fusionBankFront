import { faArrowDown, faArrowUp, faBarcode, faCreditCard, faHandHoldingUsd, faPiggyBank, faUniversity } from "@fortawesome/free-solid-svg-icons"
import type { Bank } from "~/models/bank"
import { BankType } from "~/models/enum/bankType"
import { NotificationType } from "~/models/enum/notificationType"
import type { EventMessage } from "~/models/eventMessage"
import type { Investment } from "~/models/investment"
import type { BankRegister, InvestmentHome, LastTransction } from "~/models/maps"
import { formatToBRL } from "./utils"
import { BilletType } from "~/models/response/billetResponse"

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
          title: event.title,
          description: `${event.transferType} recebido de ${event.userOwner} • ${formattedDate}`,
          amount: event.amount,
          balance: 0
        };

      case NotificationType.DEPOSIT:
        return {
          icon: faBarcode,
          iconColor: 'text-blue-800',
          bg: 'bg-blue-100',
          title: event.title,
          description: `${event.service} • ${formattedDate}`,
          amount: event.amount,
          balance: 0// Negativo para transferência enviada
        };

      default:
        // Caso notificationType não seja reconhecido
        return {
          icon: faBarcode,
          iconColor: 'text-gray-500',
          bg: 'bg-gray-100',
          title: event.title,
          description: `Detalhes: ${event.details} • ${formattedDate}`,
          amount: event.amount,
          balance: 0
        };
    }
  });
}

export function mapInvestmentsToDisplay(investments: Investment[]): InvestmentHome[] {
  if(investments.length <= 0) return [];
  
  return investments.map((investment) => {
    // Calcula o valor aplicado (soma dos aportes)
    const applied = investment.entries.reduce(
      (sum, entry) => sum + entry.amount,
      0
    );

    // Calcula o rendimento (totalBalance - applied)
    const yieldValue = investment.totalBalance - applied;

    // Calcula o progresso (balance / totalBalance)
    const progress = Math.min(
      Math.round((investment.balance / investment.totalBalance) * 100),
      100
    );

    // Define a cor do progresso
    const progressColor =
      progress >= 70
        ? 'bg-green-500'
        : progress >= 30
        ? 'bg-yellow-500'
        : 'bg-red-500';

    // Deriva o ano de vencimento (suposição: 2 anos a partir de dateInvestment)
    const maturityYear = new Date(investment.dateInvestment).getFullYear() + 2;

    // Suposição para a taxa de retorno (pode ser ajustada se disponível no backend)
    const rate = '12,5% a.a.'; // Fixo, ou calcular com base em balance/totalBalance

    return {
      type: investment.investmentType,
      name: `${investment.investmentType} Prefixado ${maturityYear}`,
      rate,
      value: formatToBRL(investment.totalBalance),
      progress,
      applied: formatToBRL(applied),
      yield: formatToBRL(yieldValue),
      progressColor,
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