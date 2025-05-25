import { z } from 'zod';
import { type FieldErrors } from 'react-hook-form';
import { validarCNPJ, validarCPF } from '~/utils/validator'

// Custom validator for CPF/CNPJ
const documentValidator = z
  .string()
  .min(1, 'CPF/CNPJ é obrigatório')
  .refine(
    (val) => {
      const cleaned = val.replace(/[^\d]/g, '');
      if (cleaned.length === 11) return validarCPF(cleaned);
      if (cleaned.length === 14) return validarCNPJ(cleaned);
      return false;
    },
    {
      message: 'CPF (11 dígitos) ou CNPJ (14 dígitos) inválido',
    }
  );

// Map to C# BilletType enum for expenses
const billetTypeEnum = z.enum(['SHOPPING', 'TRAVEL', 'FOOD', 'LEISURE', 'HEALTH', 'OTHER'], {
  errorMap: () => ({ message: 'Selecione uma categoria válida' }),
});

// Combined deposit schema
export const depositSchema = z
  .object({
    depositType: z.enum(['direct', 'boleto'], {
      errorMap: () => ({ message: 'Tipo de depósito inválido' }),
    }),
    billetType: z.union([z.literal('DEPOSIT'), billetTypeEnum], {
      errorMap: () => ({ message: 'Tipo de boleto inválido' }),
    }),
    amount: z
      .string()
      .min(1, 'Valor é obrigatório')
      .regex(/^\d+(\.\d{2})?$/, 'O valor deve estar no formato 0.00')
      .refine(
        (val) => {
          const numeric = parseFloat(val);
          return !isNaN(numeric) && numeric >= 10;
        },
        { message: 'Valor mínimo: R$ 10,00' }
      ),
    description: z.string().max(100, 'A descrição deve ter no máximo 100 caracteres').optional(),
    nameReceiver: z.string().optional(),
    documentReceiver: z.string().optional(),
    ispb: z.string().optional(),
    agencyNumberReceiver: z.string().optional(),
    accountNumberReceiver: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.depositType === 'direct') {
      // Direct deposit requires billetType to be DEPOSIT and no receiver fields
      if (data.billetType !== 'DEPOSIT') {
        ctx.addIssue({
          path: ['billetType'],
          code: z.ZodIssueCode.custom,
          message: 'Para depósito direto, o tipo de boleto deve ser DEPOSIT',
        });
      }
      if (
        data.nameReceiver ||
        data.documentReceiver ||
        data.ispb ||
        data.agencyNumberReceiver ||
        data.accountNumberReceiver
      ) {
        ctx.addIssue({
          path: ['nameReceiver'],
          code: z.ZodIssueCode.custom,
          message: 'Campos de recebedor não são permitidos para depósito direto',
        });
      }
    } else if (data.depositType === 'boleto') {
      if (data.billetType === 'DEPOSIT') {
        // Boleto deposit requires all receiver fields
        if (!data.nameReceiver) {
          ctx.addIssue({
            path: ['nameReceiver'],
            code: z.ZodIssueCode.custom,
            message: 'O nome do recebedor é obrigatório',
          });
        } else if (data.nameReceiver.length < 3 || data.nameReceiver.length > 100) {
          ctx.addIssue({
            path: ['nameReceiver'],
            code: z.ZodIssueCode.custom,
            message: 'O nome deve ter entre 3 e 100 caracteres',
          });
        }
        if (!data.documentReceiver) {
          ctx.addIssue({
            path: ['documentReceiver'],
            code: z.ZodIssueCode.custom,
            message: 'CPF/CNPJ é obrigatório',
          });
        } else {
          const cleaned = data.documentReceiver.replace(/[^\d]/g, '');
          if (cleaned.length === 11 && !validarCPF(cleaned)) {
            ctx.addIssue({
              path: ['documentReceiver'],
              code: z.ZodIssueCode.custom,
              message: 'CPF inválido',
            });
          } else if (cleaned.length === 14 && !validarCNPJ(cleaned)) {
            ctx.addIssue({
              path: ['documentReceiver'],
              code: z.ZodIssueCode.custom,
              message: 'CNPJ inválido',
            });
          } else if (cleaned.length !== 11 && cleaned.length !== 14) {
            ctx.addIssue({
              path: ['documentReceiver'],
              code: z.ZodIssueCode.custom,
              message: 'CPF (11 dígitos) ou CNPJ (14 dígitos) inválido',
            });
          }
        }
        if (!data.ispb) {
          ctx.addIssue({
            path: ['ispb'],
            code: z.ZodIssueCode.custom,
            message: 'Selecione um banco válido',
          });
        }
        if (!data.agencyNumberReceiver || !/^\d{1,10}$/.test(data.agencyNumberReceiver)) {
          ctx.addIssue({
            path: ['agencyNumberReceiver'],
            code: z.ZodIssueCode.custom,
            message: 'A agência deve ter entre 1 e 10 dígitos',
          });
        }
        if (!data.accountNumberReceiver || !/^\d{1,20}$/.test(data.accountNumberReceiver)) {
          ctx.addIssue({
            path: ['accountNumberReceiver'],
            code: z.ZodIssueCode.custom,
            message: 'A conta deve ter entre 1 e 20 dígitos',
          });
        }
      } else {
        // Boleto expense requires no receiver fields
        if (
          data.nameReceiver ||
          data.documentReceiver ||
          data.ispb ||
          data.agencyNumberReceiver ||
          data.accountNumberReceiver
        ) {
          ctx.addIssue({
            path: ['nameReceiver'],
            code: z.ZodIssueCode.custom,
            message: 'Campos de recebedor não são permitidos para boleto de gasto',
          });
        }
      }
    }
  });

// Schema for Boleto Payment
export const boletoPaymentSchema = z.object({
  billetCode: z
    .string()
    .min(1, 'Código de boleto é obrigatório')
    .regex(/^\d{44}$/, 'O código de boleto deve ter exatamente 44 dígitos numéricos'),
  paymentMethod: z.enum(['account', 'credit'], {
    errorMap: () => ({ message: 'Selecione um método de pagamento válido' }),
  }),
  billetType: billetTypeEnum,
});

// Inferred types
export type DepositFormData = z.infer<typeof depositSchema>;
export type BoletoPaymentFormData = z.infer<typeof boletoPaymentSchema>;
export type DepositFormErrors = FieldErrors<DepositFormData>;
export type BoletoPaymentFormErrors = FieldErrors<BoletoPaymentFormData>;

export type DepositPayload =
  | {
      depositType: 'direct';
      billetType: 'DEPOSIT';
      amount: string;
      description?: string;
      accountId: string;
      isDeposit: true;
    }
  | {
      depositType: 'boleto';
      billetType: 'DEPOSIT';
      amount: string;
      description?: string;
      accountId: string;
      isDeposit: true;
      nameReceiver: string;
      documentReceiver: string;
      ispb: string;
      agencyNumberReceiver: string;
      accountNumberReceiver: string;
    }
  | {
      depositType: 'boleto';
      billetType: 'SHOPPING' | 'TRAVEL' | 'FOOD' | 'LEISURE' | 'HEALTH' | 'OTHER';
      amount: string;
      description?: string;
      accountId: string;
      isDeposit: false;
    };

export type BoletoPaymentPayload = {
  boletoCountrywide: string;
  paymentMethod: 'account' | 'credit';
  billetType: 'SHOPPING' | 'TRAVEL' | 'FOOD' | 'LEISURE' | 'HEALTH' | 'OTHER';
};