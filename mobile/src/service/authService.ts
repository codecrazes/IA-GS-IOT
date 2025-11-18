import { usuarioSchema, Usuario, UsuarioErros } from '@model/usuario';
import { ValidationError } from 'yup';

type Ok = { ok: true; token: string; email: string };
type Fail = { ok: false; erroGeral?: string; erros?: UsuarioErros };

// Valida só com yup e cria um "token fake" local
async function validateUsuario(u: Usuario): Promise<UsuarioErros | null> {
  try {
    await usuarioSchema.validate(u, { abortEarly: false });
    return null;
  } catch (err) {
    const erros: UsuarioErros = {};
    if (err instanceof ValidationError) {
      err.inner?.forEach((e) => {
        if (e.path) erros[e.path as keyof Usuario] = e.message;
      });
    }
    return erros;
  }
}

export async function loginService(u: Usuario): Promise<Ok | Fail> {
  const erros = await validateUsuario(u);
  if (erros) {
    return { ok: false, erros };
  }

  // aqui poderíamos verificar em algum backend, mas pra GS vamos aceitar qualquer email/senha válidos
  const fakeToken = `fake-token-${u.email}-${Date.now()}`;
  return { ok: true, token: fakeToken, email: u.email };
}

export async function registerService(u: Usuario): Promise<Ok | Fail> {
  const erros = await validateUsuario(u);
  if (erros) {
    return { ok: false, erros };
  }

  // mesmo fluxo do login: cria token fake e "logado"
  const fakeToken = `fake-token-${u.email}-${Date.now()}`;
  return { ok: true, token: fakeToken, email: u.email };
}
