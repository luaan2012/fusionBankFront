import { useEffect } from 'react';
import { useAccountStore } from '~/context/accountStore'
import { useToast } from '../Toasts/ToastContext'


export const SessionTimer = () => {
  const {user, checkToken} = useAccountStore();
  const {openToast} = useToast()

  useEffect(() => {
    if (!user?.accountId) {
      console.log('Usuário não autenticado, timer não iniciado.');
      return;
    }

    const interval = setInterval(async () => {
      try {
        const isValid = await checkToken();
        if (!isValid) {
          openToast({
            message: 'Sessão expirada, entre novamente.',
            type: 'error',
            position: 'top-right',
            duration: 5000,
          });
          setTimeout(() => {
            location.href = '/';
          }, 5000)
        }
      } catch (error) {
        console.error('Erro ao validar token:', error);
        openToast({
          message: 'Erro ao verificar sessão. Tente novamente.',
          type: 'error',
          position: 'top-right',
          duration: 5000,
        });
        setTimeout(() => {
            location.href = '/';
          }, 5000)
      }
    }, 60000);

    return () => clearInterval(interval); // Limpa o timer ao desmontar
  }, [user?.accountId]);

  return null;
};
