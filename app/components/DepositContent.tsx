import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarcode, faMoneyBillWave, faUniversity, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { IMaskInput } from 'react-imask';
import { useAccountStore } from '~/context/accountStore';
import { useToast } from '~/components/ToastContext';
import { ConfirmationModalDeposit } from './DepositModal';
import { depositSchema, type DepositFormData } from '~/homeApp/schema/depositBilletsScheme';
import { usePaymentStore } from '~/context/paymentStore';
import type { ResponseStore } from 'types';
import { useBankStore } from '~/context/bankStore';

interface DepositContentProps {
  setShowBoletoModal: (response: ResponseStore) => void;
  setShowSuccessModal: (response: ResponseStore) => void;
  setShowErrorToast: (response: ResponseStore) => void;
}

interface ConfirmationDetails {
  amount: string;
  description?: string;
  destination?: string;
  billetType?: string;
}

interface DepositCardData {
  type: 'direct' | 'boleto';
  icon: typeof faMoneyBillWave | typeof faBarcode;
  color: string;
  bg: string;
  title: string;
  description: string;
  features: string[];
}

export function DepositContent({ setShowBoletoModal, setShowSuccessModal, setShowErrorToast }: DepositContentProps) {
  const [depositType, setDepositType] = useState<'direct' | 'boleto'>('direct');
  const [boletoType, setBoletoType] = useState<'DEPOSIT' | 'expense'>('DEPOSIT');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [details, setDetails] = useState<ConfirmationDetails | null>(null);
  const [depositData, setDepositData] = useState<DepositFormData | null>(null);
  const { directDeposit, generateBillet } = usePaymentStore();
  const { banks, listBanks } = useBankStore();
  const { user } = useAccountStore();
  const { openToast } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<DepositFormData>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      depositType: 'direct',
      billetType: 'DEPOSIT',
      amount: '',
      description: '',
      nameReceiver: '',
      documentReceiver: '',
      ispb: '',
      agencyNumberReceiver: '',
      accountNumberReceiver: '',
    },
    mode: 'onChange',
  });

  const watchedDepositType = watch('depositType');
  const watchedBilletType = watch('billetType');

  useEffect(() => {
    if (banks.length === 0 && user) {
      listBanks();
    }
  }, [banks, listBanks, user]);

  useEffect(() => {
    setValue('depositType', depositType);
    setValue('billetType', boletoType === 'DEPOSIT' ? 'DEPOSIT' : 'SHOPPING');
    if (depositType === 'direct' || boletoType !== 'DEPOSIT') {
      setValue('nameReceiver', '');
      setValue('documentReceiver', '');
      setValue('ispb', '');
      setValue('agencyNumberReceiver', '');
      setValue('accountNumberReceiver', '');
    }
  }, [depositType, boletoType, setValue]);

  const depositCards: DepositCardData[] = [
    {
      type: 'direct',
      icon: faMoneyBillWave,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900',
      title: 'Depósito Direto',
      description: 'Deposite diretamente na sua conta sem débito',
      features: ['Crédito imediato', 'Sem taxas', 'Valor mínimo: R$ 10,00'],
    },
    {
      type: 'boleto',
      icon: faBarcode,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900',
      title: 'Boleto de Depósito',
      description: 'Gere um boleto para depósito ou pagamento',
      features: ['Validade: 3 dias úteis', 'Sem custo', 'Crédito em até 1 dia útil'],
    },
  ];

  const handleCardSelect = (type: 'direct' | 'boleto') => {
    setDepositType(type);
    setBoletoType('DEPOSIT');
    setValue('depositType', type);
    setValue('billetType', 'DEPOSIT');
  };

  const handleBoletoTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBoletoType = e.target.value as 'DEPOSIT' | 'expense';
    setBoletoType(newBoletoType);
    setValue('billetType', newBoletoType === 'DEPOSIT' ? 'DEPOSIT' : 'SHOPPING');
  };

  const onSubmit = async (data: DepositFormData) => {
    try {
      const details: ConfirmationDetails = {
        amount: data.amount,
        description: data.description,
        destination: data.depositType === 'boleto' && data.billetType === 'DEPOSIT' ? data.nameReceiver : undefined,
        billetType: data.depositType === 'boleto' && data.billetType !== 'DEPOSIT' ? data.billetType : undefined,
      };

      const request: DepositFormData & { accountId: string; isDeposit: boolean } = {
        ...data,
        accountId: user.accountId,
        isDeposit: watchedDepositType === 'boleto' && watchedBilletType === 'DEPOSIT',
      };

      setDetails(details);
      setDepositData(request);
      setIsModalOpen(true);
    } catch (error) {
      setShowErrorToast({ message: 'Erro ao preparar depósito.', success: false });
      console.error('Submission error:', error);
    }
  };

  const handleModalConfirm = async () => {
    if (!depositData) return;
    let response;

    if (depositType === 'direct') {
      response = await directDeposit(depositData);
    } else {
      response = await generateBillet(depositData);
    }

    if (!response.success) {
      openToast({
        message: response?.message || 'Erro ao criar depósito!',
        type: 'error',
        duration: 4000,
        position: 'top-right',
      });
      return;
    }

    if (depositType === 'direct') {
      setShowSuccessModal({ message: response.message, success: response.success });
    } else {
      setShowBoletoModal({ message: response.message, success: response.success });
    }

    setIsModalOpen(false);
    reset({
      depositType: 'direct',
      billetType: 'DEPOSIT',
      amount: '',
      description: '',
      nameReceiver: '',
      documentReceiver: '',
      ispb: '',
      agencyNumberReceiver: '',
      accountNumberReceiver: '',
    });
  };

  return (
    <div id="deposit-content">
      <div className="bg-white dark:bg-slate-950 rounded-xl shadow-md p-6 transition-all duration-300 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Realizar Depósito</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" role="radiogroup" aria-label="Selecionar tipo de depósito">
          {depositCards.map((card) => (
            <div
              key={card.type}
              className={`deposit-card bg-white dark:bg-slate-800 border rounded-xl p-4 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 ${
                depositType === card.type
                  ? 'border-blue-300 dark:border-blue-500'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
              onClick={() => handleCardSelect(card.type)}
              role="radio"
              aria-checked={depositType === card.type}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleCardSelect(card.type)}
            >
              <div className="flex items-center mb-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                  <FontAwesomeIcon icon={card.icon} className={card.color} />
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{card.title}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{card.description}</p>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                {card.features.map((detail, index) => (
                  <li key={index} className="flex items-center">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-2" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">Conta de destino</h3>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                  <FontAwesomeIcon icon={faUniversity} className="text-blue-600 dark:text-blue-400 text-lg" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Conta Corrente</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ag. {user?.agency} • C/C {user?.accountNumber}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">Titular</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user?.fullName}</p>
              </div>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">Detalhes do depósito</h3>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" htmlFor="deposit-amount">
                  Valor <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 pr-1 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400">R$</span>
                  </div>
                  <Controller
                    name="amount"
                    control={control}
                    render={({ field }) => (
                      <IMaskInput
                        {...field}
                        id="deposit-amount"
                        type="text"
                        mask="num"
                        blocks={{
                          num: {
                            mask: Number,
                            thousandsSeparator: '.',
                            radix: ',',
                            scale: 2,
                            normalizeZeros: true,
                            padFractionalZeros: true,
                          },
                        }}
                        unmask={true}
                        value={field.value || ''}
                        onAccept={(value) => field.onChange(value)}
                        className={`bg-gray-50 dark:bg-gray-800 border ${
                          errors.amount ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                        } text-gray-700 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-9 py-3 transition-all duration-200`}
                        placeholder="0,00"
                        aria-label="Valor do depósito"
                        aria-required="true"
                      />
                    )}
                  />
                </div>
                {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount.message}</p>}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Valor mínimo: R$ 10,00</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" htmlFor="deposit-description">
                  Descrição
                </label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      id="deposit-description"
                      type="text"
                      className={`bg-gray-50 dark:bg-gray-800 border pl-2.5 ${
                        errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                      } text-gray-700 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-3 transition-all duration-200`}
                      placeholder="Ex: Depósito para investimentos"
                      aria-label="Descrição do depósito"
                    />
                  )}
                />
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
              </div>
              {watchedDepositType === 'boleto' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" htmlFor="boleto-type">
                      Tipo de Boleto <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="billetType"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          id="boleto-type"
                          value={boletoType === 'DEPOSIT' ? 'DEPOSIT' : 'expense'}
                          onChange={(e) => {
                            const value = e.target.value as 'DEPOSIT' | 'expense';
                            field.onChange(value === 'DEPOSIT' ? 'DEPOSIT' : 'SHOPPING');
                            handleBoletoTypeChange(e);
                          }}
                          className="bg-gray-50 dark:bg-gray-800 border pl-2.5 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-3 transition-all duration-200"
                          aria-label="Selecionar tipo de boleto"
                          aria-required="true"
                        >
                          <option value="DEPOSIT">Depósito para outra pessoa</option>
                          <option value="expense">Boleto para gasto</option>
                        </select>
                      )}
                    />
                    {errors.billetType && <p className="mt-1 text-xs text-red-500">{errors.billetType.message}</p>}
                  </div>
                  {watchedBilletType !== 'DEPOSIT' && (
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" htmlFor="billetType">
                        Categoria de Gasto <span className="text-red-500">*</span>
                      </label>
                      <Controller
                        name="billetType"
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
                            id="billetType"
                            className={`bg-gray-50 dark:bg-gray-800 border pl-2.5 ${
                              errors.billetType ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                            } text-gray-700 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-3 transition-all duration-200`}
                            aria-label="Selecionar categoria de gasto"
                            aria-required="true"
                          >
                            <option value="">Selecione uma categoria</option>
                            <option value="TRAVEL">Viagem</option>
                            <option value="SHOPPING">Compras</option>
                            <option value="FOOD">Alimentação</option>
                            <option value="LEISURE">Lazer</option>
                            <option value="HEALTH">Saúde</option>
                            <option value="OTHER">Outros</option>
                          </select>
                        )}
                      />
                      {errors.billetType && <p className="mt-1 text-xs text-red-500">{errors.billetType.message}</p>}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          {watchedDepositType === 'boleto' && watchedBilletType === 'DEPOSIT' && (
            <div className="mt-6">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">Dados do Recebedor</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" htmlFor="receiver-name">
                    Nome <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="nameReceiver"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        id="receiver-name"
                        type="text"
                        className={`bg-gray-50 dark:bg-gray-800 border pl-2.5 ${
                          errors.nameReceiver ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                        } text-gray-700 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-3 transition-all duration-200`}
                        placeholder="Nome completo"
                        aria-label="Nome do recebedor"
                        aria-required="true"
                      />
                    )}
                  />
                  {errors.nameReceiver && <p className="mt-1 text-xs text-red-500">{errors.nameReceiver.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" htmlFor="receiver-cpf-cnpj">
                    CPF/CNPJ <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="documentReceiver"
                    control={control}
                    render={({ field }) => (
                      <IMaskInput
                        {...field}
                        id="receiver-cpf-cnpj"
                        type="text"
                        mask={[{ mask: '000.000.000-00', maxLength: 11 }, { mask: '00.000.000/0000-00' }]}
                        unmask={true}
                        value={field.value || ''}
                        onAccept={(value) => field.onChange(value)}
                        className={`bg-gray-50 dark:bg-gray-800 border pl-2.5 ${
                          errors.documentReceiver ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                        } text-gray-700 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-3 transition-all duration-200`}
                        placeholder="CPF ou CNPJ"
                        aria-label="CPF ou CNPJ do recebedor"
                        aria-required="true"
                      />
                    )}
                  />
                  {errors.documentReceiver && (
                    <p className="mt-1 text-xs text-red-500">{errors.documentReceiver.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" htmlFor="receiver-ispb">
                    Banco <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="ispb"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        id="receiver-ispb"
                        className={`bg-gray-50 dark:bg-gray-800 border pl-2.5 ${
                          errors.ispb ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                        } text-gray-700 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-3 transition-all duration-200`}
                        aria-label="Banco do recebedor"
                        aria-required="true"
                      >
                        <option value="">Selecione um banco</option>
                        {banks.map((bank) => (
                          <option key={bank.ispb} value={bank.ispb}>
                            {bank.name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.ispb && <p className="mt-1 text-xs text-red-500">{errors.ispb.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" htmlFor="receiver-agency">
                    Agência <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="agencyNumberReceiver"
                    control={control}
                    render={({ field }) => (
                      <IMaskInput
                        {...field}
                        id="receiver-agency"
                        type="text"
                        mask="0000"
                        unmask={true}
                        value={field.value || ''}
                        onAccept={(value) => field.onChange(value)}
                        className={`bg-gray-50 dark:bg-gray-800 border pl-2.5 ${
                          errors.agencyNumberReceiver ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                        } text-gray-700 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-3 transition-all duration-200`}
                        placeholder="Número da agência"
                        aria-label="Agência do recebedor"
                        aria-required="true"
                      />
                    )}
                  />
                  {errors.agencyNumberReceiver && (
                    <p className="mt-1 text-xs text-red-500">{errors.agencyNumberReceiver.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2" htmlFor="receiver-account">
                    Conta <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="accountNumberReceiver"
                    control={control}
                    render={({ field }) => (
                      <IMaskInput
                        {...field}
                        id="receiver-account"
                        type="text"
                        mask="0000000-0"
                        unmask={true}
                        value={field.value || ''}
                        onAccept={(value) => field.onChange(value)}
                        className={`bg-gray-50 dark:bg-gray-800 border pl-2.5 ${
                          errors.accountNumberReceiver ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                        } text-gray-700 dark:text-gray-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-3 transition-all duration-200`}
                        placeholder="Número da conta"
                        aria-label="Conta do recebedor"
                        aria-required="true"
                      />
                    )}
                  />
                  {errors.accountNumberReceiver && (
                    <p className="mt-1 text-xs text-red-500">{errors.accountNumberReceiver.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label={depositType === 'direct' ? 'Confirmar depósito direto' : 'Gerar boleto'}
            >
              Continuar
            </button>
          </div>
        </form>
      </div>
      <ConfirmationModalDeposit
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        details={details}
        onConfirm={handleModalConfirm}
        reset={() =>
          reset({
            depositType: 'direct',
            billetType: 'DEPOSIT',
            amount: '',
            description: '',
            nameReceiver: '',
            documentReceiver: '',
            ispb: '',
            agencyNumberReceiver: '',
            accountNumberReceiver: '',
          })
        }
      />
    </div>
  );
}

export default DepositContent;