import { z } from 'zod';

export const pixSchemaBase = z.object({
  transferType: z.literal('pix'),
  keyType: z.enum(['cpf', 'email', 'celular', 'aleatorio'], {
    errorMap: () => ({ message: 'Tipo de chave PIX inválido' }),
  }),
  keyAccount: z.string().min(1, 'Chave PIX é obrigatória'),
  nameReceiver: z.string().min(1, 'Nome do favorecido é obrigatório'),
  amount: z
    .string()
    .min(1, 'Valor é obrigatório')
    .refine(
      (val) => {
        const numeric = parseFloat(val.replace('.', '').replace(',', '.'));
        return !isNaN(numeric) && numeric >= 1;
      },
      { message: 'Valor mínimo: R$ 1,00' }
    ),
  description: z.string().optional(),
});

export const pixSchema = pixSchemaBase.superRefine((data, ctx) => {
  const { keyType, keyAccount } = data;

  switch (keyType) {
    case 'cpf': {
      const cleaned = keyAccount.replace(/[^\d]/g, '');
      if (!/^\d{11}$/.test(cleaned)) {
        ctx.addIssue({
          path: ['keyAccount'],
          code: z.ZodIssueCode.custom,
          message: 'CPF inválido. Deve conter 11 dígitos.',
        });
      }
      break;
    }

    case 'email': {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(keyAccount)) {
        ctx.addIssue({
          path: ['keyAccount'],
          code: z.ZodIssueCode.custom,
          message: 'E-mail inválido.',
        });
      }
      break;
    }

    case 'celular': {
      const cleaned = keyAccount.replace(/[^\d]/g, '');
      if (!/^\d{10,11}$/.test(cleaned)) {
        ctx.addIssue({
          path: ['keyAccount'],
          code: z.ZodIssueCode.custom,
          message: 'Celular inválido. Use DDD + número.',
        });
      }
      break;
    }

    case 'aleatorio': {
      if (keyAccount.length !== 36) {
        ctx.addIssue({
          path: ['keyAccount'],
          code: z.ZodIssueCode.custom,
          message: 'Chave aleatória inválida. Esperado UUID com 36 caracteres.',
        });
      }
      break;
    }
  }
});

export type PixFormData = z.infer<typeof pixSchema>;


export const tedDocSchema = z.object({
  transferType: z.enum(['ted', 'doc'], {
    errorMap: () => ({ message: 'Tipo de transferência inválido' }),
  }),
  bank: z.string().min(1, 'Banco é obrigatório'),
  agencyReceiver: z.string().min(4, 'Agência deve ter pelo menos 4 dígitos'),
  accountNumberReceiver: z.string().min(8, 'Conta é obrigatória'),
  documentReceiver: z
    .string()
    .min(1, 'CPF/CNPJ é obrigatório')
    .refine(
      (val) => /^\d{11}$|^\d{14}$/.test(val.replace(/[^\d]/g, '')),
      'CPF/CNPJ inválido'
    ),
  nameReceiver: z.string().min(1, 'Nome do favorecido é obrigatório'),
  amount: z
    .string()
    .min(1, 'Valor é obrigatório')
    .refine(
      (val) => {
        const numeric = parseFloat(val.replace('.', '').replace(',', '.'));
        return !isNaN(numeric) && numeric >= 500;
      },
      { message: 'Valor mínimo: R$ 500,00' }
    ),
  description: z.string().optional(),
});

export type TedDocFormData = z.infer<typeof tedDocSchema>;
import { type FieldErrors } from 'react-hook-form';

export const transferSchema = z.union([pixSchema, tedDocSchema]);

export type TransferFormData = z.infer<typeof transferSchema>;
export type PixFormErrors = FieldErrors<PixFormData>;
export type TedDocFormErrors = FieldErrors<TedDocFormData>;

export type TransferPayload =
  | {
      transferType: 'pix';
      keyType: 'cpf' | 'email' | 'celular' | 'aleatorio';
      keyAccount: string;
      nameReceiver: string;
      amount: string;
      description?: string;
    }
  | {
      transferType: 'ted' | 'doc';
      bank: string;
      agencyReceiver: string;
      accountNumberReceiver: string;
      documentReceiver: string;
      nameReceiver: string;
      amount: string;
      description?: string;
    };