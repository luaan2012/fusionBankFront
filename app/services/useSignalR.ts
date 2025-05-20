// import { useEffect, useRef } from 'react';
// import { SignalRService } from './signalR';
// import type { EventMessage } from '~/models/eventMessage';

// export const useSignalR = (
//   url: string,
//   accountId: string | undefined,
//   addNotification: (event: EventMessage) => void
// ) => {
//   const signalRServiceRef = useRef<SignalRService | null>(null);
//   const accountIdRef = useRef<string | undefined>(accountId);

//   useEffect(() => {
//     // Evita iniciar conexão se accountId não mudou ou é undefined
//     if (!accountId || accountId === accountIdRef.current) {
//       if (!accountId) {
//         console.log('accountId não definido, conexão SignalR não iniciada');
//       }
//       return;
//     }

//     accountIdRef.current = accountId;
//     console.log(`Iniciando conexão SignalR para accountId: ${accountId}`);

//     const handleMessage = (data: EventMessage) => {
//       if (data) {
//         addNotification({ ...data, read: false });
//       }
//     };

//     // Para a conexão anterior, se existir
//     if (signalRServiceRef.current) {
//       console.log('Parando conexão SignalR anterior');
//       signalRServiceRef.current.stopConnection();
//     }

//     // Cria nova instância
//     signalRServiceRef.current = SignalRService.getInstance(url, accountId, handleMessage);
//     signalRServiceRef.current.startConnection();

//     // Cleanup na desmontagem
//     return () => {
//       console.log('Parando conexão SignalR no cleanup');
//       if (signalRServiceRef.current) {
//         signalRServiceRef.current.stopConnection();
//         signalRServiceRef.current = null;
//       }
//     };
//   }, [url, accountId]);
// };