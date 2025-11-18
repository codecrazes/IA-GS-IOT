# app/analytics.py
from typing import Any, Dict, List
from collections import Counter

from .telemetry import list_events
from .store import IAS


def ias_mais_usadas(top_n: int = 5) -> List[Dict[str, Any]]:
    """
    Calcula as IAs mais usadas com base nos eventos de telemetria.
    Considera principalmente eventos 'mentor_resposta', onde
    o payload ou o próprio evento tem a chave 'ia_indicada'.

    Retorna uma lista de dicts:
    [
      { "ia_id": "...", "nome": "...", "usos": 10, "eco_score": 8.5 },
      ...
    ]
    """

    eventos = list_events(limit=5000)

    contagem: Counter[str] = Counter()

    for e in eventos:
        if e.get("evento") != "mentor_resposta":
            continue

        ia = e.get("ia_indicada")
        if not ia and isinstance(e.get("payload"), dict):
            ia = e["payload"].get("ia_indicada")

        if not ia:
            continue

        contagem[ia] += 1

    # monta o ranking
    ranking: List[Dict[str, Any]] = []
    for ia_nome, usos in contagem.most_common(top_n):
        eco_score = None
        nome_exibicao = ia_nome

        # tenta achar na store de IAs para pegar eco_score e nome bonito
        for ia_id, cfg in IAS.items():
            if ia_id == ia_nome or cfg.get("nome_exibicao") == ia_nome:
                eco_score = cfg.get("eco_score")
                nome_exibicao = cfg.get("nome_exibicao") or ia_nome
                break

        ranking.append(
            {
                "ia_id": ia_nome,
                "nome": nome_exibicao,
                "usos": usos,
                "eco_score": eco_score,
            }
        )

    return ranking


def uso_por_categoria() -> List[Dict[str, Any]]:
    """
    Agrupa os eventos de telemetria pela chave 'categoria'
    (quando estiver presente) para entender tipos de uso: texto, vídeo, etc.

    Retorna:
    [
      { "categoria": "texto", "quantidade": 12 },
      { "categoria": "edicao_video", "quantidade": 4 },
      ...
    ]
    """
    eventos = list_events(limit=5000)

    contagem: Counter[str] = Counter()

    for e in eventos:
        cat = e.get("categoria")
        if not cat and isinstance(e.get("payload"), dict):
            cat = e["payload"].get("categoria")
        if not cat:
            continue
        contagem[cat] += 1

    return [
        {"categoria": cat, "quantidade": qtd}
        for cat, qtd in contagem.most_common()
    ]


def consumo_eco_estimado_por_usuario(usuario_id: str) -> Dict[str, Any]:
    """
    Lê os eventos de telemetria e calcula uma estimativa de:
    - total de chamadas de IA
    - kWh consumido (aprox)
    - CO2 emitido (aprox)
    - IA mais utilizada
    - nível de consumo (baixo / moderado / alto)

    Esse formato é compatível com o que o mobile (Insights) espera.
    """

    eventos = list_events(limit=5000)

    eventos_usuario = [
        e
        for e in eventos
        if e.get("usuario_id") == usuario_id
        and e.get("evento") in ("mentor_resposta", "visao_ambiente")
    ]

    total_chamadas = len(eventos_usuario)

    # Estimativa didática:
    # 1 chamada de IA ~ 0.003 kWh
    kwh_estimado = total_chamadas * 0.003
    # 1 kWh ~ 0.4 kg CO2 (aprox)
    co2_estimado_kg = kwh_estimado * 0.4

    # Conta IA mais utilizada
    contagem_por_ia: Counter[str] = Counter()
    for e in eventos_usuario:
        ia = e.get("ia_indicada")
        if not ia and isinstance(e.get("payload"), dict):
            ia = e["payload"].get("ia_indicada")
        if not ia:
            continue
        contagem_por_ia[ia] += 1

    ia_mais_utilizada = None
    if contagem_por_ia:
        ia_mais_utilizada = contagem_por_ia.most_common(1)[0][0]

    # Classifica o nível de consumo
    if total_chamadas <= 10:
        nivel = "baixo"
    elif total_chamadas <= 40:
        nivel = "moderado"
    else:
        nivel = "alto"

    return {
        "usuario_id": usuario_id,
        "total_chamadas": total_chamadas,
        "kwh_estimado": kwh_estimado,
        "co2_estimado_kg": co2_estimado_kg,
        "ia_mais_utilizada": ia_mais_utilizada,
        "nivel_consumo": nivel,
    }
