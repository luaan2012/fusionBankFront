import { useState, type ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUniversity,
  faPiggyBank,
  faCreditCard,
  faHandHoldingUsd,
  faCheck,
  faArrowRight,
  faArrowLeft,
  faEye,
  faEyeSlash,
  faCameraRetro,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { type IconDefinition } from '@fortawesome/fontawesome-svg-core';
import ProgressSteps from './ProgressSteps';
import BankCard from './BankCard';

// Define the Bank type
interface Bank {
  name: string;
  icon: IconDefinition;
  iconBg: string;
  iconColor: string;
  features: string[];
  fee: string;
}

// Define the FormData type
interface FormData {
  fullName: string;
  documentType: string;
  cpf: string;
  cnpj: string;
  birthDate: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  enableBiometric: boolean;
  acceptTerms: boolean;
}

// Define the PasswordStrength type
interface PasswordStrength {
  width: number;
  color: string;
  text: string;
}

const RegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    documentType: '',
    cpf: '',
    cnpj: '',
    birthDate: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    enableBiometric: false,
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    width: 0,
    color: 'bg-red-500',
    text: 'Fraca',
  });
  const [passwordMatchError, setPasswordMatchError] = useState<boolean>(false);
  const [cpfValid, setCpfValid] = useState<boolean>(false);
  const [cnpjValid, setCnpjValid] = useState<boolean>(false);
  const [smsVerification, setSmsVerification] = useState<boolean>(false);
  const [emailVerification, setEmailVerification] = useState<boolean>(false);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  const banks: Bank[] = [
    {
      name: 'Banco Digital',
      icon: faUniversity,
      iconBg: 'bg-blue-100 dark:bg-blue-900',
      iconColor: 'text-blue-600 dark:text-blue-300',
      features: ['TED grátis ilimitado', 'Cartão sem anuidade', 'Cashback de 1%'],
      fee: 'R$ 0,00/mês',
    },
    {
      name: 'Banco Invest',
      icon: faPiggyBank,
      iconBg: 'bg-green-100 dark:bg-green-900',
      iconColor: 'text-green-600 dark:text-green-300',
      features: ['Investimento automático', 'CDB 110% do CDI', 'Assessoria exclusiva'],
      fee: 'R$ 9,90/mês',
    },
    {
      name: 'Banco Cartões',
      icon: faCreditCard,
      iconBg: 'bg-purple-100 dark:bg-purple-900',
      iconColor: 'text-purple-600 dark:text-purple-300',
      features: ['Cartão Platinum', 'LoungeKey gratuito', 'Milhas ilimitadas'],
      fee: 'R$ 49,90/mês',
    },
    {
      name: 'Banco Empréstimos',
      icon: faHandHoldingUsd,
      iconBg: 'bg-yellow-100 dark:bg-yellow-900',
      iconColor: 'text-yellow-600 dark:text-yellow-300',
      features: ['Taxas a partir de 0,99%', 'Aprovação em 24h', 'Portabilidade de dívidas'],
      fee: 'R$ 0,00/mês',
    },
  ];

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));

    if (id === 'cpf') {
      let formatted = value.replace(/\D/g, '');
      if (formatted.length > 3) formatted = formatted.substring(0, 3) + '.' + formatted.substring(3);
      if (formatted.length > 7) formatted = formatted.substring(0, 7) + '.' + formatted.substring(7);
      if (formatted.length > 11) formatted = formatted.substring(0, 11) + '-' + formatted.substring(11);
      setFormData((prev) => ({ ...prev, cpf: formatted.substring(0, 14) }));
      setCpfValid(formatted.length === 14);
    }

    if (id === 'cnpj') {
      let formatted = value.replace(/\D/g, '');
      if (formatted.length > 2) formatted = formatted.substring(0, 2) + '.' + formatted.substring(2);
      if (formatted.length > 6) formatted = formatted.substring(0, 6) + '.' + formatted.substring(6);
      if (formatted.length > 10) formatted = formatted.substring(0, 10) + '/' + formatted.substring(10);
      if (formatted.length > 15) formatted = formatted.substring(0, 15) + '-' + formatted.substring(15);
      setFormData((prev) => ({ ...prev, cnpj: formatted.substring(0, 18) }));
      setCnpjValid(formatted.length === 18);
    }

    if (id === 'phone') {
      let formatted = value.replace(/\D/g, '');
      if (formatted.length > 0) formatted = '(' + formatted.substring(0, 2) + ') ' + formatted.substring(2);
      if (formatted.length > 10) formatted = formatted.substring(0, 10) + '-' + formatted.substring(10);
      setFormData((prev) => ({ ...prev, phone: formatted.substring(0, 15) }));
    }

    if (id === 'password') {
      let strength = 0;
      if (value.length >= 8) strength += 1;
      if (value.length >= 12) strength += 1;
      if (/[A-Z]/.test(value)) strength += 1;
      if (/\d/.test(value)) strength += 1;
      if (/[^A-Za-z0-9]/.test(value)) strength += 1;

      let width = 0;
      let color = 'bg-red-500';
      let text = 'Fraca';

      if (strength >= 4) {
        width = 100;
        color = 'bg-green-500';
        text = 'Forte';
      } else if (strength >= 2) {
        width = 66;
        color = 'bg-yellow-500';
        text = 'Média';
      } else if (value.length > 0) {
        width = 33;
        color = 'bg-red-500';
        text = 'Fraca';
      }

      setPasswordStrength({ width, color, text });
      setPasswordMatchError(!!formData.confirmPassword && formData.confirmPassword !== value);
    }

    if (id === 'confirmPassword') {
      setPasswordMatchError(value !== formData.password);
    }
  };

  const validateStep1 = (): boolean => {
    if (!formData.fullName) {
      alert('Por favor, insira seu nome completo.');
      return false;
    }
    if (!formData.documentType) {
      alert('Por favor, selecione o tipo de documento.');
      return false;
    }
    if (formData.documentType === 'cpf' && !cpfValid) {
      alert('Por favor, insira um CPF válido.');
      return false;
    }
    if (formData.documentType === 'cnpj' && !cnpjValid) {
      alert('Por favor, insira um CNPJ válido.');
      return false;
    }
    if (!formData.birthDate) {
      alert('Por favor, insira sua data de nascimento.');
      return false;
    }
    const birthDateObj = new Date(formData.birthDate);
    const ageDiffMs = Date.now() - birthDateObj.getTime();
    const ageDate = new Date(ageDiffMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    if (age < 18) {
      alert('Você deve ter pelo menos 18 anos para criar uma conta.');
      return false;
    }
    if (formData.phone.length < 15) {
      alert('Por favor, insira um número de celular válido.');
      return false;
    }
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      alert('Por favor, insira um endereço de e-mail válido.');
      return false;
    }
    return true;
  };

  const validateStep3 = (): boolean => {
    if (formData.password.length < 8) {
      alert('A senha deve ter pelo menos 8 caracteres.');
      return false;
    }
    if (!/[A-Z]/.test(formData.password)) {
      alert('A senha deve conter pelo menos uma letra maiúscula.');
      return false;
    }
    if (!/\d/.test(formData.password)) {
      alert('A senha deve conter pelo menos um número.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem.');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !selectedBank) {
      alert('Por favor, selecione um banco para continuar.');
      return;
    }
    if (currentStep === 3 && !validateStep3()) return;
    if (currentStep === 4 && !formData.acceptTerms) {
      alert('Por favor, aceite os termos e condições para continuar.');
      return;
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('Form submitted:', formData);
      setCurrentStep(5);
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSendSmsCode = () => {
    if (formData.phone.length < 15) {
      alert('Por favor, insira um número de celular válido.');
      return;
    }
    setSmsVerification(true);
    alert(`Código de verificação enviado para ${formData.phone}`);
  };

  const handleVerifySmsCode = (e: React.MouseEvent<HTMLButtonElement>) => {
    const input = (e.target as HTMLButtonElement).previousSibling as HTMLInputElement;
    if (input.value.length < 6) {
      alert('Por favor, insira o código de 6 dígitos recebido por SMS.');
      return;
    }
    setSmsVerification(false);
    alert('Número de celular verificado com sucesso!');
  };

  const handleSendEmailCode = () => {
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      alert('Por favor, insira um endereço de e-mail válido.');
      return;
    }
    setEmailVerification(true);
    alert(`Código de verificação enviado para ${formData.email}`);
  };

  const handleVerifyEmailCode = (e: React.MouseEvent<HTMLButtonElement>) => {
    const input = (e.target as HTMLButtonElement).previousSibling as HTMLInputElement;
    if (input.value.length < 6) {
      alert('Por favor, insira o código de 6 dígitos recebido por e-mail.');
      return;
    }
    setEmailVerification(false);
    alert('E-mail verificado com sucesso!');
  };

  const handleUploadSelfie = () => {
    alert('Em um ambiente real, isso abriria a câmera para tirar uma selfie com documento.');
  };

  return (
    <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Crie sua conta</h2>
      <ProgressSteps currentStep={currentStep} />
      {currentStep === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nome Completo*
              </label>
              <input
                type="text"
                id="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md input-field focus:outline-none focus:border-blue-500 dark:focus:border-blue-300 bg-white dark:bg-gray-700 dark:text-white"
                placeholder="Digite seu nome completo"
              />
            </div>
            <div>
              <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo de Documento*
              </label>
              <select
                id="documentType"
                value={formData.documentType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md input-field focus:outline-none focus:border-blue-500 dark:focus:border-blue-300 bg-white dark:bg-gray-700 dark:text-white"
              >
                <option value="">Selecione</option>
                <option value="cpf">CPF</option>
                <option value="cnpj">CNPJ</option>
              </select>
            </div>
          </div>
          {formData.documentType === 'cpf' && (
            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                CPF*
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="cpf"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md input-field focus:outline-none focus:border-blue-500 dark:focus:border-blue-300 bg-white dark:bg-gray-700 dark:text-white"
                  placeholder="000.000.000-00"
                />
                {cpfValid && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                  </div>
                )}
              </div>
              {formData.cpf && !cpfValid && <p className="text-xs text-red-500 mt-1">CPF inválido</p>}
            </div>
          )}
          {formData.documentType === 'cnpj' && (
            <div>
              <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                CNPJ*
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md input-field focus:outline-none focus:border-blue-500 dark:focus:border-blue-300 bg-white dark:bg-gray-700 dark:text-white"
                  placeholder="00.000.000/0000-00"
                />
                {cnpjValid && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                  </div>
                )}
              </div>
              {formData.cnpj && !cnpjValid && <p className="text-xs text-red-500 mt-1">CNPJ inválido</p>}
            </div>
          )}
          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Data de Nascimento*
            </label>
            <input
              type="date"
              id="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md input-field focus:outline-none focus:border-blue-500 dark:focus:border-blue-300 bg-white dark:bg-gray-700 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Você precisa ter pelo menos 18 anos</p>
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Celular*
            </label>
            <div className="relative">
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md input-field focus:outline-none focus:border-blue-500 dark:focus:border-blue-300 bg-white dark:bg-gray-700 dark:text-white"
                placeholder="(00) 00000-0000"
              />
              <button
                onClick={handleSendSmsCode}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white text-sm px-3 py-1 rounded-md font-medium hover:bg-blue-600 transition duration-300"
              >
                {smsVerification ? 'Reenviar' : 'Enviar'}
              </button>
            </div>
          </div>
          {smsVerification && (
            <div>
              <label htmlFor="smsCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Código de Verificação*
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="smsCode"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md input-field focus:outline-none focus:border-blue-500 dark:focus:border-blue-300 bg-white dark:bg-gray-700 dark:text-white"
                  placeholder="Digite o código recebido por SMS"
                />
                <button
                  onClick={handleVerifySmsCode}
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition duration-300"
                >
                  Verificar
                </button>
              </div>
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              E-mail*
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md input-field focus:outline-none focus:border-blue-500 dark:focus:border-blue-300 bg-white dark:bg-gray-700 dark:text-white"
                placeholder="Digite seu e-mail"
              />
              <button
                onClick={handleSendEmailCode}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white text-sm px-3 py-1 rounded-md font-medium hover:bg-blue-600 transition duration-300"
              >
                {emailVerification ? 'Reenviar' : 'Enviar'}
              </button>
            </div>
          </div>
          {emailVerification && (
            <div>
              <label htmlFor="emailCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Código de Verificação*
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="emailCode"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md input-field focus:outline-none focus:border-blue-500 dark:focus:border-blue-300 bg-white dark:bg-gray-700 dark:text-white"
                  placeholder="Digite o código recebido por e-mail"
                />
                <button
                  onClick={handleVerifyEmailCode}
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition duration-300"
                >
                  Verificar
                </button>
              </div>
            </div>
          )}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Validação de Identidade (Opcional)
            </label>
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Envie uma selfie segurando seu documento para agilizar a aprovação da sua conta.
                </p>
              </div>
              <button
                onClick={handleUploadSelfie}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <FontAwesomeIcon icon={faCameraRetro} className="mr-2" /> Enviar
              </button>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={handleNextStep}
              className="px-6 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition duration-300"
            >
              Próximo <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </button>
          </div>
        </div>
      )}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div>
            <label htmlFor="bankSearch" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Pesquisar Banco
            </label>
            <div className="relative">
              <input
                type="text"
                id="bankSearch"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md input-field focus:outline-none focus:border-blue-500 dark:focus:border-blue-300 bg-white dark:bg-gray-700 dark:text-white"
                placeholder="Digite o nome do banco"
              />
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banks.map((bank) => (
              <BankCard
                key={bank.name}
                bank={bank}
                isSelected={selectedBank === bank.name}
                onSelect={() => setSelectedBank(bank.name)}
              />
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <button
              onClick={handleBackStep}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Voltar
            </button>
            <button
              onClick={handleNextStep}
              className="px-6 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition duration-300"
            >
              Próximo <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </button>
          </div>
        </div>
      )}
      {currentStep === 3 && (
        <div className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Crie uma senha*
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md input-field focus:outline-none focus:border-blue-500 dark:focus:border-blue-300 bg-white dark:bg-gray-700 dark:text-white"
                placeholder="Digite sua senha"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            <div className="mt-2">
              <div className="flex items-center mb-1">
                <div
                  className={`password-strength ${passwordStrength.color} rounded-full mr-2`}
                  style={{ width: `${passwordStrength.width}%` }}
                ></div>
                <span className="text-xs font-medium">{passwordStrength.text}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas e números.
              </p>
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirme sua senha*
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md input-field focus:outline-none focus:border-blue-500 dark:focus:border-blue-300 bg-white dark:bg-gray-700 dark:text-white"
                placeholder="Digite novamente sua senha"
              />
            </div>
            {passwordMatchError && <p className="text-xs text-red-500 mt-1">As senhas não coincidem</p>}
          </div>
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableBiometric"
                checked={formData.enableBiometric}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-500 dark:text-blue-300 focus:ring-blue-500 dark:focus:ring-blue-300 border-gray-300 dark:border-gray-600 rounded"
              />
              <label htmlFor="enableBiometric" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Habilitar login por biometria (recomendado)
              </label>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Permita acesso rápido e seguro usando sua digital ou reconhecimento facial.
            </p>
          </div>
          <div className="flex justify-between mt-6">
            <button
              onClick={handleBackStep}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Voltar
            </button>
            <button
              onClick={handleNextStep}
              className="px-6 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition duration-300"
            >
              Próximo <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </button>
          </div>
        </div>
      )}
      {currentStep === 4 && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">Confira seus dados</h3>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Informações Pessoais</h4>
                <p className="text-gray-800 dark:text-white">{formData.fullName}</p>
                <p className="text-gray-600 dark:text-gray-300">
                  {formData.documentType === 'cpf' ? `CPF: ${formData.cpf}` : `CNPJ: ${formData.cnpj}`}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Nascimento: {formData.birthDate && new Date(formData.birthDate).toLocaleDateString('pt-BR')}
                </p>
                <p className="text-gray-600 dark:text-gray-300">Celular: {formData.phone}</p>
                <p className="text-gray-600 dark:text-gray-300">E-mail: {formData.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Conta Bancária</h4>
                <p className="text-gray-800 dark:text-white">{selectedBank}</p>
                {banks
                  .find((b) => b.name === selectedBank)
                  ?.features.map((feature, index) => (
                    <p key={index} className="text-gray-600 dark:text-gray-300">
                      {feature}
                    </p>
                  ))}
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="acceptTerms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-500 dark:text-blue-300 focus:ring-blue-500 dark:focus:ring-blue-300 border-gray-300 dark:border-gray-600 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="acceptTerms" className="font-medium text-gray-700 dark:text-gray-300">
                  Eu li e concordo com os{' '}
                  <a href="#" className="text-blue-500 dark:text-blue-300 hover:underline">
                    Termos de Uso
                  </a>{' '}
                  e{' '}
                  <a href="#" className="text-blue-500 dark:text-blue-300 hover:underline">
                    Política de Privacidade
                  </a>{' '}
                  do Banco Digital.
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Ao marcar esta opção, você concorda com o processamento dos seus dados pessoais conforme a LGPD.
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <button
              onClick={handleBackStep}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Voltar
            </button>
            <button
              onClick={handleNextStep}
              className="px-6 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition duration-300"
            >
              Criar Conta <FontAwesomeIcon icon={faCheck} className="ml-2" />
            </button>
          </div>
        </div>
      )}
      {currentStep === 5 && (
        <div className="text-center py-8">
          <div className="success-checkmark mb-6">
            <div className="check-icon">
              <span className="icon-line line-tip"></span>
              <span className="icon-line line-long"></span>
              <div className="icon-circle"></div>
              <div className="icon-fix"></div>
            </div>
          </div>
          <h3 className="text-xl font-medium text-gray-800 dark:text-white mt-8">Conta criada com sucesso!</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Bem-vindo ao Banco Digital. Sua conta está sendo verificada e em breve você receberá um e-mail com os próximos passos.
          </p>
          <button
            onClick={() => alert('Redirecionando para o painel...')}
            className="px-6 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition duration-300"
          >
            Acessar minha conta <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default RegistrationForm;