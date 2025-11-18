from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Literal

# ---- Mentor ----

class MentorRequest(BaseModel):
    descricao: str
    contexto: Optional[str] = None

class MentorResponse(BaseModel):
    ia_indicada: str
    quando_usar: str
    quando_evitar: str
    passos_humano: List[str]
    passos_com_ia: List[str]
    dificuldade: Literal["baixa", "media", "alta"]
    tempo_estimado_min: int

# ---- Telemetria / IoB ----

class TelemetriaEvent(BaseModel):
    usuario_id: str
    evento: str
    categoria: Optional[str] = None          # texto, edicao_video, design...
    ia_indicada: Optional[str] = None
    sucesso: Optional[bool] = None
    duracao_seg: Optional[int] = None
    contexto: Dict = {}                      # device, plataforma, etc.

# ---- Perfil de Usuário ----

class UserProfile(BaseModel):
    id: str
    nome: Optional[str] = None
    nivel: Literal["iniciante", "intermediario", "avancado"] = "iniciante"
    objetivos: List[str] = []                # ex: ["produtividade","estudo"]
    preferencias: List[str] = []             # ex: ["texto","video","eco"]
    historico_ias: List[str] = []           # ids de IAs usadas/sugeridas

# ---- IoT lógico ----

class Device(BaseModel):
    id: str
    tipo: str                                # smartphone, desktop, totem...
    local: Optional[str] = None              # lab_fiap, casa, coworking...
    capacidade: Optional[str] = None         # baixa, media, alta

class IotEvent(BaseModel):
    device_id: str
    usuario_id: Optional[str] = None
    evento: str                              # inicio_sessao, fim_sessao, etc.
    metadata: Dict = {}
