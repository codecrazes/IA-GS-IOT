import * as yup from 'yup';
import i18n from '@i18n';

export type Usuario = {
  email: string;
  senha: string;
};

export type UsuarioApi = {
  id: number;
  nome: string;
  email?: string | null;
  senha?: string | null;
  profissao?: string | null;
};

export type UsuarioErros = Partial<Record<keyof Usuario, string>>;

const emailField = yup
  .string()
  .transform((v) => (v ?? '').trim())
  .required(i18n.t('auth.fields.email.required'))
  .email(i18n.t('auth.fields.email.invalid'));

const senhaField = yup
  .string()
  .required(i18n.t('auth.fields.password.required'))
  .min(6, i18n.t('auth.fields.password.min', { min: 6 }));

export const usuarioSchema = yup.object({
  email: emailField,
  senha: senhaField,
});

export const perfilSchema = yup.object({
  nome: yup
    .string()
    .transform((v) => (v ?? '').trim())
    .required(i18n.t('user.errors.nameRequired'))
    .min(2, i18n.t('user.errors.nameTooShort'))
    .max(50, i18n.t('user.errors.nameTooLong')),
});
