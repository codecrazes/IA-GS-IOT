# app/vision.py

import os, json
from fastapi import UploadFile, HTTPException
import google.genai as genai


def _get_gemini_client() -> genai.Client:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY não configurada.")
    return genai.Client(api_key=api_key)


def _get_model():
    return os.getenv("GEMINI_MODEL", "gemini-1.5-flash")


def analisar_ambiente_trabalho(imagem: UploadFile):
    """
    Usa o Gemini Vision para analisar uma imagem e gerar um relatório
    sobre ergonomia, iluminação, organização e distrações.
    """
    client = _get_gemini_client()
    model = _get_model()

    # Lê o binário da imagem
    img_bytes = imagem.file.read()

    prompt = """
    Você é um especialista em ergonomia, produtividade e bem-estar no trabalho.

    A partir da imagem enviada, ANALISE e RETORNE APENAS UM JSON no formato:

    {
      "classificacao_geral": "ótimo | bom | razoável | ruim",
      "ergonomia": {
        "postura_provavel": "...",
        "altura_tela": "...",
        "altura_cadeira": "...",
        "riscos": ["...", "..."]
      },
      "iluminacao": {
        "nivel": "boa | média | baixa",
        "fontes": ["luz natural", "luz artificial", "sombra"],
        "problemas": ["...", "..."]
      },
      "organizacao": {
        "nivel": "organizado | moderado | bagunçado",
        "itens_na_mesa": ["teclado", "caderno", "garrafa", ...],
        "distracoes": ["...", "..."]
      },
      "recomendacoes": [
        "Ajustar altura da tela para nível dos olhos",
        "Melhorar iluminação frontal",
        "Reduzir distrações",
        "Organizar itens essenciais"
      ]
    }

    IMPORTANTE:
    - Retorne SOMENTE o JSON (nenhum texto fora dele).
    - Use pt-BR.
    """

    try:
        result = client.models.generate_content(
            model=model,
            contents=[
                {
                    "role": "user",
                    "parts": [
                        {"text": prompt},
                        {"inline_data": {"data": img_bytes, "mime_type": imagem.content_type}}
                    ]
                }
            ],
            config={"response_mime_type": "application/json"}
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Erro no Gemini Vision: {e!r}")

    raw = result.text

    # Tenta converter para JSON
    try:
        data = json.loads(raw)
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Retorno do Gemini não era JSON: {e!r} | Conteúdo={raw!r}"
        )

    return data
