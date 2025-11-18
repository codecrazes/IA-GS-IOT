import { UsuarioApi } from '@model/usuario';
import { IaApi } from '@model/ia';

export type RecomendacaoApi = {
  id: number;
  conteudoGerado?: string | null;
  insights?: string | null;
  passos?: string | null;
  dataGeracao: string;
  usuario: UsuarioApi;
  ia?: IaApi | null;
};
