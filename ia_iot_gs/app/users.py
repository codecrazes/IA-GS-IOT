# app/users.py
from typing import Dict, Optional
from .models import UserProfile

USERS: Dict[str, UserProfile] = {}


def upsert_user(profile: UserProfile) -> UserProfile:
    USERS[profile.id] = profile
    return profile


def get_user(user_id: str) -> Optional[UserProfile]:
    return USERS.get(user_id)


def recomendar_ias_para_usuario(user_id: str):
    """
    Lógica bem simples: usar objetivos e preferencias para priorizar IAs.
    Depois você pode deixar isso mais inteligente.
    """
    from .store import IAS

    profile = USERS.get(user_id)
    if not profile:
        # fallback: ordena por eco_score
        ias = sorted(IAS.values(), key=lambda x: x["eco_score"], reverse=True)
        return {"usuario_id": user_id, "recomendacoes": ias[:5]}

    # Exemplo: se usuário gosta de "eco", ordenar por eco_score
    ias = list(IAS.values())
    if "eco" in profile.preferencias:
        ias = sorted(ias, key=lambda x: (x["eco_score"], -x["consumo_wh"]), reverse=True)
    else:
        # padrão: ordenar por velocidade
        ias = sorted(ias, key=lambda x: x["velocidade"], reverse=True)

    # Aqui dá pra filtrar por objetivos/preferencias, mas vamos manter simples
    return {
        "usuario_id": user_id,
        "nivel": profile.nivel,
        "objetivos": profile.objetivos,
        "recomendacoes": ias[:5]
    }
