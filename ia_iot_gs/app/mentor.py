import os
import json
from typing import Optional, Dict, Any, List

from fastapi import HTTPException
import google.genai as genai

from .store import IAS
from .analytics import ias_mais_usadas, consumo_eco_estimado_por_usuario


# --------------------------
# 0. CLIENT GEMINI
# --------------------------

def _get_gemini_client() -> genai.Client:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY não configurada.")
    return genai.Client(api_key=api_key)


def _get_gemini_model() -> str:
    return os.getenv("GEMINI_MODEL", "gemini-2.0-flash")


# --------------------------
# 1. CATEGORIZAÇÃO DA TAREFA
# --------------------------

def _categorize(descricao: str) -> str:
    t = descricao.lower()
    if any(k in t for k in ["tiktok", "reels", "vídeo", "video"]):
        return "edicao_video"
    if any(k in t for k in ["post", "artigo", "texto", "redação"]):
        return "texto"
    if any(k in t for k in ["design", "imagem", "banner"]):
        return "design"
    if any(k in t for k in ["dados", "planilha", "analise", "análise"]):
        return "analise_dados"
    return "geral"


# --------------------------
# 2. ESCOLHER IA BASEADA NA CATEGORIA
# --------------------------

def _pick_ia(cat: str) -> dict:
    for ia in IAS.values():
        if cat in [e.replace(" ", "_").lower() for e in ia["especializacoes"]]:
            return ia
    # fallback: mais rápida
    return sorted(IAS.values(), key=lambda x: x["velocidade"], reverse=True)[0]


# --------------------------
# 3. CHAMADA GEMINI → JSON (MENTOR PRINCIPAL)
# --------------------------

def _call_gemini_mentor(descricao: str, contexto: Optional[str] = None) -> Dict[str, Any]:
    """
    Chama o Gemini pedindo um JSON com o plano da tarefa (mentor digital).
    """
    client = _get_gemini_client()
    model = _get_gemini_model()

    prompt = f"""
    Você é um mentor digital de produtividade com IA.

    Gere APENAS um JSON com o formato:

    {{
      "ia_indicada": "chatgpt|claude|gemini|capcut|stable_diffusion",
      "quando_usar": "...",
      "quando_evitar": "...",
      "passos_humano": ["...","..."],
      "passos_com_ia": ["...","..."],
      "dificuldade": "baixa|media|alta",
      "tempo_estimado_min": 30
    }}

    Regras:
    - Responda em pt-BR.
    - Não escreva nada fora do JSON.
    - Tarefa do usuário: {descricao}
    - Contexto: {contexto or "N/A"}
    - Se for tarefa de vídeo curto (TikTok/Reels), priorize "capcut".
    - Se for texto/blog, use "chatgpt" por padrão.
    - Se for imagem/design, use "stable_diffusion".
    """

    try:
        result = client.models.generate_content(
            model=model,
            contents=prompt,
            config={"response_mime_type": "application/json"},
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Erro no Gemini (mentor): {e!r}")

    raw = result.text

    try:
        data = json.loads(raw)
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Resposta do Gemini (mentor) não era JSON válido: {e!r} | Conteúdo={raw!r}"
        )

    # Aceitar lista e pegar o primeiro item, se vier assim
    if isinstance(data, list):
        if not data:
            raise HTTPException(status_code=502, detail="Gemini (mentor) retornou uma lista vazia.")
        data = data[0]

    if not isinstance(data, dict):
        raise HTTPException(status_code=502, detail="Gemini (mentor) não retornou um objeto JSON.")

    return data


# --------------------------
# 4. FUNÇÃO PRINCIPAL DO MENTOR (USADA PELO ENDPOINT /mentor/explicar-tarefa)
# --------------------------

def explain_task(descricao: str, contexto: Optional[str] = None) -> Dict[str, Any]:
    """
    Gera o plano da tarefa:
    - ia_indicada
    - quando_usar / quando_evitar
    - passos_humano / passos_com_ia
    - dificuldade / tempo_estimado_min
    """
    categoria = _categorize(descricao)
    ia_default = _pick_ia(categoria)

    data = _call_gemini_mentor(descricao, contexto)

    # Se vier uma ia_indicada fora da nossa base, troca pela padrão daquela categoria
    if data.get("ia_indicada") not in IAS:
        data["ia_indicada"] = ia_default["id"]

    # Pode adicionar categoria se quiser usar na telemetria
    data["categoria"] = categoria

    return data


# --------------------------
# 5. GEMINI + ANALYTICS: RESUMO DE USO DE IA (COACH)
# --------------------------

def gerar_resumo_uso_ia(usuario_id: str) -> str:
    """
    Usa os analytics + Gemini para gerar um texto amigável
    explicando como o usuário está usando IA e sugerindo melhorias.
    """
    client = _get_gemini_client()
    model = _get_gemini_model()

    top_ias = ias_mais_usadas()
    eco_user = consumo_eco_estimado_por_usuario(usuario_id)

    prompt = f"""
    Você é um coach de produtividade com IA e sustentabilidade.

    Dados globais de uso de IA (todos usuários):
    {json.dumps(top_ias, ensure_ascii=False, indent=2)}

    Dados de uso do usuário {usuario_id}:
    {json.dumps(eco_user, ensure_ascii=False, indent=2)}

    Gere um texto em pt-BR, em 2 a 3 parágrafos, explicando:
    - Quais tipos de IA esse usuário tende a usar mais ou menos;
    - Como está a pegada energética estimada (sem números exatos, só qualitativo: baixa, média, alta);
    - 3 recomendações práticas para ele usar IA de forma mais eficiente e sustentável,
      considerando produtividade e bem-estar.
    Mantenha um tom encorajador e simples, sem termos muito acadêmicos.
    """

    try:
        result = client.models.generate_content(
            model=model,
            contents=prompt,
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Erro no Gemini (resumo uso IA): {e!r}")

    return (result.text or "").strip()


# --------------------------
# 6. GEMINI: PLANO DE ESTUDO / DESENVOLVIMENTO
# --------------------------

def gerar_plano_estudo(objetivo: str, horas_semana: int) -> Dict[str, Any]:
    """
    Gera um plano de estudo/desenvolvimento em JSON
    com semanas, temas e tarefas.
    """
    client = _get_gemini_client()
    model = _get_gemini_model()

    prompt = f"""
    Você é um mentor de desenvolvimento profissional focado em IA e futuro do trabalho.

    Gere APENAS um JSON com o formato:

    {{
      "objetivo": "...",
      "duracao_semanas": 4,
      "semanas": [
        {{
          "semana": 1,
          "foco": "...",
          "temas": ["...","..."],
          "tarefas": ["...","..."]
        }}
      ]
    }}

    Regras:
    - Responda em pt-BR.
    - Não escreva nada fora do JSON.
    - Adapte o plano ao objetivo: "{objetivo}".
    - Considere que o usuário tem aproximadamente {horas_semana} horas por semana disponíveis.
    - Use entre 3 e 6 semanas, dependendo da carga horária.
    """

    try:
        result = client.models.generate_content(
            model=model,
            contents=prompt,
            config={"response_mime_type": "application/json"},
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Erro no Gemini (plano estudo): {e!r}")

    raw = result.text

    try:
        data = json.loads(raw)
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Resposta do Gemini (plano estudo) não era JSON válido: {e!r} | Conteúdo={raw!r}"
        )

    if isinstance(data, list):
        if not data:
            raise HTTPException(status_code=502, detail="Gemini (plano estudo) retornou lista vazia.")
        data = data[0]

    if not isinstance(data, dict):
        raise HTTPException(status_code=502, detail="Gemini (plano estudo) não retornou objeto JSON.")

    return data


# --------------------------
# 7. GEMINI: REFINAR RESULTADO / TEXTO
# --------------------------

def refinar_resultado(tipo: str, texto_inicial: str, tom: str, tamanho: str) -> Dict[str, Any]:
    """
    Usa o Gemini para refinar um texto (ex.: post LinkedIn, roteiro de vídeo),
    retornando texto refinado + explicação das melhorias.
    """
    client = _get_gemini_client()
    model = _get_gemini_model()

    prompt = f"""
    Você é um assistente de escrita e comunicação.

    Tipo de conteúdo: {tipo}
    Tom desejado: {tom}
    Tamanho desejado: {tamanho}

    Texto inicial:
    \"\"\"{texto_inicial}\"\"\"

    Tarefas:
    - Reescrever o texto, mantendo a ideia principal, mas ajustando para o tipo/tom/tamanho desejados.
    - Explicar de forma breve o que foi melhorado.

    Responda APENAS um JSON no formato:

    {{
      "texto_refinado": "...",
      "explicacao_melhorias": "..."
    }}

    Em pt-BR.
    """

    try:
        result = client.models.generate_content(
            model=model,
            contents=prompt,
            config={"response_mime_type": "application/json"},
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Erro no Gemini (refinar resultado): {e!r}")

    raw = result.text

    try:
        data = json.loads(raw)
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Resposta do Gemini (refinar resultado) não era JSON válido: {e!r} | Conteúdo={raw!r}"
        )

    if isinstance(data, list):
        if not data:
            raise HTTPException(status_code=502, detail="Gemini (refinar resultado) retornou lista vazia.")
        data = data[0]

    if not isinstance(data, dict):
        raise HTTPException(status_code=502, detail="Gemini (refinar resultado) não retornou objeto JSON.")

    return data
