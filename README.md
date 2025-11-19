# 🤖📱 GS – Disruptive Architectures: IoT, IoB & Generative IA

## 📌 Visão Geral

Este projeto integra **backend em FastAPI**, **MongoDB**, **IA generativa (Gemini / OpenAI)** e um **aplicativo mobile em React Native** para ajudar estudantes a:

- escolher a melhor IA para cada tarefa;
- entender o impacto ecológico do uso de IA;
- receber planos de estudo, explicações e refinamentos de texto;
- analisar o **ambiente de estudo** com **visão computacional**;
- visualizar **Insights de comportamento (IoB)** e sustentabilidade.

O projeto foi desenvolvido para a Global Solution das disciplinas:

- **Disruptive Architectures: IoT, IoB & Generative IA**
- **Banco de Dados (MongoDB)**
- **DevOps / Backend**
- **Mobile Development (React Native + Expo)**

---

## 🧩 Arquitetura (Resumo)

### 🔙 Backend (FastAPI + Gemini + MongoDB)

O backend oferece:

- **Mentor de IA**:
  - `POST /mentor/explicar-tarefa`
  - `POST /mentor/plano-estudo`
  - `POST /mentor/refinar-resultado`
  - `GET /mentor/resumo-uso-ia`

- **Sustentabilidade / Eco IA**:
  - `GET /ias/eco-ranking`
  - `GET /eco/simular-impacto`

- **Telemetria + IoB**:
  - `POST /events/telemetria`
  - `GET /events/telemetria`

- **Analytics / Insights**:
  - `GET /analytics/ias-mais-usadas`
  - `GET /analytics/uso-por-categoria`
  - `GET /analytics/eco/consumo-usuario/{usuario_id}`

- **Visão Computacional (Ambiente de Estudo)**:
  - `POST /visao/ambiente-trabalho`

---

## 📱 Mobile (React Native + Expo)

O app mobile utiliza:

- Navegação com Bottom Tabs
- Telas de:
  - **Home**
  - **Explore**
  - **Mentor IA**
  - **Ambiente / Visão**
  - **Insights**
  - **Profile**

As funcionalidades incluem:

- Upload de imagem para análise via visão computacional
- Uso de serviços REST estruturados
- Atualização de Insights com botão de refresh
- Consumo ecológico estimado
- Ranking das IAs mais usadas
- Recomendações personalizadas de uso de IA

---

## 🛢 Banco de Dados (MongoDB)

O backend armazena:

- Telemetria de uso (IoB)
- Eventos de mentor/visão
- Dados para Insights
- Contexto lógico dos dispositivos

Demonstra conceitos de **NoSQL**, **modelagem não relacional**, **event sourcing** e **IoB**.

---

## ⚙️ Como Rodar o Projeto

### 1️⃣ Backend – FastAPI + Mongo

```bash
python -m venv .venv
source .venv/bin/activate          # Linux/Mac
.venv\Scripts\Activate.ps1        # Windows

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Testar:

- http://127.0.0.1:8000/docs
- http://127.0.0.1:8000/health

### 2️⃣ Mobile – React Native + Expo

```bash
npm install
npx expo start --web
```

Configurar `.env`:

```
EXPO_PUBLIC_API_URL=http://127.0.0.1:8000
```

---

## 🧪 Como Testar

### 🔍 Mentor IA
Use a aba **Mentor** no app e teste:
- Explicar tarefa
- Plano de estudo
- Refinar resultado

### 🌱 Sustentabilidade
Testar via navegador:
```
GET /ias/eco-ranking
GET /eco/simular-impacto?ia_id=chatgpt&usos=10
```

### 🧠 Insights (IoB + Eco)
Após usar Mentor e Visão:
- abra a aba Insights
- clique em **⟳ Atualizar**

### 📸 Visão Computacional
Na aba Ambiente / Visão:
- envie uma imagem da mesa de estudo
- receba sugestões e análise de ergonomia/iluminação

---

## 👥 Integrantes

- Caroline Assis Silva — RM557596  
- Enzo Moura Silva — RM556532  
- Luis Henrique Gosme Cardoso — RM558883

---

## 🎥 Vídeo da Apresentação

👉 **YouTube:** https://youtu.be/SEU_VIDEO_AQUI

---

## ✅ Conclusão

Este projeto integra:

- **IA Generativa**
- **IoB**
- **Visão Computacional**
- **Analytics**
- **Mobile**
- **Backend FastAPI**
- **MongoDB**

Uma solução completa que demonstra todas as competências solicitadas na Global Solution.
