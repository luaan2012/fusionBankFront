import React from 'react';

interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md mx-4">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold dark:text-white">Verificação de segurança</h3>
                </div>
                <div className="p-6">
                    <div className="flex items-start mb-6">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-500 dark:text-blue-300 mr-4 mt-1">
                            <i className="fas fa-shield-alt"></i>
                        </div>
                        <div>
                            <p className="font-medium dark:text-white">Enviamos um código de 6 dígitos para seu celular</p>
                            <p className="text-sm text-gray-500 dark:text-gray-300">Terminado em •••• 1234</p>
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2 dark:text-gray-300">Código de verificação</label>
                        <div className="flex space-x-3">
                            {[...Array(6)].map((_, i) => (
                                <input
                                    key={i}
                                    type="text"
                                    maxLength={1}
                                    className="w-12 h-12 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-center text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                />
                            ))}
                        </div>
                    </div>
                    <div className="text-center">
                        <button className="text-blue-500 text-sm font-medium">Reenviar código</button>
                    </div>
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium dark:text-white">
                        Cancelar
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium">
                        Verificar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerificationModal;