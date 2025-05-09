import { useEffect, useState, type ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faArrowRight,
  faArrowLeft,
  faEye,
  faEyeSlash,
  faCameraRetro,
  faMagnifyingGlass,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import ProgressSteps from '~/components/ProgressSteps';
import BankCard from '~/components/BankCard';
import { useBankStore } from '~/context/bankStore';
import { mapBanksToDisplay } from '~/utils/map';
import { useAccountStore } from '~/context/accountStore';
import { formatToBRLInput } from 'utils';
import { useNavigate } from 'react-router';
import type { Bank } from '~/models/bank';
import { validarCNPJ, validarCPF } from '~/utils/validators';

interface FormError {
  error: boolean;
  message: string;
}

interface RegisterRequest {
  name: string;
  lastName: string;
  phoneNumber: string;
  salaryPerMonth: string;
  accountType: string;
  bankISBP: string;
  bankName: string;
  documentType: 'CPF' | 'CNPJ';
  email: string;
  document: string;
  password: string;
  confirmPassword: string;
  birthDate: string;
}

interface PasswordStrength {
  width: number;
  color: string;
  text: string;
}

export function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const { banks, listBanks } = useBankStore();
  const { register } = useAccountStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterRequest>({
    name: '',
    lastName: '',
    phoneNumber: '',
    salaryPerMonth: '',
    accountType: 'CheckingAccount',
    bankISBP: '',
    bankName: '',
    documentType: 'CPF',
    email: '',
    document: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    width: 0,
    color: 'bg-red-500',
    text: 'Fraca',
  });
  const [passwordMatchError, setPasswordMatchError] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: FormError }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [smsVerification, setSmsVerification] = useState<boolean>(false);
  const [clickNextStep, setClickNextStep] = useState<boolean>(false);
  const [emailVerification, setEmailVerification] = useState<boolean>(false);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(5);

  useEffect(() => {
    if (banks.length === 0) {
      listBanks();
    }
  }, [banks.length, listBanks]);

  // Handle countdown and navigation for step 5
  useEffect(() => {
    if (currentStep === 5) {
      setIsLoading(true);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            navigate('/app');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentStep, navigate]);

  const filteredBanks = banks.filter((bank) =>
    bank.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const banksDisplay = mapBanksToDisplay(filteredBanks).slice(0, 4);

  const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target as HTMLInputElement;
    setTouched((prev) => ({ ...prev, [id]: true }));
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (id === 'document' && formData.documentType === 'CPF') {
      let formatted = value.replace(/\D/g, '');
      if (formatted.length > 3) formatted = formatted.substring(0, 3) + '.' + formatted.substring(3);
      if (formatted.length > 7) formatted = formatted.substring(0, 7) + '.' + formatted.substring(7);
      if (formatted.length > 11) formatted = formatted.substring(0, 11) + '-' + formatted.substring(11);
      setFormData((prev) => ({ ...prev, document: formatted.substring(0, 14) }));
      setFormErrors((prev) => ({
        ...prev,
        cpf: { error: !validarCPF(value), message: !validarCPF(value) ? 'CPF inválido' : '' },
      }));
    }

    if (id === 'name') {
      setFormErrors((prev) => ({
        ...prev,
        name: {
          error: !value || value.length <= 2,
          message: !value ? 'Campo nome é obrigatório' : value.length <= 2 ? 'Nome deve ter mais de 2 caracteres' : '',
        },
      }));
    }

    if (id === 'lastName') {
      setFormErrors((prev) => ({
        ...prev,
        lastName: {
          error: !value || value.length <= 2,
          message: !value ? 'Campo sobrenome é obrigatório' : value.length <= 2 ? 'Sobrenome deve ter mais de 2 caracteres' : '',
        },
      }));
    }

    if (id === 'accountType') {
      setFormData((prev) => ({ ...prev, accountType: value }));
    }

    if (id === 'salaryPerMonth') {
      let cleanedValue = value.replace(/[^\d]/g, '');
      let formatted = cleanedValue.length > 0 ? (parseInt(cleanedValue) / 100).toFixed(2) : '';
      setFormData((prev) => ({ ...prev, salaryPerMonth: formatted }));
      setFormErrors((prev) => ({
        ...prev,
        salaryPerMonth: {
          error: !formatted || parseFloat(formatted.replace(',', '.')) <= 0,
          message: !formatted ? 'Campo salário mensal é obrigatório' : parseFloat(formatted.replace(',', '.')) <= 0 ? 'Salário mensal inválido' : '',
        },
      }));
    }

    if (id === 'document' && formData.documentType === 'CNPJ') {
      let formatted = value.replace(/\D/g, '');
      if (formatted.length > 2) formatted = formatted.substring(0, 2) + '.' + formatted.substring(2);
      if (formatted.length > 6) formatted = formatted.substring(0, 6) + '.' + formatted.substring(6);
      if (formatted.length > 10) formatted = formatted.substring(0, 10) + '/' + formatted.substring(10);
      if (formatted.length > 15) formatted = formatted.substring(0, 15) + '-' + formatted.substring(15);
      setFormData((prev) => ({ ...prev, document: formatted.substring(0, 18) }));
      setFormErrors((prev) => ({
        ...prev,
        cnpj: { error: !validarCNPJ(value), message: !validarCNPJ(value) ? 'CNPJ inválido' : '' },
      }));
    }

    if (id === 'phoneNumber') {
      let formatted = value.replace(/\D/g, '');
      if (formatted.length > 0) formatted = '(' + formatted.substring(0, 2) + ') ' + formatted.substring(2);
      if (formatted.length > 10) formatted = formatted.substring(0, 10) + '-' + formatted.substring(10);
      setFormData((prev) => ({ ...prev, phoneNumber: formatted.substring(0, 15) }));
      setFormErrors((prev) => ({
        ...prev,
        phoneNumber: {
          error: !formatted || formatted.length < 15,
          message: !formatted ? 'Campo celular é obrigatório' : formatted.length < 15 ? 'Telefone inválido' : '',
        },
      }));
    }

    if (id === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setFormErrors((prev) => ({
        ...prev,
        email: {
          error: !value || !emailRegex.test(value),
          message: !value ? 'Campo e-mail é obrigatório' : !emailRegex.test(value) ? 'E-mail inválido' : '',
        },
      }));
    }

    if (id === 'birthDate') {
      const birthDateObj = new Date(value);
      const isValidDate = !isNaN(birthDateObj.getTime());
      const ageDiffMs = isValidDate ? Date.now() - birthDateObj.getTime() : 0;
      const ageDate = new Date(ageDiffMs);
      const age = isValidDate ? Math.abs(ageDate.getUTCFullYear() - 1970) : 0;
      setFormErrors((prev) => ({
        ...prev,
        birthDate: {
          error: !value || !isValidDate || age < 18,
          message: !value
            ? 'Data de nascimento é obrigatória'
            : !isValidDate
            ? 'Data de nascimento inválida'
            : age < 18
            ? 'Você deve ter pelo menos 18 anos'
            : '',
        },
      }));
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
      setFormErrors((prev) => ({
        ...prev,
        password: {
          error: value.length < 8 || !/[A-Z]/.test(value) || !/\d/.test(value),
          message: value.length < 8
            ? 'Senha deve ter pelo menos 8 caracteres'
            : !/[A-Z]/.test(value)
            ? 'Senha deve conter pelo menos uma letra maiúscula'
            : !/\d/.test(value)
            ? 'Senha deve conter pelo menos um número'
            : '',
        },
        confirmPassword: {
          error: !!formData.confirmPassword && formData.confirmPassword !== value,
          message: !!formData.confirmPassword && formData.confirmPassword !== value ? 'Senhas não coincidem' : '',
        },
      }));
    }

    if (id === 'confirmPassword') {
      setPasswordMatchError(value !== formData.password);
      setFormErrors((prev) => ({
        ...prev,
        confirmPassword: {
          error: value !== formData.password,
          message: value !== formData.password ? 'Senhas não coincidem' : '',
        },
      }));
    }
  };

  const validateStep1 = (): boolean => {
    let hasError = false;
    const newErrors: { [key: string]: FormError } = {};
    const newTouched: { [key: string]: boolean } = {
      name: true,
      lastName: true,
      salaryPerMonth: true,
      document: true,
      birthDate: true,
      phoneNumber: true,
      email: true,
    };

    if (!formData.name) {
      newErrors.name = { error: true, message: 'Campo nome é obrigatório' };
      hasError = true;
    } else if (formData.name.length <= 2) {
      newErrors.name = { error: true, message: 'Nome deve ter mais de 2 caracteres' };
      hasError = true;
    }

    if (!formData.lastName) {
      newErrors.lastName = { error: true, message: 'Campo sobrenome é obrigatório' };
      hasError = true;
    } else if (formData.lastName.length <= 2) {
      newErrors.lastName = { error: true, message: 'Sobrenome deve ter mais de 2 caracteres' };
      hasError = true;
    }

    if (!formData.salaryPerMonth || parseFloat(formData.salaryPerMonth.replace(',', '.')) <= 0) {
      newErrors.salaryPerMonth = { error: true, message: 'Campo salário mensal é obrigatório' };
      hasError = true;
    }

    if (!formData.document) {
      newErrors[formData.documentType.toLowerCase()] = {
        error: true,
        message: formData.documentType === 'CPF' ? 'CPF é obrigatório' : 'CNPJ é obrigatório',
      };
      hasError = true;
    } else if (formData.documentType === 'CPF' && !validarCPF(formData.document)) {
      newErrors.cpf = { error: true, message: 'CPF inválido' };
      hasError = true;
    } else if (formData.documentType === 'CNPJ' && !validarCNPJ(formData.document)) {
      newErrors.cnpj = { error: true, message: 'CNPJ inválido' };
      hasError = true;
    }

    if (!formData.birthDate) {
      newErrors.birthDate = { error: true, message: 'Data de nascimento é obrigatória' };
      hasError = true;
    } else {
      const birthDateObj = new Date(formData.birthDate);
      const isValidDate = !isNaN(birthDateObj.getTime());
      if (!isValidDate) {
        newErrors.birthDate = { error: true, message: 'Data de nascimento inválida' };
        hasError = true;
      } else {
        const ageDiffMs = Date.now() - birthDateObj.getTime();
        const ageDate = new Date(ageDiffMs);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);
        if (age < 18) {
          newErrors.birthDate = { error: true, message: 'Você deve ter pelo menos 18 anos' };
          hasError = true;
        }
      }
    }

    if (!formData.phoneNumber || formData.phoneNumber.length < 15) {
      newErrors.phoneNumber = { error: true, message: 'Campo celular é obrigatório' };
      hasError = true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = { error: true, message: 'Campo e-mail é obrigatório' };
      hasError = true;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = { error: true, message: 'E-mail inválido' };
      hasError = true;
    }

    setFormErrors((prev) => ({ ...prev, ...newErrors }));
    setTouched((prev) => ({ ...prev, ...newTouched }));
    setClickNextStep(true);

    return !hasError;
  };

  const validateStep3 = (): boolean => {
    let hasError = false;
    const newErrors: { [key: string]: FormError } = {};
    const newTouched: { [key: string]: boolean } = {
      password: true,
      confirmPassword: true,
    };

    if (!formData.password) {
      newErrors.password = { error: true, message: 'Campo senha é obrigatório' };
      hasError = true;
    } else if (formData.password.length < 8) {
      newErrors.password = { error: true, message: 'A senha deve ter pelo menos 8 caracteres' };
      hasError = true;
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = { error: true, message: 'A senha deve conter pelo menos uma letra maiúscula' };
      hasError = true;
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = { error: true, message: 'A senha deve conter pelo menos um número' };
      hasError = true;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = { error: true, message: 'Campo confirmação de senha é obrigatório' };
      hasError = true;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = { error: true, message: 'As senhas não coincidem' };
      hasError = true;
    }

    setFormErrors((prev) => ({ ...prev, ...newErrors }));
    setTouched((prev) => ({ ...prev, ...newTouched }));
    return !hasError;
  };

  const handleNextStep = async () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !selectedBank) {
      alert('Por favor, selecione um banco para continuar.');
      return;
    }
    if (currentStep === 3 && !validateStep3()) return;

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      setClickNextStep(false);
    } else {
      const newFormData = { ...formData, salaryPerMonth: parseFloat(formData.salaryPerMonth.replace(',', '.')).toString() };
      const success = await register(newFormData);

      if (success) {
        setCurrentStep(5);
      }
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setClickNextStep(false);
    }
  };

  const handleSendSmsCode = () => {
    if (!formData.phoneNumber || formData.phoneNumber.length < 15) {
      setFormErrors((prev) => ({
        ...prev,
        phoneNumber: { error: true, message: 'Por favor, insira um número de celular válido' },
      }));
      setTouched((prev) => ({ ...prev, phoneNumber: true }));
      return;
    }
    setSmsVerification(true);
    alert(`Código de verificação enviado para ${formData.phoneNumber}`);
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      setFormErrors((prev) => ({
        ...prev,
        email: { error: true, message: 'Por favor, insira um endereço de e-mail válido' },
      }));
      setTouched((prev) => ({ ...prev, email: true }));
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

  const handleToAccount = () => {
    navigate('/app');
  };

  return (
    <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Crie sua conta</h2>
      <ProgressSteps currentStep={currentStep} />
      {currentStep === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Nome<span className="text-red-800">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md input-field focus:outline-none focus:border-blue-500 dark:focus:border-blue-300 bg-white dark:bg-gray-700 dark:text-white ${
                    formErrors?.name?.error && (touched.name || clickNextStep)
                      ? 'border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Digite seu nome"
                />
                {!formErrors?.name?.error && (formData.name) && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                  </div>
                )}  
              </div>
              {formErrors?.name?.error && (touched.name || clickNextStep) && (
                <p className="text-xs text-red-400 mt-1">{formErrors.name.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Sobrenome<span className="text-red-800">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md input-field focus:outline-none focus:border-blue-500 dark:focus:border-blue-300 bg-white dark:bg-gray-700 dark:text-white ${
                    formErrors?.lastName?.error && (touched.lastName || clickNextStep)
                      ? 'border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Digite seu sobrenome"
                />
                {!formErrors?.lastName?.error && (formData.lastName) && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                  </div>
                )}  
              </div>
              {formErrors?.lastName?.error && (touched.lastName || clickNextStep) && (
                <p className="text-xs text-red-400 mt-1">{formErrors.lastName.message}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="accountType"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Tipo de Conta<span className="text-red-800">*</span>
              </label>
              <select
                id="accountType"
                value={formData.accountType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md input-field focus:outline-none focus:border-blue-500 dark:focus:border-blue-300 bg-white dark:bg-gray-700 dark:text-white h-10"
              >
                <option value="CheckingAccount">Conta Corrente</option>
                <option value="SavingsAccount">Conta Poupança</option>
                <option value="SalaryAccount">Conta Salário</option>
                <option value="BusinessAccount">Conta Empresarial</option>
                <option value="JointAccount">Conta Conjunta</option>
                <option value="StudentAccount">Conta Estudante</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="salaryPerMonth"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Salário Mensal (R$)<span className="text-red-800">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="salaryPerMonth"
                  value={formData.salaryPerMonth ? formatToBRLInput(formData.salaryPerMonth) : ''}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md input-field focus:outline-none focus:border-blue-500 dark:focus:border-blue-300 bg-white dark:bg-gray-700 dark:text-white h-10 ${
                    formErrors?.salaryPerMonth?.error && (touched.salaryPerMonth || clickNextStep)
                      ? 'border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Digite seu salário mensal (ex: 2500,00)"
                />
                {!formErrors?.salaryPerMonth?.error && (formData.salaryPerMonth) && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                  </div>
                )}  
              </div>
              {formErrors?.salaryPerMonth?.error && (touched.salaryPerMonth || clickNextStep) && (
                <p className="text-xs text-red-400 mt-1">{formErrors.salaryPerMonth.message}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="documentType"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Tipo de Documento<span className="text-red-800">*</span>
              </label>
              <select
                id="documentType"
                value={formData.documentType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md input-field focus:outline-none focus:border-blue-500 dark:focus:border-blue-300 bg-white dark:bg-gray-700 dark:text-white h-10"
              >
                <option value="CPF">CPF</option>
                <option value="CNPJ">CNPJ</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="document"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {formData.documentType === 'CPF' ? 'CPF' : 'CNPJ'}<span className="text-red-800">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="document"
                  value={formData.document}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md input-field focus:outline-none focus:border-blue-500 dark:focus:border-blue-300 bg-white dark:bg-gray-700 dark:text-white ${
                    (formErrors?.cpf?.error || formErrors?.cnpj?.error) && (touched.document || clickNextStep)
                      ? 'border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder={formData.documentType === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00'}
                />
                {((formData.documentType === 'CPF' && validarCPF(formData.document)) ||
                  (formData.documentType === 'CNPJ' && validarCNPJ(formData.document))) && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                  </div>
                )}
              </div>
              {formErrors?.cpf?.error && formData.documentType === 'CPF' && (touched.document || clickNextStep) && (
                <p className="text-xs text-red-400 mt-1">{formErrors.cpf.message}</p>
              )}
              {formErrors?.cnpj?.error && formData.documentType === 'CNPJ' && (touched.document || clickNextStep) && (
                <p className="text-xs text-red-400 mt-1">{formErrors.cnpj.message}</p>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="birthDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Data de Nascimento<span className="text-red-800">*</span>
            </label>
            <div className="relative">
                <input
                  type="date"
                  id="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md input-field focus:outline-none focus:border-blue-500 dark:focus:border-blue-300 bg-white dark:bg-gray-700 dark:text-white ${
                    formErrors?.birthDate?.error && (touched.birthDate || clickNextStep)
                      ? 'border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Selecione sua data de nascimento"
                />
                {!formErrors?.birthDate?.error && (formData.birthDate) && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                  </div>
                )}  
              </div>
            {formErrors?.birthDate?.error && (touched.birthDate || clickNextStep) && (
              <p className="text-xs text-red-400 mt-1">{formErrors.birthDate.message}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Você precisa ter pelo menos 18 anos
            </p>
          </div>
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Celular<span className="text-red-800">*</span>
            </label>
            <div className="relative">
              <input
                  type="tel"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md input-field focus:outline-none focus:border-blue-500 dark:focus:border-blue-300 bg-white dark:bg-gray-700 dark:text-white ${
                    formErrors?.phoneNumber?.error && (touched.phoneNumber || clickNextStep)
                      ? 'border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="(00) 00000-0000"
                />
                {!formErrors?.phoneNumber?.error && (formData.phoneNumber) && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                  </div>
                )}  
              </div>
              {formErrors?.phoneNumber?.error && (touched.phoneNumber || clickNextStep) && (
                <p className="text-xs text-red-400 mt-1">{formErrors.phoneNumber.message}</p>
              )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              E-mail<span className="text-red-800">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-md input-field focus:outline-none focus:border-blue-500 dark:focus:border-blue-300 bg-white dark:bg-gray-700 dark:text-white ${
                  formErrors?.email?.error && (touched.email || clickNextStep)
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Digite seu e-mail"
              />
              {!formErrors?.email?.error && (formData.email) && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                </div>
              )}  
              </div>
              {formErrors?.email?.error && (touched.email || clickNextStep) && (
                <p className="text-xs text-red-400 mt-1">{formErrors.email.message}</p>
              )}
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={handleNextStep}
              className="px-6 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition duration-300 cursor-pointer"
            >
              Próximo <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </button>
          </div>
        </div>
      )}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div>
            <label
              htmlFor="bankSearch"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Pesquisar Banco
            </label>
            <div className="relative">
              <input
                type="text"
                id="bankSearch"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md input-field focus:outline-none focus:border-blue-500 dark:focus:border-blue-300 bg-white dark:bg-gray-700 dark:text-white"
                placeholder="Digite o nome do banco"
                value={searchTerm}
                onChange={onSearchChange}
                aria-label="Pesquisar por nome do banco"
              />
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banksDisplay.length > 0 ? (
              banksDisplay.map((bank) => (
                <BankCard
                  key={bank.name}
                  bank={bank}
                  isSelected={selectedBank === bank.name}
                  onSelect={() => {
                    setSelectedBank(bank.name);
                    setFormData((prev) => ({
                      ...prev,
                      bankName: bank.name,
                      bankISBP: bank.bankISBP,
                    }));
                  }}
                />
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 col-span-2">
                Nenhum banco encontrado.
              </p>
            )}
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
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Crie uma senha<span className="text-red-800">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-md input-field focus:outline-none focus:border-blue-500 dark:focus:border-blue-300 bg-white dark:bg-gray-700 dark:text-white ${
                  formErrors?.password?.error && (touched.password || clickNextStep)
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Digite sua senha"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {formErrors?.password?.error && (touched.password || clickNextStep) && (
              <p className="text-xs text-red-400 mt-1">{formErrors.password.message}</p>
            )}
            <div className="mt-2">
              <div className="flex items-center mb-1">
                <div
                  className={`password-strength ${passwordStrength.color} rounded-full mr-2`}
                  style={{ width: `${passwordStrength.width}%`, height: '4px' }}
                ></div>
                <span className="text-xs font-medium">{passwordStrength.text}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas e números.
              </p>
            </div>
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Confirme sua senha<span className="text-red-800">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-md input-field focus:outline-none focus:border-blue-500 dark:focus:border-blue-300 bg-white dark:bg-gray-700 dark:text-white ${
                  formErrors?.confirmPassword?.error && (touched.confirmPassword || clickNextStep)
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Digite novamente sua senha"
              />
            </div>
            {formErrors?.confirmPassword?.error && (touched.confirmPassword || clickNextStep) && (
              <p className="text-xs text-red-400 mt-1">{formErrors.confirmPassword.message}</p>
            )}
          </div>
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableBiometric"
                className="h-4 w-4 text-blue-500 dark:text-blue-300 focus:ring-blue-500 dark:focus:ring-blue-300 border-gray-300 dark:border-gray-600 rounded"
                onChange={handleInputChange}
              />
              <label
                htmlFor="enableBiometric"
                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
              >
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
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">
            Confira seus dados
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Informações Pessoais
                </h4>
                <p className="text-gray-800 dark:text-white">{formData.name}</p>
                <p className="text-gray-600 dark:text-gray-300">
                  {formData.documentType === 'CPF'
                    ? `CPF: ${formData.document}`
                    : `CNPJ: ${formData.document}`}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Nascimento:{' '}
                  {formData.birthDate &&
                    new Date(formData.birthDate).toLocaleDateString('pt-BR')}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Celular: {formData.phoneNumber}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  E-mail: {formData.email}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Conta Bancária
                </h4>
                <p className="text-gray-800 dark:text-white">{selectedBank}</p>
                {banksDisplay
                  .find((b) => b.name === selectedBank)
                  ?.features.map((feature, index) => (
                    <p key={index} className="text-gray-600 dark:text-gray-300">
                      {feature.title}
                    </p>
                  ))}
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-start">
              <input
                id="acceptTerms"
                type="checkbox"
                className="h-4 w-4 text-blue-500 dark:text-blue-300 focus:ring-blue-500 dark:focus:ring-blue-300 border-gray-300 dark:border-gray-600 rounded"
                onChange={handleInputChange}
              />
              <div className="ml-3 text-sm">
                <label
                  htmlFor="acceptTerms"
                  className="font-medium text-gray-700 dark:text-gray-300"
                >
                  Eu li e concordo com os{' '}
                  <a
                    href="#"
                    className="text-blue-500 dark:text-blue-300 hover:underline"
                  >
                    Termos de Uso
                  </a>{' '}
                  e{' '}
                  <a
                    href="#"
                    className="text-blue-500 dark:text-blue-300 hover:underline"
                  >
                    Política de Privacidade
                  </a>{' '}
                  do Banco Digital.
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Ao marcar esta opção, você concorda com o processamento dos seus
                  dados pessoais conforme a LGPD.
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
          <h3 className="text-xl font-medium text-gray-800 dark:text-white mt-8">
            Conta criada com sucesso!
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Bem-vindo ao Banco Digital. Sua conta está sendo verificada e em breve
            você receberá um e-mail com os próximos passos.
          </p>
          <button
            onClick={handleToAccount}
            className={`px-6 py-2 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition duration-300 flex items-center justify-center mx-auto ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                Carregando...
              </>
            ) : (
              <>
                Acessar minha conta <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </>
            )}
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Redirecionando em {countdown} segundos...
          </p>
        </div>
      )}
    </div>
  );
}