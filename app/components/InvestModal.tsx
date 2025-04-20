import React from 'react';

interface InvestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const InvestModal: React.FC<InvestModalProps> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md mx-4">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold dark:text-white">Aplicar em CDB 110% CDI</h3>
                </div>
                <div className="p-6">
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2 dark:text-gray-300">Valor da aplicação</label>
                        <input
                            type="text"
                            className="w-full bg-gray-100 dark:bg-gray-700 border-0 py-3 px-4 rounded-lg text-lg focus:outline-none dark:text-white"
                            placeholder="R$ 0,00"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Valor mínimo: R$ 100,00</p>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2 dark:text-gray-300">Origem dos recursos</label>
                        <select className="w-full bg-gray-100 dark:bg-gray-700 border-0 py-2 pl-4 pr-8 rounded-lg text-sm focus:outline-none dark:text-gray-300">
                            <option>Conta corrente •••• 1234</option>
                            <option>Conta poupança •••• 5678</option>
                        </select>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 mb-6">
                        <div className="flex items-start">
                            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-500 dark:text-blue-300 mr-3 mt-1">
                                <i className="fas fa-info-circle text-sm"></i>
                            </div>
                            <div>
                                <p className="text-sm text-blue-700 dark:text-blue-200">Este investimento tem liquidez D+1 e rentabilidade de 110% do CDI.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium dark:text-white">
                        Cancelar
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium">
                        Confirmar aplicação
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InvestModal;