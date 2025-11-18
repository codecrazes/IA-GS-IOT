# app/telemetry.py
import os
from datetime import datetime
from typing import Any, Dict, List, Optional

# Tenta usar MongoDB, mas não obriga
try:
    from pymongo import MongoClient  # type: ignore
except ImportError:
    MongoClient = None  # type: ignore

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
MONGO_DB = os.getenv("MONGO_DB", "gs_disruptive")

_client: Optional["MongoClient"] = None
telemetria_col = None

if MongoClient is not None:
    try:
        _client = MongoClient(MONGO_URL)
        db = _client[MONGO_DB]
        telemetria_col = db["telemetria"]
        print("DEBUG_TELEMETRIA: usando MongoDB para telemetria")
    except Exception as e:
        print("DEBUG_TELEMETRIA: falha ao conectar no Mongo, usando memória:", repr(e))
        telemetria_col = None
else:
    print("DEBUG_TELEMETRIA: pymongo não instalado, usando memória")

# Fallback em memória (para rodar mesmo sem Mongo)
_EVENTS_MEM: List[Dict[str, Any]] = []


def save_event(
    usuario_id: str,
    evento: str,
    payload: Dict[str, Any] | None = None,
    categoria: str | None = None,
    ia_indicada: str | None = None,
    sucesso: bool | None = None,
    duracao_seg: float | None = None,
    contexto: Dict[str, Any] | None = None,
) -> Dict[str, Any]:
    """
    Salva um evento de telemetria.
    - Se Mongo estiver disponível, grava lá.
    - Sempre guarda em memória também (_EVENTS_MEM) para consultas rápidas.
    """
    doc: Dict[str, Any] = {
        "usuario_id": usuario_id or "anon",
        "evento": evento,
        "payload": payload or {},
        "categoria": categoria,
        "ia_indicada": ia_indicada,
        "sucesso": sucesso,
        "duracao_seg": duracao_seg,
        "contexto": contexto or {},
        "timestamp": datetime.utcnow(),
    }

    # Salva em memória
    _EVENTS_MEM.append(doc)

    # Salva no Mongo se tiver disponível
    if telemetria_col is not None:
        try:
            res = telemetria_col.insert_one(doc)
            doc["_id"] = str(res.inserted_id)
        except Exception as e:
            # Não derruba a API se o Mongo falhar
            print("DEBUG_TELEMETRIA: erro ao salvar no Mongo:", repr(e))

    return {"status": "ok"}


def list_events(limit: int = 1000) -> List[Dict[str, Any]]:
    """
    Lista eventos de telemetria.
    - Se Mongo estiver disponível, lê de lá (até 'limit' docs, mais recentes).
    - Senão, retorna o que está em memória.
    """
    if telemetria_col is not None:
        try:
            cursor = (
                telemetria_col.find({}, {"_id": 0})
                .sort("timestamp", -1)
                .limit(limit)
            )
            return list(cursor)
        except Exception as e:
            print("DEBUG_TELEMETRIA: erro ao ler do Mongo, usando memória:", repr(e))

    # fallback: em memória
    return _EVENTS_MEM[-limit:]
