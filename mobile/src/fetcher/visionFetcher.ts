import { Platform } from 'react-native';
import { apiHttp } from './http';

export type VisaoAmbienteResponse = {
  classificacao_geral: string;
  ergonomia: any;
  iluminacao: any;
  organizacao: any;
  recomendacoes: string[];
};

export async function postVisaoAmbienteTrabalho(
  uri: string,
  mimeType: string,
): Promise<VisaoAmbienteResponse> {
  const form = new FormData();

  if (Platform.OS === 'web') {
    // Web precisa converter a URI (blob:) em Blob/File
    const res = await fetch(uri);
    const blob = await res.blob();
    form.append('imagem', blob, 'foto.jpg');
  } else {
    form.append('imagem', {
      uri,
      name: 'foto.jpg',
      type: mimeType,
    } as any);
  }

  const { data } = await apiHttp.post<VisaoAmbienteResponse>(
    '/visao/ambiente-trabalho',
    form,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return data;
}
