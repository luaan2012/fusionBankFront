import React, { useState, useEffect } from 'react';
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
} from '@fortawesome/free-solid-svg-icons';

// Definição de Tipos
interface Account {
  id: string;
  holderName: string;
  monthlySalary: number;
  email: string;
  phoneNumber: string;
  cpf: string;
  birthDate: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  dailySpendingLimit: number;
  status: 'active' | 'inactive';
}

interface FormErrors {
  holderName?: string;
  monthlySalary?: string;
  email?: string;
  phoneNumber?: string;
  cpf?: string;
  birthDate?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  dailySpendingLimit?: string;
}

const AccountEditPage: React.FC = () => {
  // Estado do Modo Escuro
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return (
      localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });

  // Aplicar classe de modo escuro ao root
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Dados iniciais mockados da conta
  const [account, setAccount] = useState<Account>({
    id: '1',
    holderName: 'João Silva',
    monthlySalary: 7500.0,
    email: 'joao.silva@email.com',
    phoneNumber: '(11) 91234-5678',
    cpf: '123.456.789-09',
    birthDate: '1990-05-15',
    street: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    dailySpendingLimit: 5000.0,
    status: 'active',
  });

  // Estado do formulário
  const [formData, setFormData] = useState<Account>({ ...account });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string>('');

  // Manipulação de mudanças nos inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : name === 'monthlySalary' || name === 'dailySpendingLimit'
          ? parseFloat(value) || 0
          : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Manipulação de mudanças nos inputs mascarados
  const handleMaskedInputChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Validação do formulário
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.holderName.trim()) {
      newErrors.holderName = 'Nome do titular é obrigatório';
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
    } else if (!/^\(\d{2}\)\s\d{5}-\d{4}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Formato inválido (ex: (11) 91234-5678)';
    }
    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
      newErrors.cpf = 'Formato inválido (ex: 123.456.789-09)';
    }
    if (!formData.birthDate) {
      newErrors.birthDate = 'Data de nascimento é obrigatória';
    }
    if (!formData.street.trim()) {
      newErrors.street = 'Rua é obrigatória';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'Cidade é obrigatória';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'Estado é obrigatório';
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'CEP é obrigatório';
    } else if (!/^\d{5}-\d{3}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Formato inválido (ex: 01234-567)';
    }
    if (isNaN(formData.dailySpendingLimit) || formData.dailySpendingLimit < 0) {
      newErrors.dailySpendingLimit = 'Limite de gastos deve ser um número não negativo';
    }
    return newErrors;
  };

  // Submissão do formulário
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
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setAccount({ ...formData });
      setSubmitMessage('Conta atualizada com sucesso!');
    } catch (error) {
      setSubmitMessage('Erro ao atualizar a conta. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancelar alterações
  const handleCancel = () => {
    setFormData({ ...account });
    setErrors({});
    setSubmitMessage('');
  };

  // Voltar
  const handleBack = () => {
    setFormData({ ...account });
    setErrors({});
    setSubmitMessage('');
  };

  // Desativar conta
  const handleDeactivate = () => {
    if (window.confirm('Tem certeza que deseja desativar esta conta?')) {
      setFormData((prev) => ({ ...prev, status: 'inactive' }));
      setSubmitMessage('Conta desativada com sucesso!');
    }
  };

  return (
    <div className="min-h-screen font-sans antialiased transition-colors duration-300 bg-transparent">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-950 rounded-xl shadow-md p-6 transition-all duration-300 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Editar Conta
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="flex items-center cursor-pointer">
                  <span className="sr-only">Alternar modo escuro</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={isDarkMode}
                      onChange={() => setIsDarkMode(!isDarkMode)}
                      className="sr-only"
                    />
                    <div className="block bg-gray-300 dark:bg-gray-600 w-10 h-5 rounded-full transition-all duration-200"></div>
                    <div
                      className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform duration-200 flex items-center justify-center ${
                        isDarkMode ? 'transform translate-x-5 bg-blue-600' : ''
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={isDarkMode ? faMoon : faSun}
                        className="text-xs text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>
                </label>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {isDarkMode ? 'Modo Escuro' : 'Modo Claro'}
                </span>
              </div>
              <button
                onClick={handleBack}
                className="flex items-center px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                aria-label="Voltar para lista de contas"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Voltar
              </button>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-8"
            role="form"
            aria-label="Formulário de edição de conta"
          >
            {/* Informações Pessoais */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Informações Pessoais
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    className={`mt-1 block w-full rounded-lg border py-3 px-4 text-sm ${
                      errors.holderName
                        ? 'border-red-500 bg-red-50 dark:bg-red-900'
                        : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                    } text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                    aria-invalid={!!errors.holderName}
                    aria-describedby={
                      errors.holderName ? 'holderName-error' : 'holderName-help'
                    }
                  />
                  <p
                    id="holderName-help"
                    className="mt-1 text-xs text-gray-500 dark:text-gray-400"
                  >
                    Nome completo do titular da conta
                  </p>
                  {errors.holderName && (
                    <p
                      id="holderName-error"
                      className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center animate-pulse"
                    >
                      <FontAwesomeIcon
                        icon={faExclamationCircle}
                        className="mr-1"
                      />
                      {errors.holderName}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="cpf"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    CPF
                  </label>
                  <IMaskInput
                    mask="000.000.000-00"
                    value={formData.cpf}
                    onAccept={(value) => handleMaskedInputChange('cpf', value)}
                    className={`mt-1 block w-full rounded-lg border py-3 px-4 text-sm ${
                      errors.cpf
                        ? 'border-red-500 bg-red-50 dark:bg-red-900'
                        : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                    } text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                    aria-invalid={!!errors.cpf}
                    aria-describedby={errors.cpf ? 'cpf-error' : 'cpf-help'}
                  />
                  <p
                    id="cpf-help"
                    className="mt-1 text-xs text-gray-500 dark:text-gray-400"
                  >
                    Ex: 123.456.789-09
                  </p>
                  {errors.cpf && (
                    <p
                      id="cpf-error"
                      className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center animate-pulse"
                    >
                      <FontAwesomeIcon
                        icon={faExclamationCircle}
                        className="mr-1"
                      />
                      {errors.cpf}
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
                    className={`mt-1 block w-full rounded-lg border py-3 px-4 text-sm ${
                      errors.birthDate
                        ? 'border-red-500 bg-red-50 dark:bg-red-900'
                        : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                    } text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
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
                    className={`mt-1 block w-full rounded-lg border py-3 px-4 text-sm ${
                      errors.monthlySalary
                        ? 'border-red-500 bg-red-50 dark:bg-red-900'
                        : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                    } text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                    aria-invalid={!!errors.monthlySalary}
                    aria-describedby={
                      errors.monthlySalary
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
                  {errors.monthlySalary && (
                    <p
                      id="monthlySalary-error"
                      className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center animate-pulse"
                    >
                      <FontAwesomeIcon
                        icon={faExclamationCircle}
                        className="mr-1"
                      />
                      {errors.monthlySalary}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Informações de Contato */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Informações de Contato
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    className={`mt-1 block w-full rounded-lg border py-3 px-4 text-sm ${
                      errors.email
                        ? 'border-red-500 bg-red-50 dark:bg-red-900'
                        : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                    } text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : 'email-help'}
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
                    mask="(00) 00000-0000"
                    value={formData.phoneNumber}
                    onAccept={(value) =>
                      handleMaskedInputChange('phoneNumber', value)
                    }
                    className={`mt-1 block w-full rounded-lg border py-3 px-4 text-sm ${
                      errors.phoneNumber
                        ? 'border-red-500 bg-red-50 dark:bg-red-900'
                        : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                    } text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                    aria-invalid={!!errors.phoneNumber}
                    aria-describedby={
                      errors.phoneNumber ? 'phoneNumber-error' : 'phoneNumber-help'
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

            {/* Endereço */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Endereço
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="street"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Rua
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-lg border py-3 px-4 text-sm ${
                      errors.street
                        ? 'border-red-500 bg-red-50 dark:bg-red-900'
                        : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                    } text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                    aria-invalid={!!errors.street}
                    aria-describedby={errors.street ? 'street-error' : 'street-help'}
                  />
                  <p
                    id="street-help"
                    className="mt-1 text-xs text-gray-500 dark:text-gray-400"
                  >
                    Ex: Rua das Flores, 123
                  </p>
                  {errors.street && (
                    <p
                      id="street-error"
                      className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center animate-pulse"
                    >
                      <FontAwesomeIcon
                        icon={faExclamationCircle}
                        className="mr-1"
                      />
                      {errors.street}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Cidade
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-lg border py-3 px-4 text-sm ${
                      errors.city
                        ? 'border-red-500 bg-red-50 dark:bg-red-900'
                        : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                    } text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                    aria-invalid={!!errors.city}
                    aria-describedby={errors.city ? 'city-error' : 'city-help'}
                  />
                  <p
                    id="city-help"
                    className="mt-1 text-xs text-gray-500 dark:text-gray-400"
                  >
                    Ex: São Paulo
                  </p>
                  {errors.city && (
                    <p
                      id="city-error"
                      className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center animate-pulse"
                    >
                      <FontAwesomeIcon
                        icon={faExclamationCircle}
                        className="mr-1"
                      />
                      {errors.city}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Estado
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-lg border py-3 px-4 text-sm ${
                      errors.state
                        ? 'border-red-500 bg-red-50 dark:bg-red-900'
                        : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                    } text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                    aria-invalid={!!errors.state}
                    aria-describedby={errors.state ? 'state-error' : 'state-help'}
                  >
                    <option value="">Selecione</option>
                    {[
                      'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
                      'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
                      'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
                    ].map((uf) => (
                      <option key={uf} value={uf}>
                        {uf}
                      </option>
                    ))}
                  </select>
                  <p
                    id="state-help"
                    className="mt-1 text-xs text-gray-500 dark:text-gray-400"
                  >
                    Ex: SP
                  </p>
                  {errors.state && (
                    <p
                      id="state-error"
                      className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center animate-pulse"
                    >
                      <FontAwesomeIcon
                        icon={faExclamationCircle}
                        className="mr-1"
                      />
                      {errors.state}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="zipCode"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    CEP
                  </label>
                  <IMaskInput
                    mask="00000-000"
                    value={formData.zipCode}
                    onAccept={(value) => handleMaskedInputChange('zipCode', value)}
                    className={`mt-1 block w-full rounded-lg border py-3 px-4 text-sm ${
                      errors.zipCode
                        ? 'border-red-500 bg-red-50 dark:bg-red-900'
                        : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                    } text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
                    aria-invalid={!!errors.zipCode}
                    aria-describedby={
                      errors.zipCode ? 'zipCode-error' : 'zipCode-help'
                    }
                  />
                  <p
                    id="zipCode-help"
                    className="mt-1 text-xs text-gray-500 dark:text-gray-400"
                  >
                    Ex: 01234-567
                  </p>
                  {errors.zipCode && (
                    <p
                      id="zipCode-error"
                      className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center animate-pulse"
                    >
                      <FontAwesomeIcon
                        icon={faExclamationCircle}
                        className="mr-1"
                      />
                      {errors.zipCode}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Limite de Gastos Diários */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Limite de Gastos Diários
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label
                    htmlFor="dailySpendingLimit"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Limite de Gastos Diários (R$)
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="range"
                      id="dailySpendingLimit"
                      name="dailySpendingLimit"
                      min="0"
                      max="10000"
                      step="100"
                      value={formData.dailySpendingLimit}
                      onChange={handleInputChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    <span className="ml-4 text-sm text-gray-900 dark:text-gray-100">
                      R$ {formData.dailySpendingLimit.toFixed(2)}
                    </span>
                  </div>
                  <p
                    id="dailySpendingLimit-help"
                    className="mt-1 text-xs text-gray-500 dark:text-gray-400"
                  >
                    Arraste para definir o limite diário de gastos
                  </p>
                  {errors.dailySpendingLimit && (
                    <p
                      id="dailySpendingLimit-error"
                      className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center animate-pulse"
                    >
                      <FontAwesomeIcon
                        icon={faExclamationCircle}
                        className="mr-1"
                      />
                      {errors.dailySpendingLimit}
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
                    ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                    : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
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
                className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100 rounded-lg text-sm font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 flex items-center justify-center"
                disabled={isSubmitting}
                aria-label="Cancelar alterações"
              >
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 dark:bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 flex items-center justify-center"
                disabled={isSubmitting}
                aria-label="Salvar alterações"
              >
                {isSubmitting ? (
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="mr-2 animate-spin"
                  />
                ) : (
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                )}
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </button>
              <button
                type="button"
                onClick={handleDeactivate}
                className="px-6 py-2.5 bg-red-600 dark:bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-700 dark:hover:bg-red-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 flex items-center justify-center"
                disabled={isSubmitting || formData.status === 'inactive'}
                aria-label="Desativar conta"
              >
                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                Desativar Conta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountEditPage;