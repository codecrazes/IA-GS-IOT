import * as yup from 'yup';

export const avaliacaoSchema = yup.object({
  nota: yup
    .number()
    .typeError('Informe uma nota entre 0 e 10.')
    .required('A nota é obrigatória.')
    .min(0, 'A nota deve ser no mínimo 0.')
    .max(10, 'A nota deve ser no máximo 10.'),
  comentario: yup
    .string()
    .nullable()
    .max(1000, 'O comentário deve ter no máximo 1000 caracteres.'),
  usuarioId: yup
    .number()
    .typeError('Usuário inválido.')
    .integer('Usuário inválido.')
    .positive('Usuário inválido.')
    .required('Usuário é obrigatório.'),
  iaId: yup
    .number()
    .typeError('IA inválida.')
    .integer('IA inválida.')
    .positive('IA inválida.')
    .required('IA é obrigatória.')
});

export type AvaliacaoInput = {
  nota: number;
  comentario?: string | null;
  usuarioId: number;
  iaId: number;
};
