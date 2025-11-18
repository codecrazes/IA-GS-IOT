from fastapi import FastAPI, Query, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from dotenv import load_dotenv
import os

from .models import MentorRequest, MentorResponse, TelemetriaEvent, UserProfile, Device, IotEvent
from .eco import eco_ranking, simular_impacto
from .mentor import explain_task, gerar_resumo_uso_ia, gerar_plano_estudo, refinar_resultado
from .store import IAS
from .telemetry import save_event, list_events
from .analytics import ias_mais_usadas, uso_por_categoria, consumo_eco_estimado_por_usuario
from .users import upsert_user, get_user, recomendar_ias_para_usuario
from .iot import upsert_device, list_devices, save_iot_event, current_context_for_user
from .vision import analisar_ambiente_trabalho


load_dotenv()

print("DEBUG_GEMINI_KEY_PRESENT:", bool(os.getenv("GEMINI_API_KEY")))


app = FastAPI(title="GS – Disruptive Architectures API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

@app.get("/health")
def health(): return {"status":"ok"}

@app.post("/tarefas/analisar")
def tarefas_analisar(payload: dict):
    texto = (payload.get("descricao") or "").lower()
    cat = "geral"
    if any(k in texto for k in ["tiktok","reels","vídeo","video"]): cat = "edicao_video"
    elif any(k in texto for k in ["post","artigo","texto","redação"]): cat = "texto"
    elif any(k in texto for k in ["design","imagem","banner"]): cat = "design"
    elif any(k in texto for k in ["dados","planilha","analise","análise"]): cat = "analise_dados"
    return {"categoria": cat}

@app.post("/mentor/explicar-tarefa", response_model=MentorResponse)
def mentor(req: MentorRequest):
    data = explain_task(req.descricao, req.contexto)
    save_event(usuario_id="anon", evento="mentor_resposta", payload=data)
    return data

@app.get("/ias/eco-ranking")
def eco():
    return {"eco_ranking": eco_ranking()}

@app.get("/eco/simular-impacto")
def eco_sim(ia_id: str = Query(...), usos: int = Query(10, ge=1)):
    if ia_id not in IAS: return {"erro":"ia_id inválido"}
    return simular_impacto(ia_id, usos)

@app.post("/events/telemetria")
def telemetria(evt: TelemetriaEvent):
    return save_event(
        usuario_id=evt.usuario_id,
        evento=evt.evento,
        payload={},  # se quiser, pode carregar mais tarde
        categoria=evt.categoria,
        ia_indicada=evt.ia_indicada,
        sucesso=evt.sucesso,
        duracao_seg=evt.duracao_seg,
        contexto=evt.contexto,
    )

@app.get("/events/telemetria")
def listar_telemetria():
    return {"eventos": list_events()}


@app.get("/debug/llm")
def debug_llm():
    from os import getenv
    return {
        "LLM_PROVIDER": getenv("LLM_PROVIDER"),
        "OPENAI_MODEL": getenv("OPENAI_MODEL"),
        "HAS_API_KEY": bool(getenv("OPENAI_API_KEY"))
    }

@app.get("/analytics/ias-mais-usadas")
def analytics_ias_mais_usadas(top: int = 5):
    return {"top": ias_mais_usadas(top_n=top)}


@app.get("/analytics/uso-por-categoria")
def analytics_uso_por_categoria():
    return {"categorias": uso_por_categoria()}


@app.get("/analytics/eco/consumo-usuario/{usuario_id}")
def analytics_consumo_usuario(usuario_id: str):
    return consumo_eco_estimado_por_usuario(usuario_id)


@app.post("/usuarios", response_model=UserProfile)
def criar_atualizar_usuario(profile: UserProfile):
    return upsert_user(profile)


@app.get("/usuarios/{user_id}", response_model=UserProfile | None)
def obter_usuario(user_id: str):
    return get_user(user_id)


@app.get("/ias/recomendadas")
def ias_recomendadas(usuario_id: str):
    return recomendar_ias_para_usuario(usuario_id)


@app.post("/iot/devices", response_model=Device)
def criar_atualizar_device(device: Device):
    return upsert_device(device)


@app.get("/iot/devices")
def listar_devices():
    return {"devices": list_devices()}


@app.post("/iot/events")
def registrar_iot_event(evt: IotEvent):
    return save_iot_event(evt)


@app.get("/contexto/atual")
def contexto_atual(usuario_id: str):
    return current_context_for_user(usuario_id)

@app.get("/mentor/resumo-uso-ia")
def mentor_resumo_uso_ia(usuario_id: str = "anon"):
    """
    Usa Gemini + analytics para gerar um texto amigável
    explicando como o usuário está usando IA e sugerindo melhorias.
    """
    resumo = gerar_resumo_uso_ia(usuario_id)
    return {"usuario_id": usuario_id, "resumo": resumo}

from pydantic import BaseModel

class PlanoEstudoRequest(BaseModel):
    objetivo: str
    horas_semana: int = 4

@app.post("/mentor/plano-estudo")
def mentor_plano_estudo(req: PlanoEstudoRequest):
    plano = gerar_plano_estudo(req.objetivo, req.horas_semana)
    return plano

class RefinarTextoRequest(BaseModel):
    tipo: str                 # ex.: "post_linkedin", "roteiro_video"
    texto_inicial: str
    tom: str = "profissional" # ex.: "profissional", "informal", "didático"
    tamanho: str = "medio"    # ex.: "curto", "medio", "longo"

@app.post("/mentor/refinar-resultado")
def mentor_refinar_resultado(req: RefinarTextoRequest):
    data = refinar_resultado(
        tipo=req.tipo,
        texto_inicial=req.texto_inicial,
        tom=req.tom,
        tamanho=req.tamanho
    )
    return data

@app.post("/visao/ambiente-trabalho")
async def visao_ambiente_trabalho(imagem: UploadFile):
    """
    Recebe uma foto do ambiente de trabalho/estudo e retorna
    um relatório ergonômico gerado via Gemini Vision.
    """
    return analisar_ambiente_trabalho(imagem)
