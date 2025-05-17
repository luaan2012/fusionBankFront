import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faIdCard, faEnvelope, faSignInAlt, faFingerprint, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { loginSchema, type LoginFormData, type AccountFormErrors, type DocumentFormErrors, type EmailFormErrors, type LoginPayload } from '../schema/loginSchema';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { useAccountStore } from '~/context/accountStore';
import { IMaskInput } from 'react-imask';
import { useToast } from '~/components/ToastContext'
import { decryptString , encryptObject} from '~/services/encryptService'

interface LoginFormProps {
  switchToRegister: () => void;
}

const LoginForm = ({ switchToRegister }: LoginFormProps) => {
  const [loginType, setLoginType] = useState<'account' | 'document' | 'email'>('account');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { loading, login } = useAccountStore();
  const navigate = useNavigate();
  const { openToast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    resetField,
    control,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      loginType,
      accountNumber: '',
      agency: '',
      document: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const encryptedCredentials = localStorage.getItem('loginCredentials');
      if (encryptedCredentials) {
        try {
          const decrypted = decryptString(encryptedCredentials) as LoginFormData
          setLoginType(decrypted.loginType);
          setValue('password', decrypted.password);
          setValue('loginType', decrypted.loginType);
          setValue(
            decrypted.loginType === 'account' ? 'accountNumber'
              : decrypted.loginType === 'document' ? 'document' : 'email',
            decrypted.loginType === 'account' ? decrypted.accountNumber
              : decrypted.loginType === 'document' ? decrypted.document : decrypted.email || '');
          setRememberMe(true)
        } catch (error) {
          console.error('Failed to decrypt credentials:', error);
          localStorage.removeItem('loginCredentials'); // Clear invalid data
        }
      }
  }, [])

  // Atualiza o loginType e reseta campos irrelevantes
  const handleLoginTypeChange = (type: 'account' | 'document' | 'email') => {
    setLoginType(type);
    setValue('loginType', type);
    resetField('accountNumber');
    resetField('agency');
    resetField('document');
    resetField('email');
  };

  // Manipula o envio do formulário
  const onSubmit = async (data: LoginFormData) => {
    const loginUser =
      data.loginType === 'account' ? `${data.accountNumber}${data.agency}` :
      data.loginType === 'document' ? data.document! :
      data.email!;

    const loginPayload: LoginPayload = {
      loginUser,
      password: data.password,
      loginType: data.loginType === 'document' ? 'cpfcnpj' : data.loginType,
    };

    const loginEfetuado = await login(loginPayload);
    const error = useAccountStore.getState().error

    if(rememberMe) {
      var encrypted = encryptObject(data)
      localStorage.setItem('loginCredentials', encrypted);
    }else {
      localStorage.removeItem('loginCredentials');
    }

    if(!loginEfetuado){
      openToast({
        message: error.message || 'Aconteceu um erro ao tentar acessar sua conta!',
        type: 'error',
        duration: 4000,
        position: 'top-right'
      })
      return;
    }

    navigate('/app');
  };

  return (
    <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Acesse sua conta</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" {...register('loginType')} value={loginType} />
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => handleLoginTypeChange('account')}
              className={`flex-1 mr-2 py-2 px-4 rounded-md font-medium ${
                loginType === 'account'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
              }`}
            >
              <FontAwesomeIcon icon={faWallet} className="mr-2" /> Conta
            </button>
            <button
              type="button"
              onClick={() => handleLoginTypeChange('document')}
              className={`flex-1 mx-2 py-2 px-4 rounded-md font-medium ${
                loginType === 'document'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
              }`}
            >
              <FontAwesomeIcon icon={faIdCard} className="mr-2" /> CPF/CNPJ
            </button>
            <button
              type="button"
              onClick={() => handleLoginTypeChange('email')}
              className={`flex-1 ml-2 py-2 px-4 rounded-md font-medium ${
                loginType === 'email'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
              }`}
            >
              <FontAwesomeIcon icon={faEnvelope} className="mr-2" /> E-mail
            </button>
          </div>
          {loginType === 'account' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="agencyNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Agência
                </label>
                <Controller
                  name="agency"
                  control={control}
                  render={({ field }) => (
                    <IMaskInput
                      type="text"
                      id="agency"
                      mask={'0000'}
                      unmask={true}
                      value={field.value || ''} // Garante que o valor inicial seja uma string vazia
                      onAccept={(value) => field.onChange(value)}
                      className={`w-full px-4 py-2 border ${
                        (errors as AccountFormErrors).agency ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } rounded-md focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white`}
                      placeholder="Digite o número da agência"
                    />
                  )} />
                {(errors as AccountFormErrors).agency && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">{(errors as AccountFormErrors)?.agency?.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Número da Conta
                </label>
                <Controller
                  name="accountNumber"
                  control={control}
                  render={({ field }) => (
                    <IMaskInput
                      type="text"
                      id="accountNumber"
                      mask="0000000-0"
                      unmask={true}
                      value={field.value || ''} // Garante que o valor inicial seja uma string vazia
                      onAccept={(value) => field.onChange(value)}
                      className={`w-full px-4 py-2 border ${
                        (errors as AccountFormErrors).accountNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } rounded-md focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white`}
                      placeholder="Digite o número da conta"
                    />
                  )}/>
                {(errors as AccountFormErrors).accountNumber && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">{(errors as AccountFormErrors)?.accountNumber?.message}</p>
                )}
              </div>
            </div>
          )}
          {loginType === 'document' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  CPF/CNPJ
                </label>
                <Controller
                  name="document"
                  control={control}
                  render={({ field }) => (
                    <IMaskInput
                      type="text"
                      id="documentNumber"
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
                      onAccept={(value) => field.onChange(value)} // Atualiza o valor no react-hook-form
                      className={`w-full px-4 py-2 border ${
                        (errors as DocumentFormErrors).document ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } rounded-md focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white`}
                      placeholder="Digite seu CPF ou CNPJ"
                    />
                  )}
                />
                {(errors as DocumentFormErrors).document && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">{(errors as DocumentFormErrors)?.document?.message}</p>
                )}
              </div>
            </div>
          )}
          {loginType === 'email' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  id="loginEmail"
                  {...register('email')}
                  className={`w-full px-4 py-2 border ${
                    (errors as EmailFormErrors).email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white`}
                  placeholder="Digite seu e-mail"
                />
                {(errors as EmailFormErrors).email && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">{(errors as EmailFormErrors)?.email?.message}</p>
                )}
              </div>
            </div>
          )}
          <div className="mt-4">
            <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="loginPassword"
                {...register('password')}
                className={`w-full px-4 py-2 border ${
                  errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } rounded-md focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white`}
                placeholder="Digite sua senha"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 cursor-pointer"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.password.message}</p>
            )}
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 text-blue-500 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                Lembrar-me
              </label>
            </div>
            <button className="text-sm text-blue-500 dark:text-blue-500 hover:underline cursor-pointer">
              Esqueceu a senha?
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 bg-blue-600 dark:bg-blue-600 cursor-pointer text-white rounded-md font-medium transition duration-300 ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 dark:hover:bg-blue-600'
          }`}
        >
          <FontAwesomeIcon icon={faSignInAlt} className="mr-2" /> {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Não tem uma conta?{' '}
          <button
            onClick={switchToRegister}
            className="text-blue-500 dark:text-blue-500 font-medium hover:underline cursor-pointer"
          >
            Cadastre-se
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;