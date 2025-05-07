// import { type Account } from './../models/account';
// import { create } from 'zustand';
// import { persist, createJSONStorage } from 'zustand/middleware';
// import { LevelError, type ErrorApi } from '~/models/response/errorResponse'

// // Tipagem do estado de autenticação
// interface TransferState {
//   user: Account | null;
//   loading: boolean;
//   error: ErrorApi | null
//   updateUser: () => void;
// }
// // Criação da store com persistência
// export const useTransferStore = create<TransferState>()(
//   set => ({
//       user: null,
//       loading: false,
//       error: null,
//       updateUser: async () => {
//         const { user } = get(); // CORREÇÃO: pegar user do estado atual
//         if (!user) {
//           set({ error: { message: 'Usuário não autenticado', levelError: LevelError.high }, loading: false});
//           return;
//         }        
//         set({
//           user: { ...user }, // Atualiza com o novo valor
//         });

//       }
//     })
// );