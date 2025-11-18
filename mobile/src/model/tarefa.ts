import * as yup from 'yup';

export const tarefaSchema = yup.object({
  titulo: yup
    .string()
    .required('O título é obrigatório.')
    .min(2, 'O título deve ter pelo menos 2 caracteres.')
    .max(120, 'O título deve ter no máximo 120 caracteres.'),
  descricao: yup
    .string()
    .required('A descrição é obrigatória.')
    .min(5, 'A descrição deve ter pelo menos 5 caracteres.')
    .max(4000, 'A descrição deve ter no máximo 4000 caracteres.'),
  dificuldade: yup
    .string()
    .nullable()
    .max(50, 'A dificuldade deve ter no máximo 50 caracteres.'),
  tempoDisponivel: yup
    .number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === '' || originalValue === null ? null : value
    )
    .integer('O tempo disponível deve ser um número inteiro.')
    .positive('O tempo disponível deve ser maior que zero.')
});

export type TarefaInput = {
  titulo: string;
  descricao: string;
  dificuldade?: string | null;
  tempoDisponivel?: number | null;
};
