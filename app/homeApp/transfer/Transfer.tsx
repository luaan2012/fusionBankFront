import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUniversity, faHistory, faCamera, faQrcode, faBolt, faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons';
import TransferCard from '~/components/TransferCard'

interface TransferCardData {
  type: 'pix' | 'ted' | 'doc';
  icon: typeof faQrcode | typeof faBolt | typeof faFileInvoiceDollar;
  color: string;
  bg: string;
  title: string;
  description: string;
  features: string[];
}

interface TransferContentProps {
  onConfirm: (transferData: any) => void;
}

const TransferContent: React.FC<TransferContentProps> = ({ onConfirm }) => {
  const [transferType, setTransferType] = useState<'pix' | 'ted' | 'doc'>('pix');
  const [pixKeyType, setPixKeyType] = useState('CPF');
  const [pixKey, setPixKey] = useState('');
  const [pixName, setPixName] = useState('');
  const [bank, setBank] = useState('');
  const [agency, setAgency] = useState('');
  const [account, setAccount] = useState('');
  const [tedDocName, setTedDocName] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const transferCards: TransferCardData[] = [
    {
      type: 'pix',
      icon: faQrcode,
      color: 'text-primary-600 dark:text-primary-400',
      bg: 'bg-primary-100 dark:bg-slate-600',
      title: 'PIX',
      description: 'Transferência instantânea 24/7',
      features: [
        'Disponível a qualquer hora',
        'Sem custo',
        'Limite: R$ 5.000,00',
      ],
    },
    {
      type: 'ted',
      icon: faBolt,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-slate-600',
      title: 'TED',
      description: 'Transferência eletrônica rápida',
      features: ['Processada em até 2h', 'Taxa: R$ 5,00', 'Mínimo: R$ 1.000,00'],
    },
    {
      type: 'doc',
      icon: faFileInvoiceDollar,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-slate-600',
      title: 'DOC',
      description: 'Transferência em horário comercial',
      features: ['Processada em 1 dia útil', 'Taxa: R$ 3,00', 'Mínimo: R$ 500,00'],
    },
  ];

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    value = (parseInt(value) / 100).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    setAmount(value === '0,00' ? '' : value);
  };

  const handleConfirm = () => {
    if (!amount) {
      onConfirm({ error: 'Por favor, insira um valor para a transferência' });
      return;
    }

    const transferData = {
      type: transferType,
      amount: parseFloat(amount.replace('.', '').replace(',', '.')) || 0,
      destination:
        transferType === 'pix'
          ? `${pixName} • PIX: ${pixKey}`
          : `${tedDocName} • ${bank} • Ag. ${agency} • C/C ${account}`,
      description: description || '-',
      tax: transferType === 'ted' ? 5 : transferType === 'doc' ? 3 : 0,
    };

    onConfirm(transferData);
  };

  return (
    <div className="flex-1">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Nova Transferência</h2>
          <a href="#" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center">
            <FontAwesomeIcon icon={faHistory} className="mr-1" />
            Ver histórico
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {transferCards.map((card) => (
            <TransferCard
              key={card.type}
              type={card.type}
              icon={card.icon}
              color={card.color}
              bg={card.bg}
              title={card.title}
              description={card.description}
              features={card.features}
              isActive={transferType === card.type}
              onSelect={() => setTransferType(card.type)}
            />
          ))}
        </div>
        <div id="transfer-form">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Conta de origem</h3>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-slate-600 flex items-center justify-center mr-3">
                  <FontAwesomeIcon icon={faUniversity} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Conta Corrente</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ag. 1234 • C/C 56789-0</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">Saldo disponível</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white">R$ 8.742,36</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Conta de destino</h3>
              {transferType === 'pix' ? (
                <div id="pix-form">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Chave PIX
                    </label>
                    <div className="flex space-x-2">
                      <select
                        value={pixKeyType}
                        onChange={(e) => setPixKeyType(e.target.value)}
                        className="bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-32 p-2.5"
                      >
                        <option>CPF</option>
                        <option>E-mail</option>
                        <option>Celular</option>
                        <option>Aleatória</option>
                      </select>
                      <input
                        type="text"
                        value={pixKey}
                        onChange={(e) => setPixKey(e.target.value)}
                        className="bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                        placeholder="000.000.000-00"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Ou escaneie o QR Code
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="qr-scanner">
                        <FontAwesomeIcon icon={faCamera} className="text-gray-400 text-4xl" />
                      </div>
                      <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                        Como funciona?
                      </button>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nome do favorecido
                    </label>
                    <input
                      type="text"
                      value={pixName}
                      onChange={(e) => setPixName(e.target.value)}
                      className="bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                      placeholder="Digite o nome completo"
                    />
                  </div>
                </div>
              ) : (
                <div id="ted-doc-form">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Banco
                    </label>
                    <select
                      value={bank}
                      onChange={(e) => setBank(e.target.value)}
                      className="bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                    >
                      <option>Selecione o banco</option>
                      <option>Banco do Brasil (001)</option>
                      <option>Bradesco (237)</option>
                      <option>Caixa Econômica (104)</option>
                      <option>Itaú (341)</option>
                      <option>Santander (033)</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Agência
                      </label>
                      <input
                        type="text"
                        value={agency}
                        onChange={(e) => setAgency(e.target.value)}
                        className="bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                        placeholder="0000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Conta
                      </label>
                      <input
                        type="text"
                        value={account}
                        onChange={(e) => setAccount(e.target.value)}
                        className="bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                        placeholder="00000-0"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      CPF/CNPJ do favorecido
                    </label>
                    <input
                      type="text"
                      value={cpfCnpj}
                      onChange={(e) => setCpfCnpj(e.target.value)}
                      className="bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                      placeholder="000.000.000-00"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nome do favorecido
                    </label>
                    <input
                      type="text"
                      value={tedDocName}
                      onChange={(e) => setTedDocName(e.target.value)}
                      className="bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                      placeholder="Digite o nome completo"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mt-6">
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Detalhes da transferência</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Valor
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400">R$</span>
                  </div>
                  <input
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    className="bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5"
                    placeholder="0,00"
                  />
                </div>
                <p id="min-value" className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Valor mínimo: {transferType === 'pix' ? 'R$ 1,00' : transferType === 'ted' ? 'R$ 1.000,00' : 'R$ 500,00'}
                </p>
              </div>
              {transferType !== 'pix' && (
                <div id="ted-doc-tax">
                  <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Taxa</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        R$ {transferType === 'ted' ? '5,00' : '3,00'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Total</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        R$ {(parseFloat(amount.replace('.', '').replace(',', '.')) || 0 + (transferType === 'ted' ? 5 : 3)).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descrição (opcional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                placeholder="Ex: Pagamento de serviços"
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleConfirm}
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-colors"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferContent;