export interface RegisterKeyPix {
  accountId?: string;
  keyPix: string;
  keyTypePix: 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'RANDOM'
}

