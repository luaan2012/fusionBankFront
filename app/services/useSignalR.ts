import { useEffect } from 'react';
import { SignalRService } from './signalR';
import type { EventMessage } from '~/models/eventMessage';

export const useSignalR = (
  url: string,
  accountId: string | undefined,
  addNotification: (event: EventMessage) => void
) => {
  useEffect(() => {
    if (!accountId) return;

    const handleMessage = (data: EventMessage) => {
      if (data) {
        addNotification({ ...data, read: false });
      }
    };

    const signalRService = SignalRService.getInstance(url, accountId, handleMessage);

    signalRService.startConnection(); // só começa explicitamente agora

    return () => {
      signalRService.stopConnection();
    };
  }, [url, accountId]);
};
