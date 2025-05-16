import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUniversity, faHistory, faQrcode, faBolt, faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons';
import TransferCard from '~/components/TransferCard';
import { transferSchema,  type TransferFormData } from '../schema/transferScheme';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { useTransferStore } from '~/context/transferStore';
import { ConfirmationModalTransfer } from '~/components/ConfirmationModalTransfer'
import type { ConfirmationDetails } from 'types'
import { useAccountStore } from '~/context/accountStore'
import { IMaskInput } from 'react-imask'
import { formatToBRL ,formatNumberAccount, CleanString } from '~/utils/utils'
import { useToast } from '~/components/ToastContext'
import SuccessToast from '~/components/SuccessToast'
import { useBankStore } from '~/context/bankStore'

interface TransferCardData {
  type: 'pix' | 'ted' | 'doc';
  icon: typeof faQrcode | typeof faBolt | typeof faFileInvoiceDollar;
  color: string;
  bg: string;
  title: string;
  description: string;
  features: string[];
}

export function TransferContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [details, setDetails] = useState<ConfirmationDetails | null>();
  const [transfer, setTransfer] = useState<TransferFormData | null>();
  const { createTransfer, error } = useTransferStore();
  const { user, updateUser} = useAccountStore();
  const { banks, listBanks} = useBankStore();
  const [transferType, setTransferType] = useState<'pix' | 'ted' | 'doc'>('pix');
  const [keyType, setKeyType] = useState<'cpf' | 'email' | 'celular' | 'aleatorio'>('cpf');
  const tax = { doc: 5, ted: 10 };
  const { openToast } = useToast();
  
  useEffect(() => {
    if (banks.length === 0) {
      listBanks();
    }
  }, [banks.length, listBanks]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      transferType: transferType,
      keyType: keyType,
      keyAccount: '',
      nameReceiver: '',
      bank: '',
      agencyNumberReceiver: '',
      accountNumberReceiver: '',
      documentReceiver: '',
      amount: '',
      description: '',
    },
  });

  const transferCards: TransferCardData[] = [
    {
      type: 'pix',
      icon: faQrcode,
      color: 'text-primary-600 dark:text-primary-400',
      bg: 'bg-primary-100 dark:bg-slate-600',
      title: 'PIX',
      description: 'Transferência instantânea 24/7',
      features: [
        'Disponível a qualquer hora',
        'Sem custo',
        'Limite: R$ 5.000,00',
      ],
    },
    {
      type: 'ted',
      icon: faBolt,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-slate-600',
      title: 'TED',
      description: 'Transferência eletrônica rápida',
      features: ['Processada em até 2h', 'Taxa: R$ 10,00', 'Mínimo: R$ 1.000,00'],
    },
    {
      type: 'doc',
      icon: faFileInvoiceDollar,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-slate-600',
      title: 'DOC',
      description: 'Transferência em horário comercial',
      features: ['Processada em 1 dia útil', 'Taxa: R$ 5,00', 'Mínimo: R$ 1.000,00'],
    },
  ];

// Função para parsear o valor formatado para um número (em reais)
const parseAmount = (value: string): string => {
  if (!value) return '';
  // Remove tudo exceto números, ponto e vírgula, e converte para formato numérico
  const cleanValue = value.replace(/[^\d,.]/g, '').replace(',', '.');
  return cleanValue;
};


  const onSubmit = async (data: TransferFormData) => {
    try {
      const details: ConfirmationDetails = { 
        amount: data.amount,
        tax: "0",
        total: data.amount,
        destination: data.nameReceiver,
        scheduleDate: false,
        description: data.description,
      }

      const resquest: TransferFormData & { accountId: string, accountNumberPayer: string } = {...data,
        ...{
        accountId: user.accountId,
        accountNumberPayer: user.accountNumber,
        keyAccount: data.transferType == 'pix' ? CleanString(data.keyAccount) : '',
      }};

      setDetails(details)
      setTransfer(resquest)
      setIsModalOpen(true);
    } catch (error) {
    }
  };

  const handleModalConfirm = async () => {
    const success = await createTransfer(transfer);
    
    if(!success){
      openToast({
        message: error.message || 'Erro ao tentar fazer a transferencia!',
        type: 'error',
        duration: 4000,
        position: 'top-right'
      });
      return
    } 
    openToast({
        message: 'Transferência realizada com sucesso!',
        type: 'success',
        duration: 2000,
        position: 'top-mid'
      });
      setIsModalOpen(false);
      updateUser()
  };

  // Atualiza transferType e keyType quando o usuário seleciona um cartão
  const handleCardSelect = (type: 'pix' | 'ted' | 'doc') => {
    setTransferType(type);
    setValue('transferType', type);
    if (type === 'pix') {
      setKeyType('cpf');
      setValue('keyType', 'cpf');
    }
  };

  // Atualiza keyType quando o usuário seleciona uma opção no select
  const handleKeyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newKeyType = e.target.value as 'cpf' | 'email' | 'celular' | 'aleatorio';
    setKeyType(newKeyType);
    setValue('keyAccount', ''); // Limpa o campo keyAccount ao mudar o tipo
  };

  return (
    <div className="flex-1">
      <div className="bg-white dark:bg-slate-950 rounded-xl shadow-lg p-6 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Nova Transferência</h2>
          <a
            href="#"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center transition-colors duration-200"
          >
            <FontAwesomeIcon icon={faHistory} className="mr-1" />
            Ver histórico
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {transferCards.map((card) => (
            <TransferCard
              key={card.type}
              type={card.type}
              icon={card.icon}
              color={card.color}
              bg={card.bg}
              title={card.title}
              description={card.description}
              features={card.features}
              isActive={transferType === card.type}
              onSelect={() => handleCardSelect(card.type)}
            />
          ))}
        </div>
        <form id="transfer-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 shadow-sm transition-all duration-200">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Conta de origem</h3>
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4">
                  <FontAwesomeIcon icon={faUniversity} className="text-blue-600 dark:text-blue-400 text-xl" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Conta Corrente</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Ag. {user?.agency} • C/C {formatNumberAccount(user?.accountNumber)}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Saldo disponível</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{formatToBRL(user.balance)}</p>
              </div>
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Conta de destino</h3>
              {transferType === 'pix' ? (
                <div id="pix-form">
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Chave PIX
                    </label>
                    <div className="flex space-x-3">
                      <Controller
                        name="keyType"
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleKeyTypeChange(e);
                            }}
                            className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-24 px-3 py-2.5 transition-all duration-200"
                          >
                            <option value="cpf">CPF</option>
                            <option value="email">E-mail</option>
                            <option value="celular">Celular</option>
                            <option value="aleatorio">Aleatória</option>
                          </select>
                        )}
                      />
                      <Controller
                        name="keyAccount"
                        control={control}
                        render={({ field }) => (
                          <div className="flex-1">
                            <IMaskInput
                              {...field}
                              mask={keyType === 'cpf'
                                  ? '000.000.000-00'
                                  : keyType === 'email'
                                  ? ''
                                  : keyType === 'celular'
                                  ? '(00) 0 0000-0000'
                                  : '0000-0000-0000-0000-0000-0000'}
                              type="text"
                              className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-200"
                              placeholder={
                                keyType === 'cpf'
                                  ? '000.000.000-00'
                                  : keyType === 'email'
                                  ? 'exemplo@email.com'
                                  : keyType === 'celular'
                                  ? '(99) 99999-9999'
                                  : 'Chave aleatória'
                              }
                            />
                            
                          </div>
                        )}
                      />
                    </div>
                    {(errors as any).keyAccount && (
                      <p className="mt-1 text-xs text-red-600">
                        {(errors as any).keyAccount.message}
                      </p>
                    )}
                  </div>
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome do favorecido
                    </label>
                    <Controller
                      name="nameReceiver"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-200"
                          placeholder="Digite o nome completo"
                        />
                      )}
                    />
                    {errors.nameReceiver && (
                      <p className="mt-1 text-xs text-red-600">{errors.nameReceiver.message}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div id="ted-doc-form">
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Banco
                    </label>
                    <Controller
                      name="bank"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-200"
                        >
                          <option value="">Selecione o banco</option>
                          {banks.map((bank) => (
                            <option key={bank.bankId} value={bank.name}>{bank.name}</option>
                          ))}
                        </select>
                      )}
                    />
                    {(errors as any).bank && (
                      <p className="mt-1 text-xs text-red-600">{(errors as any).bank.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                      <label htmlFor='agencyNumberReceiver' className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Agência
                      </label>
                      <Controller
                        name="agencyNumberReceiver"
                        control={control}
                        render={({ field }) => (
                          <IMaskInput
                            {...field}
                            id='agencyNumberReceiver'
                            type="text"
                            mask={'0000'}
                            unmask={true}
                            className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-200"
                            placeholder="0000"
                          />
                        )}
                      />
                      {(errors as any).agencyNumberReceiver && (
                        <p className="mt-1 text-xs text-red-600">{(errors as any).agencyNumberReceiver.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor='accountNumberReceiver' className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Conta
                      </label>
                      <Controller
                        name="accountNumberReceiver"
                        control={control}
                        render={({ field }) => (
                          <IMaskInput
                            type="text"
                            id='accountNumberReceiver'
                            mask="0000000-0"
                            unmask={true}
                            value={field.value || ''} // Garante que o valor inicial seja uma string vazia
                            onAccept={(value) => field.onChange(value)}
                            className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-200"
                            placeholder="0000000-0"
                          />
                        )}
                      />
                      {(errors as any).accountNumberReceiver && (
                        <p className="mt-1 text-xs text-red-600">{(errors as any).accountNumberReceiver.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      CPF/CNPJ do favorecido
                    </label>
                    <Controller
                      name="documentReceiver"
                      control={control}
                      render={({ field }) => (
                    <IMaskInput
                      type="text"
                      id="documentReceiver"
                      mask={[
                        {
                          mask: '000.000.000-00', // Máscara para CPF
                          maxLength: 11,
                        },
                        {
                          mask: '00.000.000/0000-00', // Máscara para CNPJ
                        },
                      ]}
                      unmask={true} // Retorna apenas os dígitos
                      value={field.value || ''} // Garante que o valor inicial seja uma string vazia
                      onAccept={(value) => field.onChange(value)}
                          className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-200"
                          placeholder="000.000.000-00"
                        />
                      )}
                    />
                    {(errors as any).documentReceiver && (
                      <p className="mt-1 text-xs text-red-600">{(errors as any).documentReceiver.message}</p>
                    )}
                  </div>
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome do favorecido
                    </label>
                    <Controller
                      name="nameReceiver"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-200"
                          placeholder="Digite o nome completo"
                        />
                      )}
                    />
                    {errors.nameReceiver && (
                      <p className="mt-1 text-xs text-red-600">{errors.nameReceiver.message}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">Detalhes da transferência</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Valor
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">R$</span>
                  </div>
                  <Controller
                    name="amount"
                    control={control}
                    render={({ field }) => (
                      <IMaskInput
                        {...field}
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
                        unmask={true} // Retorna o valor limpo (ex.: "1234.56")
                        value={field.value || ''} // Garante que o valor inicial seja string
                        onAccept={(value) => field.onChange(value)}
                        className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 transition-all duration-200"
                        placeholder="0,00"
                      />
                    )}
                  />
                </div>
                {errors.amount && <p className="mt-1 text-xs text-red-600">{errors.amount.message}</p>}
                {transferType !== 'pix' && (
                  <p id="min-value" className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Valor mínimo: 'R$ 1.000,00'
                </p>)}
              </div>
              {transferType !== 'pix' && (
                <div id="ted-doc-tax">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 shadow-sm transition-all duration-200">
                    <div className="flex justify-between mb-3">
                      <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Taxa</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {transferType === 'ted' ? formatToBRL(tax.ted) : formatToBRL(tax.doc)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Total</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {formatToBRL(
                          (parseFloat(parseAmount(watch('amount')) || '0') + (transferType === 'ted' ? tax.ted : tax.doc)).toFixed(2)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descrição (opcional)
              </label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all duration-200"
                    placeholder="Ex: Pagamento de serviços"
                  />
                )}
              />
              {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold rounded-lg text-sm transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label="Continuar com a transferência"
            >
              Continuar
            </button>
          </div>
        </form>
      </div>
      <ConfirmationModalTransfer
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        details={details}
        onConfirm={handleModalConfirm}
        reset={reset}
      />
    </div>
  );
}