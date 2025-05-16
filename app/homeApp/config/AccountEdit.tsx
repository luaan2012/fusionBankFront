import React, { useState } from 'react';
import { IMaskInput } from 'react-imask';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSave,
  faTimes,
  faArrowLeft,
  faExclamationCircle,
  faSpinner,
  faSun,
  faMoon,
  faKey,
  faDice,
  faDeleteLeft,
  faTrash,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { useAccountStore } from '~/context/accountStore';
import type { AccountRequest } from 'types';
import { StatusAccount } from '~/models/enum/statusAccount';
import { formatDateToInput, formatToBRLInput, isValidBirthDate } from '~/utils/utils';
import { validarCNPJ, validarCPF } from '~/utils/validators'
import { v4 as uuidv4 } from 'uuid';
import type { RegisterKeyPix } from '~/models/request/registerKeyPix'

// Definição de Tipos
interface FormErrors {
  name?: string;
  lastName?: string;
  salaryPerMonth?: string;
  email?: string;
  phoneNumber?: string;
  document?: string;
  birthDate?: string;
  expensePerDay?: string;
}

interface PixFormErrors {
  keyTypePix?: string;
  keyPix?: string;
}

// Máscaras para IMaskInput
const MASKS = {
  document: [{
      mask: '000.000.000-00', // Máscara para CPF
      maxLength: 11,
    },
    {
      mask: '00.000.000/0000-00', // Máscara para CNPJ
    },
  ],
  phone: '(00) 00000-0000',
  zipCode: '00000-000',
};

export function AccountEditPage() {
  const { user, editAccount, deleteKey, registerKey, loading } = useAccountStore();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(user.darkMode);
  const [activeTab, setActiveTab] = useState<'account' | 'pix'>('pix');
  const [formData, setFormData] = useState<AccountRequest>({
    name: user.name,
    email: user.email,
    document: user.document,
    birthDate: formatDateToInput(user.birthDate),
    phoneNumber: user.phoneNumber,
    salaryPerMonth: user.salaryPerMonth.toString(),
    expensePerDay: user.expensePerDay,
    darkMode: user.darkMode,
    lastName: user.lastName,
    status: user.status,
  });
  const [pixFormData, setPixFormData] = useState<RegisterKeyPix>({
    keyTypePix: user.keyTypePix,
    keyPix: user.keyAccount
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [pixErrors, setPixErrors] = useState<PixFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string>('');

  const generateRandomPixKey = () => {
    const randomKey = uuidv4();
    setPixFormData((prev) => ({
      ...prev,
      keyTypePix: 'RANDOM',
      keyPix: randomKey,
    }));
    setPixErrors({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));

    if (name === 'salaryPerMonth') {
      let cleanedValue = value.replace(/[^\d]/g, '');
      let formatted = cleanedValue.length > 0 ? (parseInt(cleanedValue) / 100).toFixed(2) : '';
      setFormData((prev) => ({ ...prev, salaryPerMonth: formatted }));
    }
  };

  const handleMaskedInputChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handlePixInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPixFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPixErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handlePixMaskedInputChange = (name: string, value: string) => {
    console.log({name, value})
    setPixFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPixErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Nome do titular é obrigatório';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Telefone é obrigatório';
    } else if (!/^\(?\d{2}\)?\s?\d{5}-?\d{4}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Formato inválido (ex: (11) 91234-5678)';
    }
    if (!formData.document.trim()) {
      newErrors.document = 'CPF/CNPJ é obrigatório';
    } else if ((formData.document.length != 11 && formData.document.length != 14) || (formData.document.length === 11 && !validarCPF(formData.document)) || 
    (formData.document.length === 14 && !validarCNPJ(formData.document))) {
      newErrors.document = 'CPF/CNPJ inválido';
    }
    if (!formData.birthDate) {
      newErrors.birthDate = 'Data de nascimento é obrigatória';
    } else if (!isValidBirthDate(formData.birthDate)) {
      newErrors.birthDate = 'Você deve ter pelo menos 18 anos';
    }
    if (isNaN(formData.expensePerDay) || formData.expensePerDay < 0) {
      newErrors.expensePerDay = 'Limite de gastos deve ser um número não negativo';
    } else if (formData.expensePerDay > 10000) {
      newErrors.expensePerDay = 'Limite de gastos não pode exceder R$10.000';
    }
    return newErrors;
  };

  const validatePixForm = (): PixFormErrors => {
    const newErrors: PixFormErrors = {};
    if (!pixFormData.keyTypePix) {
      newErrors.keyPix = 'Tipo de chave Pix é obrigatório';
    }
    if (!pixFormData.keyPix.trim()) {
      newErrors.keyPix = 'Valor da chave Pix é obrigatório';
    } else {
      if (pixFormData.keyTypePix === 'CPF' && !validarCPF(pixFormData.keyPix)) {
        newErrors.keyPix = 'CPF inválido';
      } else if (pixFormData.keyTypePix === 'CNPJ' && !validarCNPJ(pixFormData.keyPix)) {
        newErrors.keyPix = 'CNPJ inválido';
      } else if (pixFormData.keyTypePix === 'EMAIL' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pixFormData.keyPix)) {
        newErrors.keyPix = 'E-mail inválido';
      } else if (pixFormData.keyTypePix === 'PHONE' && !/^\(?\d{2}\)?\s?\d{5}-?\d{4}$/.test(pixFormData.keyPix)) {
        newErrors.keyPix = 'Telefone inválido (ex: (11) 91234-5678)';
      }
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    formData.darkMode = isDarkMode;

    try {
      const response = await editAccount(user.accountId, formData);
      setSubmitMessage(
        response
          ? 'Conta atualizada com sucesso!'
          : 'Erro ao atualizar a conta. Tente novamente.'
      );
      setTimeout(() => setSubmitMessage(''), 3000);
    } catch (error) {
      setSubmitMessage('Erro ao atualizar a conta. Tente novamente.');
      setTimeout(() => setSubmitMessage(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePixSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    const validationErrors = validatePixForm();
    if (Object.keys(validationErrors).length > 0) {
      setPixErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    pixFormData.accountId = user.accountId
    const response = await registerKey(pixFormData);
    
    setSubmitMessage(
        response
          ? 'Chave Pix criada com sucesso!'
          : 'Erro ao criar chave Pix. Tente novamente.'
    );  

    if(response) {
      setPixFormData({ keyTypePix: pixFormData.keyTypePix, keyPix: pixFormData.keyPix });
        setTimeout(() => setSubmitMessage(''), 3000);
        return
      }
      setTimeout(() => setSubmitMessage(''), 3000);
  };

  const handleDelete = async () => {
    var response = await deleteKey()
    
    setSubmitMessage(
        response
          ? 'Chave pix deletada com sucesso!'
          : 'Erro ao deletar chave Pix. Tente novamente.'
      );
    
      if(response) {
      setPixFormData({ keyTypePix: 'CPF', keyPix: '' });
        setTimeout(() => setSubmitMessage(''), 3000);
        return
      }

    setErrors({});
    setPixErrors({});
    setSubmitMessage('');
  };

  const handleCancel = () => {
    setErrors({});
    setPixErrors({});
    setSubmitMessage('');
    setPixFormData({ keyTypePix: 'CPF', keyPix: user.keyAccount });
  };

  const handleBack = () => {
    setErrors({});
    setPixErrors({});
    setSubmitMessage('');
  };

  const handleDeactivate = () => {
    if (window.confirm('Tem certeza que deseja desativar esta conta?')) {
      setFormData((prev) => ({ ...prev, status: StatusAccount.BLOCKED }));
      setSubmitMessage('Conta desativada com sucesso!');
      setTimeout(() => setSubmitMessage(''), 3000);
    }
  };

  return (
    <div
      className="min-h-screen font-sans antialiased transition-colors duration-300"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white dark:bg-slate-950 rounded-2xl shadow-xl p-8 transition-all duration-300 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {activeTab === 'pix' ? 'Criar Chave Pix' : 'Editar Conta'}
            </h2>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <label className="flex items-center cursor-pointer">
                  <span className="sr-only">Alternar modo escuro</span>
                  <div className="dark-mode-toggle">
                    <div
                      className={`dark-mode-toggle-circle ${
                        isDarkMode ? 'dark' : ''
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={isDarkMode ? faMoon : faSun}
                        className="text-xs text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isDarkMode}
                    onChange={() => setIsDarkMode(!isDarkMode)}
                    className="sr-only"
                  />
                </label>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {isDarkMode ? 'Modo Escuro' : 'Modo Claro'}
                </span>
              </div>
              <button
                onClick={handleBack}
                className="flex items-center px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg transition-all duration-200"
                aria-label="Voltar para lista de contas"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Voltar
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'pix'
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('pix')}
            >
              Criar Chave Pix
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'account'
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('account')}
            >
              Editar Conta
            </button>
          </div>

          {activeTab === 'pix' ? (
            <form
              onSubmit={handlePixSubmit}
              className="space-y-10"
              role="form"
              aria-label="Formulário de criação de chave Pix"
            >
              {/* Criação de Chave Pix */}
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Criar Nova Chave Pix
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label
                      htmlFor="pixKeyType"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Tipo de Chave Pix
                    </label>
                    <select
                      id="keyTypePix"
                      name="keyTypePix"
                      value={pixFormData.keyTypePix}
                      onChange={handlePixInputChange}
                      className={`mt-2 block w-full rounded-lg border py-3 px-4 text-sm ${
                        pixErrors.keyPix
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/50'
                          : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
                      } text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                      aria-invalid={!!pixErrors.keyPix}
                      aria-describedby={
                        pixErrors.keyPix ? 'pixKeyType-error' : 'pixKeyType-help'
                      }
                    >
                      <option value="CPF">CPF</option>
                      <option value="CNPJ">CNPJ</option>
                      <option value="EMAIL">E-mail</option>
                      <option value="PHONE">Telefone</option>
                      <option value="RANDOM">Chave Aleatória</option>
                    </select>
                    <p
                      id="pixKeyType-help"
                      className="mt-1 text-xs text-gray-500 dark:text-gray-400"
                    >
                      Selecione o tipo de chave Pix
                    </p>
                    {pixErrors.keyPix && (
                      <p
                        id="pixKeyType-error"
                        className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center animate-pulse"
                      >
                        <FontAwesomeIcon
                          icon={faExclamationCircle}
                          className="mr-1"
                        />
                        {pixErrors.keyPix}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="keyTypePix"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Valor da Chave Pix
                    </label>
                    <div className="mt-2 flex items-center space-x-2">
                      {pixFormData.keyTypePix === 'CPF' || pixFormData.keyTypePix === 'CNPJ' ? (
                        <IMaskInput
                          mask={pixFormData.keyTypePix === 'CPF' ? MASKS.document[0].mask : MASKS.document[1].mask}
                          value={pixFormData.keyPix}
                          unmask={true}
                          onAccept={(value) =>
                            handlePixMaskedInputChange('keyPix', value)
                          }
                          className={`block w-full rounded-lg border py-3 px-4 text-sm ${
                            pixErrors.keyPix
                              ? 'border-red-500 bg-red-50 dark:bg-red-900/50'
                              : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
                          } text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                          aria-invalid={!!pixErrors.keyPix}
                          aria-describedby={
                            pixErrors.keyPix ? 'pixKeyValue-error' : 'pixKeyValue-help'
                          }
                        />
                      ) : pixFormData.keyTypePix === 'PHONE' ? (
                        <IMaskInput
                          mask={MASKS.phone}
                          value={pixFormData.keyPix}
                          unmask={true}
                          onAccept={(value) =>
                            handlePixMaskedInputChange('keyPix', value)
                          }
                          className={`block w-full rounded-lg border py-3 px-4 text-sm ${
                            pixErrors.keyPix
                              ? 'border-red-500 bg-red-50 dark:bg-red-900/50'
                              : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
                          } text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                          aria-invalid={!!pixErrors.keyPix}
                          aria-describedby={
                            pixErrors.keyPix ? 'pixKeyValue-error' : 'pixKeyValue-help'
                          }
                        />
                      ) : pixFormData.keyTypePix === 'EMAIL' ? (
                          <input
                            type="email"
                            id="pixKeyValue"
                            name="keyPix"
                            value={pixFormData.keyPix}
                            onChange={handlePixInputChange}
                            className={`block w-full rounded-lg border py-3 px-4 text-sm ${
                              pixErrors.keyPix
                                ? 'border-red-500 bg-red-50 dark:bg-red-900/50'
                                : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
                            } text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                            aria-invalid={!!pixErrors.keyPix}
                            aria-describedby={
                              pixErrors.keyPix ? 'pixKeyValue-error' : 'pixKeyValue-help'
                            }
                          />
                        ) : (
                        <>
                            <input
                              type="text"
                              id="keyPix"
                              name="keyPix"
                              value={pixFormData.keyPix}
                              onChange={handlePixInputChange}
                              readOnly={pixFormData.keyTypePix === 'RANDOM'}
                              className={`block w-full rounded-lg border py-3 px-4 text-sm ${
                                pixErrors.keyPix
                                  ? 'border-red-500 bg-red-50 dark:bg-red-900/50'
                                  : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
                              } text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                                pixFormData.keyTypePix === 'RANDOM' ? 'cursor-not-allowed' : ''
                              }`}
                              aria-invalid={!!pixErrors.keyPix}
                              aria-describedby={
                                pixErrors.keyPix ? 'pixKeyValue-error' : 'pixKeyValue-help'
                              }
                            />
                            <button
                              type="button"
                              onClick={generateRandomPixKey}
                              className="px-3 py-2 bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-500 dark:to-purple-600 text-white rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-purple-800 dark:hover:from-purple-600 dark:hover:to-purple-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 flex items-center"
                              aria-label="Gerar chave aleatória"
                              disabled={isSubmitting}
                            >
                              <FontAwesomeIcon icon={faDice} className="mr-2" />
                              Gerar
                            </button>
                          
                        </>
                        )}
                        
                      
                    </div>
                    <p
                      id="pixKeyValue-help"
                      className="mt-1 text-xs text-gray-500 dark:text-gray-400"
                    >
                      {pixFormData.keyTypePix === 'CPF' ? 'Ex: 123.456.789-09' :
                      pixFormData.keyTypePix === 'CNPJ' ? 'Ex: 12.345.678/0001-00' :
                      pixFormData.keyTypePix === 'PHONE' ? 'Ex: (11) 91234-5678' :
                      pixFormData.keyTypePix === 'EMAIL' ? 'Ex: usuario@email.com' :
                      'Chave aleatória gerada automaticamente'}
                    </p>
                    {pixErrors.keyPix && (
                      <p
                        id="pixKeyValue-error"
                        className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center animate-pulse"
                      >
                        <FontAwesomeIcon
                          icon={faExclamationCircle}
                          className="mr-1"
                        />
                        {pixErrors.keyPix}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Mensagem de Submissão */}
              {submitMessage && (
                <div
                  className={`p-4 rounded-xl flex items-center animate-slide-in ${
                    submitMessage.includes('sucesso')
                      ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                      : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
                  }`}
                  role="alert"
                  aria-live="assertive"
                >
                  <FontAwesomeIcon
                    icon={
                      submitMessage.includes('sucesso')
                        ? faSave
                        : faExclamationCircle
                    }
                    className="mr-2"
                  />
                  {submitMessage}
                </div>
              )}

              {/* Botões */}
              <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-6 py-3 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-semibold hover:from-gray-400 hover:to-gray-500 dark:hover:from-gray-600 dark:hover:to-gray-700 hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                  disabled={!user.keyAccount}
                  aria-label="Excluir chave Pix"
                  aria-disabled={loading}
                  title="Excluir a chave Pix atual"
                >
                  {loading ? (
                    <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin text-sm" />
                  ) : (
                    <FontAwesomeIcon icon={!user.keyAccount ? faLock :faTrash} className="mr-2 text-sm" />
                  )}
                  {loading ? 'Excluindo...' : 'Excluir'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-800 dark:from-blue-600 dark:to-blue-700 text-white rounded-lg text-sm font-semibold hover:from-blue-800 hover:to-blue-900 dark:hover:from-blue-700 dark:hover:to-blue-800 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                  disabled={loading}
                  aria-label="Criar chave Pix"
                  aria-disabled={loading}
                  title="Criar uma nova chave Pix"
                >
                  {loading ? (
                    <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin text-sm" />
                  ) : (
                    <FontAwesomeIcon icon={faKey} className="mr-2 text-sm" />
                  )}
                  {loading ? 'Criando...' : 'Criar Chave'}
                </button>
              </div>
            </form>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-10"
              role="form"
              aria-label="Formulário de edição de conta"
            >
              {/* Informações Pessoais */}
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Informações Pessoais
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Nome do Titular
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`mt-2 block w-full rounded-lg border py-3 px-4 text-sm ${
                        errors.name
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/50'
                          : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
                      } text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                      aria-invalid={!!errors.name}
                      aria-describedby={
                        errors.name ? 'holderName-error' : 'holderName-help'
                      }
                    />
                    <p
                      id="holderName-help"
                      className="mt-1 text-xs text-gray-500 dark:text-gray-400"
                    >
                      Nome completo do titular da conta
                    </p>
                    {errors.name && (
                      <p
                        id="holderName-error"
                        className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center animate-pulse"
                      >
                        <FontAwesomeIcon
                          icon={faExclamationCircle}
                          className="mr-1"
                        />
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="document"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      CPF/CNPJ
                    </label>
                    <IMaskInput
                      mask={MASKS.document}
                      value={formData.document}
                      unmask={true}
                      onAccept={(value) =>
                        handleMaskedInputChange('document', value)
                      }
                      className={`mt-2 block w-full rounded-lg border py-3 px-4 text-sm ${
                        errors.document
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/50'
                          : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
                      } text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                      aria-invalid={!!errors.document}
                      aria-describedby={
                        errors.document ? 'cpf-error' : 'cpf-help'
                      }
                    />
                    <p
                      id="cpf-help"
                      className="mt-1 text-xs text-gray-500 dark:text-gray-400"
                    >
                      Ex: 123.456.789-09
                    </p>
                    {errors.document && (
                      <p
                        id="cpf-error"
                        className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center animate-pulse"
                      >
                        <FontAwesomeIcon
                          icon={faExclamationCircle}
                          className="mr-1"
                        />
                        {errors.document}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="birthDate"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Data de Nascimento
                    </label>
                    <input
                      type="date"
                      id="birthDate"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      className={`mt-2 block w-full rounded-lg border py-3 px-4 text-sm ${
                        errors.birthDate
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/50'
                          : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
                      } text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                      aria-invalid={!!errors.birthDate}
                      aria-describedby={
                        errors.birthDate ? 'birthDate-error' : 'birthDate-help'
                      }
                    />
                    <p
                      id="birthDate-help"
                      className="mt-1 text-xs text-gray-500 dark:text-gray-400"
                    >
                      Ex: 1990-05-15
                    </p>
                    {errors.birthDate && (
                      <p
                        id="birthDate-error"
                        className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center animate-pulse"
                      >
                        <FontAwesomeIcon
                          icon={faExclamationCircle}
                          className="mr-1"
                        />
                        {errors.birthDate}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="salaryPerMonth"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Salário Mensal (R$)
                    </label>
                    <input
                      type="text"
                      id="salaryPerMonth"
                      name="salaryPerMonth"
                      value={formatToBRLInput(formData?.salaryPerMonth || '0')}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className={`mt-2 block w-full rounded-lg border py-3 px-4 text-sm ${
                        errors.salaryPerMonth
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/50'
                          : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
                      } text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                      aria-invalid={!!errors.salaryPerMonth}
                      aria-describedby={
                        errors.salaryPerMonth
                          ? 'monthlySalary-error'
                          : 'monthlySalary-help'
                      }
                    />
                    <p
                      id="monthlySalary-help"
                      className="mt-1 text-xs text-gray-500 dark:text-gray-400"
                    >
                      Salário mensal em reais
                    </p>
                    {errors.salaryPerMonth && (
                      <p
                        id="monthlySalary-error"
                        className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center animate-pulse"
                      >
                        <FontAwesomeIcon
                          icon={faExclamationCircle}
                          className="mr-1"
                        />
                        {errors.salaryPerMonth}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Informações de Contato */}
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Informações de Contato
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      E-mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`mt-2 block w-full rounded-lg border py-3 px-4 text-sm ${
                        errors.email
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/50'
                          : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
                      } text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? 'email-error' : 'email-help'
                      }
                    />
                    <p
                      id="email-help"
                      className="mt-1 text-xs text-gray-500 dark:text-gray-400"
                    >
                      Ex: usuario@email.com
                    </p>
                    {errors.email && (
                      <p
                        id="email-error"
                        className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center animate-pulse"
                      >
                        <FontAwesomeIcon
                          icon={faExclamationCircle}
                          className="mr-1"
                        />
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Telefone
                    </label>
                    <IMaskInput
                      mask={MASKS.phone}
                      unmask={true}
                      value={formData.phoneNumber}
                      onAccept={(value) =>
                        handleMaskedInputChange('phoneNumber', value)
                      }
                      className={`mt-2 block w-full rounded-lg border py-3 px-4 text-sm ${
                        errors.phoneNumber
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/50'
                          : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
                      } text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                      aria-invalid={!!errors.phoneNumber}
                      aria-describedby={
                        errors.phoneNumber
                          ? 'phoneNumber-error'
                          : 'phoneNumber-help'
                      }
                    />
                    <p
                      id="phoneNumber-help"
                      className="mt-1 text-xs text-gray-500 dark:text-gray-400"
                    >
                      Ex: (11) 91234-5678
                    </p>
                    {errors.phoneNumber && (
                      <p
                        id="phoneNumber-error"
                        className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center animate-pulse"
                      >
                        <FontAwesomeIcon
                          icon={faExclamationCircle}
                          className="mr-1"
                        />
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Limite de Gastos Diários */}
              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Limite de Gastos Diários
                </h3>
                <div className="grid grid-cols-1 gap-8">
                  <div>
                    <label
                      htmlFor="expensePerDay"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Limite de Gastos Diários (R$)
                    </label>
                    <div className="mt-2 flex items-center">
                      <input
                        type="range"
                        id="expensePerDay"
                        name="expensePerDay"
                        min="0"
                        max="10000"
                        step="100"
                        value={formData.expensePerDay}
                        onChange={handleInputChange}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="ml-4 text-sm font-medium text-gray-900 dark:text-white">
                        R$ {formData.expensePerDay}
                      </span>
                    </div>
                    <p
                      id="dailySpendingLimit-help"
                      className="mt-1 text-xs text-gray-500 dark:text-gray-400"
                    >
                      Arraste para definir o limite diário de gastos
                    </p>
                    {errors.expensePerDay && (
                      <p
                        id="dailySpendingLimit-error"
                        className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center animate-pulse"
                      >
                        <FontAwesomeIcon
                          icon={faExclamationCircle}
                          className="mr-1"
                        />
                        {errors.expensePerDay}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Mensagem de Submissão */}
              {submitMessage && (
                <div
                  className={`p-4 rounded-xl flex items-center animate-slide-in ${
                    submitMessage.includes('sucesso')
                      ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                      : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
                  }`}
                  role="alert"
                  aria-live="assertive"
                >
                  <FontAwesomeIcon
                    icon={
                      submitMessage.includes('sucesso')
                        ? faSave
                        : faExclamationCircle
                    }
                    className="mr-2"
                  />
                  {submitMessage}
                </div>
              )}

              {/* Botões */}
              <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2.5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-white rounded-lg text-sm font-semibold hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-600 dark:hover:to-gray-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 flex items-center justify-center"
                  disabled={loading}
                  aria-label="Cancelar alterações"
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-2" />
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 flex items-center justify-center"
                  disabled={loading}
                  aria-label="Salvar alterações"
                >
                  {loading ? (
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="mr-2 animate-spin"
                    />
                  ) : (
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                  )}
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
                <button
                  type="button"
                  onClick={handleDeactivate}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 dark:from-red-500 dark:to-red-600 text-white rounded-lg text-sm font-semibold hover:from-red-700 hover:to-red-800 dark:hover:from-red-600 dark:hover:to-red-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 flex items-center justify-center"
                  disabled={
                    loading || formData.status === StatusAccount.BLOCKED
                  }
                  aria-label="Desativar conta"
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-2" />
                  Desativar Conta
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}