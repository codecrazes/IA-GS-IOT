# app/iot.py
from typing import Dict, List
from .models import Device, IotEvent

DEVICES: Dict[str, Device] = {}
IOT_EVENTS: List[Dict] = []


def upsert_device(device: Device) -> Device:
    DEVICES[device.id] = device
    return device


def list_devices() -> List[Device]:
    return list(DEVICES.values())


def save_iot_event(evt: IotEvent) -> Dict:
    data = evt.model_dump()
    IOT_EVENTS.append(data)
    return {"ok": True, "total_events": len(IOT_EVENTS)}


def current_context_for_user(usuario_id: str) -> Dict:
    """
    Contexto bem simples: último evento IoT + últimos eventos de telemetria.
    """
    from .telemetry import EVENTS

    last_iot = next((e for e in reversed(IOT_EVENTS) if e.get("usuario_id") == usuario_id), None)
    last_mentor = next((e for e in reversed(EVENTS) if e.get("usuario_id") == usuario_id), None)

    return {
        "usuario_id": usuario_id,
        "ultimo_iot": last_iot,
        "ultima_interacao_mentor": last_mentor,
    }
