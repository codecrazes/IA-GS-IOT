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

## 🧱 Estrutura de Pastas do Projeto

```text
/
├─ ia_iot_gs/           # Backend FastAPI + Gemini + MongoDB
│  └─ app/              # Código principal da API
│
└─ mobile/              # App React Native + Expo
```

> ⚠️ **IMPORTANTE:** Sempre rode os comandos dentro da pasta correta:
>
> - Backend → `cd ia_iot_gs`
> - Mobile → `cd mobile`

---

## 🧩 Arquitetura (Resumo)

### 🔙 Backend (FastAPI + Gemini + MongoDB)

O backend expõe endpoints REST que são consumidos pelo app mobile:

- **Mentor de IA**:
  - `POST /mentor/explicar-tarefa`  
    → indica qual IA usar, quando usar/evitar, passos humanos e com IA.
  - `POST /mentor/plano-estudo`  
    → gera plano de estudo a partir de um objetivo e horas/semana.
  - `POST /mentor/refinar-resultado`  
    → refina um texto (tom, tamanho, tipo: LinkedIn, roteiro, etc.).
  - `GET /mentor/resumo-uso-ia?usuario_id=...`  
    → gera um **resumo do uso de IA** (Insights) baseado na telemetria.

- **Sustentabilidade / Eco IA**:
  - `GET /ias/eco-ranking`  
    → ranking de IAs com **eco_score** (mais ou menos sustentáveis).
  - `GET /eco/simular-impacto?ia_id=...&usos=10`  
    → estima kWh e CO₂ de X chamadas à IA.

- **Telemetria + IoB (Internet of Behaviors)**:
  - `POST /events/telemetria`  
    → registra eventos de uso (mentor, visão, categorias, sucesso, tempo).
  - `GET /events/telemetria`  
    → consulta eventos (debug).

- **Analytics / Insights (usado pelo app)**:
  - `GET /analytics/ias-mais-usadas`  
    → lista das IAs mais usadas + eco_score.
  - `GET /analytics/uso-por-categoria`  
    → uso agrupado por categoria (texto, vídeo, dados, etc.).
  - `GET /analytics/eco/consumo-usuario/{usuario_id}`  
    → total de chamadas, kWh e CO₂ estimados, nível de consumo (baixo, moderado, alto).

- **Visão Computacional (Ambiente de Estudo)**:
  - `POST /visao/ambiente-trabalho`  
    → analisa a foto do ambiente (iluminação, postura, distrações) e devolve:
      - pontos de melhoria;
      - riscos ergonômicos;
      - sugestões da IA para estudar melhor.

- **Usuários / Recomendações**:
  - `POST /usuarios` / `GET /usuarios/{id}`  
    → CRUD básico de perfil de usuário.
  - `GET /ias/recomendadas?usuario_id=...`  
    → recomenda IAs com base no histórico e perfil.

---

### 📱 Mobile (React Native + Expo)

O app mobile (pasta `mobile/`) integra com o backend e apresenta as principais features:

- **Autenticação simples** (login/cadastro de usuário).
- **Bottom Tabs** com as telas:
  - `Home` – saudação, acesso rápido às funções.
  - `Explore` – lista de IAs com eco_score e categorias.
  - `Mentor IA` – tela dedicada com:
    - Explicar tarefa;
    - Plano de estudo;
    - Refinar resultado.
  - `Ambiente / Visão` – upload de imagem do ambiente de estudo e retorno da análise.
  - `Insights` – mostra:
    - resumo personalizado de uso de IA;
    - impacto ecológico estimado (kWh, CO₂, nível de consumo);
    - ranking das IAs mais usadas pelo usuário;
    - botão **⟳ Atualizar** para recarregar dados.
  - `Profile` – dados do usuário e contexto (IoB lógico).

O app segue uma arquitetura com:

- `view/` – telas (Home, Explore, Mentor, Vision, Insights, Profile, etc.)
- `service/` – serviços para chamar o backend (`mentorService`, `analyticsService`, `visionService`…)
- `fetcher/` – camada de HTTP (axios) com baseURL e headers.
- `context/` – `AuthContext` para guardar token/email.
- `theme/` – tema (dark/light), cores, tipografia.

---

### 🛢 Banco de Dados (MongoDB)

O backend usa **MongoDB** para:

- salvar **telemetria** de uso (`telemetria`):
  - usuário, evento, IA indicada, categoria, contexto, duração;
- servir de base para:
  - analytics de uso (`ias_mais_usadas`, `uso_por_categoria`);
  - consumo ecológico estimado (`consumo_eco_estimado_por_usuario`);
  - resumo de uso de IA (mentor/Insights).

Isso demonstra os conceitos de **NoSQL**, **eventos comportamentais** e **IoB (Internet of Behaviors)**.

---

## ✅ Pré-requisitos para Rodar o Projeto

### 🔧 Ambiente Geral

- **Python** 3.11+
- **Node.js** 18+ (com `npm` ou `yarn`)
- **MongoDB** rodando localmente ou em Atlas (URI configurada no `.env` do backend)
- **Git** (opcional, para clonar o repositório)

---

## ⚙️ Backend – Como Rodar (FastAPI + Mongo + Gemini)

> 🎯 **Sempre rodar os comandos dentro da pasta do backend:**  
> `cd ia_iot_gs`

### 1️⃣ Criar e ativar o ambiente virtual

**Windows (PowerShell):**

```powershell
cd ia_iot_gs
python -m venv .venv
.venv\Scripts\Activate.ps1
```

**Linux/macOS:**

```bash
cd ia_iot_gs
python -m venv .venv
source .venv/bin/activate
```

### 2️⃣ Instalar dependências 
```bash
pip install fastapi "uvicorn[standard]" python-multipart pymongo python-dotenv google-generativeai pillow
```

> Se você também quiser suporte a OpenAI, instale:  
> `pip install openai`

### 3️⃣ Arquivo `.env` do backend

O repositório já inclui um arquivo `.env` **pré-configurado** para uso local.  
Verifique o conteúdo (exemplo):

```env
LLM_PROVIDER=gemini
GEMINI_API_KEY=SUA_CHAVE_AQUI

MONGO_URL=mongodb://localhost:27017
MONGO_DB=gs_disruptive
```

> Para o avaliador da GS: o projeto já pode ser entregue com os `.env` ajustados para ambiente local.  
> Se for necessário trocar de máquina, basta ajustar **apenas** a chave da IA e, se preciso, a URL do Mongo.

### 4️⃣ Subir o backend

Com o ambiente virtual ativado e o `.env` configurado:

```bash
uvicorn app.main:app --reload --port 8000
```

Testes rápidos:

- Documentação Swagger:  
  👉 `http://127.0.0.1:8000/docs`
- Health check:  
  👉 `http://127.0.0.1:8000/health`

Se tudo estiver ok, o mobile já consegue consumir a API.

---

## 📱 Mobile – Como Rodar (React Native + Expo)

> 🎯 **Sempre rodar os comandos dentro da pasta do mobile:**  
> `cd mobile`

### 1️⃣ Instalar dependências

```bash
cd mobile
npm install
# ou
yarn
```

### 2️⃣ Arquivo `.env` do mobile

O repositório já inclui um `.env` **pronto para ambiente local**, por exemplo:

```env
EXPO_PUBLIC_API_URL=http://127.0.0.1:8000
```

> Ou seja: se o backend estiver rodando em `http://127.0.0.1:8000`, o app já vai se conectar certinho.

### 3️⃣ Rodar o app (modo web)

```bash
npx expo start --web
```

- Abra o link que o Expo mostrar no terminal (geralmente `http://localhost:19006`).
- Faça login/cadastro.
- Navegue pelas abas:
  - **Mentor IA**
  - **Ambiente / Visão**
  - **Insights**
  - **Explore**
  - **Profile**

---

## 🧪 Como Testar as Funcionalidades

### 🔍 1. Mentor IA

No app (aba **Mentor IA**):

1. Use **Explicar tarefa**:
   - Exemplo:  
     > "Preciso preparar um resumo de um artigo para apresentação em sala."
2. Envie e verifique:
   - IA indicada;
   - Quando usar / evitar;
   - Passos humanos;
   - Passos com IA.

Também teste:

- **Plano de estudo** – objetivo + horas/semana.
- **Refinar resultado** – colar um texto e pedir melhoria.

Isso gera eventos de telemetria (`mentor_resposta`) que serão usados no Insights.

---

### 🌱 2. Sustentabilidade (Eco IA)

Pelo navegador (Swagger em `/docs`) ou um cliente REST:

- `GET /ias/eco-ranking`  
  → ver lista das IAs com eco_score.
- `GET /eco/simular-impacto?ia_id=chatgpt&usos=20`  
  → ver estimativa de kWh e CO₂.

---

### 🧠 3. Insights (IoB + Eco)

No app (aba **Insights**):

1. Use o Mentor e a Visão algumas vezes (para gerar telemetria).
2. Entre em **Insights**.
3. Clique em **“⟳ Atualizar”** no topo da tela.
4. Verifique:
   - **Resumo do seu uso de IA** (texto amigável);
   - **Impacto ecológico estimado** (total de chamadas, kWh, CO₂, nível);
   - **IAs que você mais usa** (ranking).

Esses dados vêm dos endpoints:

- `GET /analytics/eco/consumo-usuario/{usuario_id}`
- `GET /analytics/ias-mais-usadas`
- `GET /mentor/resumo-uso-ia?usuario_id=...`

---

### 📸 4. Visão Computacional do Ambiente

Na aba **Ambiente / Visão**:

1. Selecione uma foto do seu ambiente de estudo (mesa, cadeira, notebook etc.).
2. Envie para análise.
3. Veja o retorno da API:
   - Pontos positivos do ambiente;
   - Problemas detectados (iluminação, ergonomia, distrações);
   - Recomendações práticas de melhoria.

Endpoint usado:

- `POST /visao/ambiente-trabalho`

---

## 🎓 Integração entre as Disciplinas

- **Disruptive Architectures: IoT, IoB & Generative IA**  
  - IoB: telemetria de uso, analytics, Insights personalizados.  
  - IA generativa: Mentor IA (explicar tarefa, plano, refino), resumo de uso.  
  - IoT lógico: devices, eventos, contexto do usuário.

- **Banco de Dados (MongoDB)**  
  - Coleta de telemetria em collections dedicadas.  
  - Cálculos de ranking, eco e consumo por usuário.

- **DevOps / Backend**  
  - Backend em FastAPI, organizado em módulos (`mentor`, `analytics`, `iot`, `vision`, `users`, `telemetry`).  
  - Configuração via `.env`, conexão com Mongo, logs de debug.

- **Mobile (React Native + Expo)**  
  - Navegação com Bottom Tabs.  
  - Integração com API REST.  
  - Telas específicas para Mentor, Visão, Insights, Explore e Profile.

---

## 👥 Integrantes

- **Caroline Assis Silva** — RM557596  
- **Enzo Moura Silva** — RM556532  
- **Luis Henrique Gosme Cardoso** — RM558883  

> Atualizar com os nomes/RMs corretos do grupo.

---

## 🎥 Vídeo da Apresentação

- **YouTube**: [Link da apresentação](https://youtu.be/U2O34N6PSeQ)

> Substituir pelo link real do vídeo da GS.

---

## ✅ Conclusão

Este projeto demonstra, de ponta a ponta:

- Uso de **IA generativa** para apoiar estudos e produtividade;
- **IoB** através de telemetria e Insights personalizados;
- Preocupação com **sustentabilidade**, medindo impacto ecológico do uso de IA;
- **Visão computacional** aplicada ao ambiente de estudo;
- Integração real entre **backend FastAPI + MongoDB + Mobile React Native**.

Tudo isso alinhado com os objetivos da disciplina de **Disruptive Architectures: IoT, IoB & Generative IA**.
