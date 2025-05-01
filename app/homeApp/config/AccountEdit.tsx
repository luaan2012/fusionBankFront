import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSave,
  faTimes,
  faArrowLeft,
  faExclamationCircle,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';

// Type definitions
interface Account {
  id: string;
  holderName: string;
  accountType: 'checking' | 'savings' | 'investment';
  monthlySalary: number;
  email: string;
  phoneNumber: string;
  address: string;
  accountNumber: string;
  balance: number;
  status: 'active' | 'inactive';
}

interface FormErrors {
  holderName?: string;
  accountType?: string;
  monthlySalary?: string;
  email?: string;
  phoneNumber?: string;
  accountNumber?: string;
  balance?: string;
}

const AccountEditPage: React.FC = () => {
  // Mock initial account data (in a real app, this would come from an API or prop)
  const [account, setAccount] = useState<Account>({
    id: '1',
    holderName: 'João Silva',
    accountType: 'checking',
    monthlySalary: 7500.0,
    email: 'joao.silva@email.com',
    phoneNumber: '(11) 91234-5678',
    address: 'Rua das Flores, 123, São Paulo, SP',
    accountNumber: '123456-7',
    balance: 5000.0,
    status: 'active',
  });

  // Form state
  const [formData, setFormData] = useState<Account>({ ...account });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string>('');

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'balance' || name === 'monthlySalary'
          ? parseFloat(value) || 0
          : value,
    }));
    // Clear error for the field
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Validate form
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.holderName.trim()) {
      newErrors.holderName = 'Nome do titular é obrigatório';
    }
    if (!formData.accountType) {
      newErrors.accountType = 'Tipo de conta é obrigatório';
    }
    if (isNaN(formData.monthlySalary) || formData.monthlySalary < 0) {
      newErrors.monthlySalary = 'Salário mensal deve ser um número não negativo';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Telefone é obrigatório';
    } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Formato inválido (ex: (11) 91234-5678)';
    }
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Número da conta é obrigatório';
    } else if (!/^\d{6}-\d$/.test(formData.accountNumber)) {
      newErrors.accountNumber = 'Formato inválido (ex: 123456-7)';
    }
    if (isNaN(formData.balance) || formData.balance < 0) {
      newErrors.balance = 'Saldo deve ser um número não negativo';
    }
    return newErrors;
  };

  // Handle form submission
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

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setAccount({ ...formData });
      setSubmitMessage('Conta atualizada com sucesso!');
    } catch (error) {
      setSubmitMessage('Erro ao atualizar a conta. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel (reset form to initial account data)
  const handleCancel = () => {
    setFormData({ ...account });
    setErrors({});
    setSubmitMessage('');
  };

  // Handle back (mocked as resetting form for now)
  const handleBack = () => {
    setFormData({ ...account });
    setErrors({});
    setSubmitMessage('');
    // In a real app, navigate to accounts list (e.g., setActiveTab('accounts-list'))
  };

  return (
    <div className="min-h-screen font-sans antialiased transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Editar Conta
            </h2>
            <button
              onClick={handleBack}
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 transition-colors duration-300"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Voltar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Informações Pessoais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Holder Name */}
                <div>
                  <label
                    htmlFor="holderName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Nome do Titular
                  </label>
                  <input
                    type="text"
                    id="holderName"
                    name="holderName"
                    value={formData.holderName}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.holderName
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors duration-300`}
                    aria-invalid={!!errors.holderName}
                    aria-describedby={
                      errors.holderName ? 'holderName-error' : undefined
                    }
                  />
                  {errors.holderName && (
                    <p
                      id="holderName-error"
                      className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center"
                    >
                      <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                      {errors.holderName}
                    </p>
                  )}
                </div>
                {/* Monthly Salary */}
                <div>
                  <label
                    htmlFor="monthlySalary"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Salário Mensal (R$)
                  </label>
                  <input
                    type="number"
                    id="monthlySalary"
                    name="monthlySalary"
                    value={formData.monthlySalary}
                    onChange={handleInputChange}
                    step="0.01"
                    className={`mt-1 block w-full rounded-md border ${
                      errors.monthlySalary
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors duration-300`}
                    aria-invalid={!!errors.monthlySalary}
                    aria-describedby={
                      errors.monthlySalary ? 'monthlySalary-error' : undefined
                    }
                  />
                  {errors.monthlySalary && (
                    <p
                      id="monthlySalary-error"
                      className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center"
                    >
                      <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                      {errors.monthlySalary}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Detalhes da Conta
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Account Type */}
                <div>
                  <label
                    htmlFor="accountType"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Tipo de Conta
                  </label>
                  <select
                    id="accountType"
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.accountType
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors duration-300`}
                    aria-invalid={!!errors.accountType}
                    aria-describedby={
                      errors.accountType ? 'accountType-error' : undefined
                    }
                  >
                    <option value="">Selecione</option>
                    <option value="checking">Corrente</option>
                    <option value="savings">Poupança</option>
                    <option value="investment">Investimento</option>
                  </select>
                  {errors.accountType && (
                    <p
                      id="accountType-error"
                      className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center"
                    >
                      <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                      {errors.accountType}
                    </p>
                  )}
                </div>
                {/* Account Number */}
                <div>
                  <label
                    htmlFor="accountNumber"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Número da Conta
                  </label>
                  <input
                    type="text"
                    id="accountNumber"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.accountNumber
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors duration-300`}
                    placeholder="Ex: 123456-7"
                    aria-invalid={!!errors.accountNumber}
                    aria-describedby={
                      errors.accountNumber ? 'accountNumber-error' : undefined
                    }
                  />
                  {errors.accountNumber && (
                    <p
                      id="accountNumber-error"
                      className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center"
                    >
                      <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                      {errors.accountNumber}
                    </p>
                  )}
                </div>
                {/* Balance */}
                <div>
                  <label
                    htmlFor="balance"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Saldo (R$)
                  </label>
                  <input
                    type="number"
                    id="balance"
                    name="balance"
                    value={formData.balance}
                    onChange={handleInputChange}
                    step="0.01"
                    className={`mt-1 block w-full rounded-md border ${
                      errors.balance
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors duration-300`}
                    aria-invalid={!!errors.balance}
                    aria-describedby={
                      errors.balance ? 'balance-error' : undefined
                    }
                  />
                  {errors.balance && (
                    <p
                      id="balance-error"
                      className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center"
                    >
                      <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                      {errors.balance}
                    </p>
                  )}
                </div>
                {/* Status */}
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors duration-300"
                  >
                    <option value="active">Ativa</option>
                    <option value="inactive">Inativa</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Informações de Contato
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
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
                    className={`mt-1 block w-full rounded-md border ${
                      errors.email
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors duration-300`}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p
                      id="email-error"
                      className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center"
                    >
                      <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>
                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Telefone
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border ${
                      errors.phoneNumber
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors duration-300`}
                    placeholder="Ex: (11) 91234-5678"
                    aria-invalid={!!errors.phoneNumber}
                    aria-describedby={
                      errors.phoneNumber ? 'phoneNumber-error' : undefined
                    }
                  />
                  {errors.phoneNumber && (
                    <p
                      id="phoneNumber-error"
                      className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center"
                    >
                      <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>
                {/* Address */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Endereço
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-colors duration-300"
                    placeholder="Ex: Rua das Flores, 123, São Paulo, SP"
                  />
                </div>
              </div>
            </div>

            {/* Submit Message */}
            {submitMessage && (
              <div
                className={`p-4 rounded-md flex items-center ${
                  submitMessage.includes('sucesso')
                    ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                    : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                }`}
              >
                <FontAwesomeIcon
                  icon={submitMessage.includes('sucesso') ? faSave : faExclamationCircle}
                  className="mr-2"
                />
                {submitMessage}
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 transition-colors duration-300 flex items-center"
                disabled={isSubmitting}
              >
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors duration-300 flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
                ) : (
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                )}
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountEditPage;