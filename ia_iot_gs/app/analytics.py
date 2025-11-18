# app/analytics.py
from collections import Counter
from typing import Dict, List, Tuple, Optional
from .telemetry import EVENTS
from .store import IAS


def ias_mais_usadas(top_n: int = 5) -> List[Dict]:
    usos = [e.get("ia_indicada") for e in EVENTS if e.get("ia_indicada")]
    contagem = Counter(usos)
    resultado = []
    for ia_id, qtd in contagem.most_common(top_n):
        info = IAS.get(ia_id, {"id": ia_id, "nome": ia_id})
        resultado.append({
            "ia_id": ia_id,
            "nome": info.get("nome", ia_id),
            "usos": qtd,
        })
    return resultado


def uso_por_categoria() -> List[Dict]:
    cats = [e.get("categoria") for e in EVENTS if e.get("categoria")]
    contagem = Counter(cats)
    return [
        {"categoria": cat, "usos": qtd}
        for cat, qtd in contagem.most_common()
    ]


def consumo_eco_estimado_por_usuario(usuario_id: str) -> Dict:
    """
    Cálculo simplificado:
    cada evento de mentor conta como 1 "uso" da ia_indicada.
    consumo_wh = soma(consumo_wh_da_ia)
    """
    from .store import IAS

    eventos_user = [e for e in EVENTS if e.get("usuario_id") == usuario_id and e.get("ia_indicada")]
    usos_por_ia = Counter(e["ia_indicada"] for e in eventos_user if e.get("ia_indicada"))

    total_wh = 0.0
    detalhado = []
    for ia_id, qtd in usos_por_ia.items():
        ia = IAS.get(ia_id)
        if not ia:
            continue
        consumo = ia["consumo_wh"] * qtd
        total_wh += consumo
        detalhado.append({
            "ia_id": ia_id,
            "nome": ia["nome"],
            "usos": qtd,
            "consumo_wh": round(consumo, 2)
        })

    return {
        "usuario_id": usuario_id,
        "total_consumo_wh_estimado": round(total_wh, 2),
        "detalhado": detalhado
    }
