# app/telemetry.py
from datetime import datetime
from typing import Dict, List, Optional
from .models import TelemetriaEvent

EVENTS: List[Dict] = []


def save_event(
    usuario_id: str,
    evento: str,
    payload: Dict,
    categoria: Optional[str] = None,
    ia_indicada: Optional[str] = None,
    sucesso: Optional[bool] = None,
    duracao_seg: Optional[int] = None,
    contexto: Optional[Dict] = None,
) -> Dict:
    data = TelemetriaEvent(
        usuario_id=usuario_id,
        evento=evento,
        categoria=categoria,
        ia_indicada=ia_indicada,
        sucesso=sucesso,
        duracao_seg=duracao_seg,
        contexto=contexto or {},
    ).model_dump()
    data["ts"] = datetime.utcnow().isoformat() + "Z"

    EVENTS.append(data)
    return {"ok": True, "event_id": str(len(EVENTS))}


def list_events() -> List[Dict]:
    return EVENTS
