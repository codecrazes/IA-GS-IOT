import * as yup from 'yup';

export const promptSchema = yup.object({
  titulo: yup
    .string()
    .required('O título é obrigatório.')
    .min(2, 'O título deve ter pelo menos 2 caracteres.')
    .max(120, 'O título deve ter no máximo 120 caracteres.'),
  descricao: yup
    .string()
    .required('O prompt é obrigatório.')
    .min(5, 'O prompt deve ter pelo menos 5 caracteres.')
    .max(4000, 'O prompt deve ter no máximo 4000 caracteres.')
});

export type PromptInput = {
  titulo: string;
  descricao: string;
};
