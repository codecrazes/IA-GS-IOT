import { useContext, useState } from 'react';
import { Usuario, UsuarioErros, usuarioSchema } from '@model/usuario';
import { loginService, registerService } from '@service/authService';
import { AuthContext } from '@context/AuthContext';
import * as yup from 'yup';

export function useAuthControl() {
  const { abrirSessao } = useContext(AuthContext);
  const [usuario, setUsuario] = useState<Usuario>({ email: '', senha: '' });
  const [erros, setErros] = useState<UsuarioErros>({});
  const [loading, setLoading] = useState(false);
  const [erroGeral, setErroGeral] = useState<string | null>(null);

  async function validateField<K extends keyof Usuario>(campo: K, valor: Usuario[K]) {
    try {
      await yup.reach(usuarioSchema, campo).validate(valor, { abortEarly: true });
      setErros((prev) => ({ ...prev, [campo]: undefined }));
    } catch (e: any) {
      const msg = typeof e?.message === 'string' ? e.message : undefined;
      setErros((prev) => ({ ...prev, [campo]: msg }));
    }
  }

  function onChange<K extends keyof Usuario>(campo: K, valor: Usuario[K]) {
    setUsuario((prev) => ({ ...prev, [campo]: valor }));
    setErroGeral(null);
    validateField(campo, valor);
  }

  async function onLogin() {
    setLoading(true);
    setErroGeral(null);
    setErros({});
    const res = await loginService(usuario);
    setLoading(false);
    if (res.ok) {
      abrirSessao(res.token, res.email);
      return;
    }
    if ('erros' in res && res.erros) setErros(res.erros);
    if ('erroGeral' in res) setErroGeral(res.erroGeral || null);
  }

  async function onRegister() {
    setLoading(true);
    setErroGeral(null);
    setErros({});
    const res = await registerService(usuario);
    setLoading(false);
    if (res.ok) {
      abrirSessao(res.token, res.email);
      return;
    }
    if ('erros' in res && res.erros) setErros(res.erros);
    if ('erroGeral' in res) setErroGeral(res.erroGeral || null);
  }

  return { usuario, erros, erroGeral, loading, onChange, onLogin, onRegister };
}
