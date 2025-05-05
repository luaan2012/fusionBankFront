import { z } from 'zod';
import { type FieldErrors } from 'react-hook-form';

// Esquemas base para cada tipo de login
const accountSchema = z.object({
  loginType: z.literal('account'),
  accountNumber: z.string().min(8, 'Número da conta é obrigatório'),
  agency: z.string().min(4, 'Número da agência é obrigatório'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

const documentSchema = z.object({
  loginType: z.literal('document'),
  document: z
    .string()
    .min(1, 'CPF/CNPJ é obrigatório')
    .refine(
      val => /^\d{11}$|^\d{14}$/.test(val.replace(/[^\d]/g, '')),
      'CPF/CNPJ inválido'
    ),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

const emailSchema = z.object({
  loginType: z.literal('email'),
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

// Esquema unificado
export const loginSchema = z.discriminatedUnion('loginType', [
  accountSchema,
  documentSchema,
  emailSchema,
]);

// Tipo do formulário
export type LoginFormData = z.infer<typeof loginSchema>;

// Tipos específicos para cada variante
export type AccountFormData = z.infer<typeof accountSchema>;
export type DocumentFormData = z.infer<typeof documentSchema>;
export type EmailFormData = z.infer<typeof emailSchema>;

// Tipos para FieldErrors de cada variante
export type AccountFormErrors = FieldErrors<AccountFormData>;
export type DocumentFormErrors = FieldErrors<DocumentFormData>;
export type EmailFormErrors = FieldErrors<EmailFormData>;

// Tipo do payload
export type LoginPayload =
  | { password: string; accountNumber: string; agency: string }
  | { password: string; document: string }
  | { password: string; email: string }
  | { password: string; loginType: string, loginUser: string };