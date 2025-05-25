interface ModalState {
  type: 'bank' | 'transfer' | 'twofa' | 'confirm' | null;
  data?: any;
}

interface ModalProps {
  modalState: ModalState;
  closeModal?: () => void;
}

export const ModalAdmin = ({ modalState, closeModal } : ModalProps) => {
  if (!modalState.type) return null;

  return (
    <div className="modal-overlay fixed inset-0 flex items-center justify-center">
      {modalState.type === 'bank' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">Adicionar Novo Banco</h3>
            <button onClick={closeModal} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="p-6">
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome do Banco
                  </label>
                  <input
                    type="text"
                    id="bankName"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark"
                  />
                </div>
                <div>
                  <label htmlFor="bankCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Código ISPB
                  </label>
                  <input
                    type="text"
                    id="bankCode"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark"
                  />
                </div>
                <div>
                  <label htmlFor="bankTEDFee" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Taxa TED (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="bankTEDFee"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark"
                  />
                </div>
                <div>
                  <label htmlFor="bankDOCFee" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Taxa DOC (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="bankDOCFee"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="bankLogo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Logo (URL)
                  </label>
                  <input
                    type="text"
                    id="bankLogo"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      id="bankActive"
                      className="rounded border-gray-300 dark:border-gray-600 text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Banco ativo</span>
                  </label>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-md hover:bg-primary-dark dark:hover:bg-blue-900"
                >
                  Salvar Banco
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {modalState.type === 'transfer' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">Transferência Manual</h3>
            <button onClick={closeModal} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="p-6">
            <form>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="transferFrom"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Conta de Origem
                  </label>
                  <select
                    id="transferFrom"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark"
                  >
                    <option value="">Selecione a conta de origem</option>
                    <option value="1">João Silva (Banco Digital) - R$ 12.345,67</option>
                    <option value="2">Maria Souza (Banco Invest) - R$ 8.765,43</option>
                    <option value="3">Carlos Oliveira (Banco Cartões) - R$ 45.678,90</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="transferTo"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Conta de Destino
                  </label>
                  <select
                    id="transferTo"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark"
                  >
                    <option value="">Selecione a conta de destino</option>
                    <option value="1">João Silva (Banco Digital) - R$ 12.345,67</option>
                    <option value="2">Maria Souza (Banco Invest) - R$ 8.765,43</option>
                    <option value="3">Carlos Oliveira (Banco Cartões) - R$ 45.678,90</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="transferAmount"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    id="transferAmount"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark"
                  />
                </div>
                <div>
                  <label
                    htmlFor="transferDescription"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Descrição
                  </label>
                  <textarea
                    id="transferDescription"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark"
                  ></textarea>
                </div>
                <div>
                  <label
                    htmlFor="transferReason"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Motivo da Transferência Manual
                  </label>
                  <textarea
                    id="transferReason"
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark"
                    required
                  ></textarea>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-md hover:bg-primary-dark dark:hover:bg-blue-900"
                >
                  Confirmar Transferência
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {modalState.type === 'twofa' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl twofa-modal">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">Autenticação em Duas Etapas</h3>
            <button onClick={closeModal} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="p-6">
            <div className="text-center mb-6">
              <i className="fas fa-lock text-4xl text-primary-light dark:text-primary-dark mb-3"></i>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Insira o código de 6 dígitos do seu autenticador
              </p>
            </div>
            <form>
              <div className="flex justify-center mb-6">
                {[1, 2, 3, 4, 5, 6].map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    className="w-12 h-12 text-center text-2xl border border-gray-300 dark:border-gray-600 rounded-md mx-1 bg-white dark:bg-gray-700 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark"
                  />
                ))}
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-md hover:bg-primary-dark dark:hover:bg-blue-900"
                >
                  Verificar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {modalState.type === 'confirm' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">Confirmar Ação</h3>
            <button onClick={closeModal} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="p-6">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Tem certeza que deseja realizar esta ação?
            </p>
            <div className="mb-4">
              <label
                htmlFor="confirmReason"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Justificativa (obrigatório)
              </label>
              <textarea
                id="confirmReason"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark"
                required
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-md hover:bg-primary-dark dark:hover:bg-blue-900"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};