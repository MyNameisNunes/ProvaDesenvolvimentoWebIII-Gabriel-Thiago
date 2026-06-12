# 🍽️ Sistema de Reservas de Mesa

Backend completo para gestão de reservas de mesas de um restaurante, construído com
**TypeScript + Express + MongoDB (Mongoose)**, acompanhado de um **frontend** (servido
estaticamente) com mapa visual de mesas em tempo real e formulário de reservas.

O servidor roda em **`http://localhost:3000`** e o banco de dados é o **`reserva`** (MongoDB local).

---

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Stack](#-stack)
- [Pré-requisitos](#-pré-requisitos)
- [Como rodar (passo a passo)](#-como-rodar-passo-a-passo)
- [Regras de negócio](#-regras-de-negócio)
- [Documentação da API](#-documentação-da-api)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Scripts disponíveis](#-scripts-disponíveis)
- [Solução de problemas](#-solução-de-problemas)

---

## ✨ Funcionalidades

- **CRUD completo de reservas**: criar, listar (com filtros), atualizar e cancelar.
- **Cadastro de mesas** com número, capacidade e localização.
- **Mapa de mesas em tempo real**: estado de cada mesa (disponível / reservado / ocupado).
- **Validações de negócio** centralizadas no backend (capacidade, antecedência, conflito de horário).
- **Status automático por tempo**: a reserva passa de `reservado` → `ocupado` → `finalizado` conforme o relógio.
- **Mensagens claras** de erro e sucesso em todas as operações.
- **Logs** das operações de criação, atualização e cancelamento.
- **Frontend incluso** em `public/`, servido pelo próprio Express (mesma origem da API).

---

## 🛠 Stack

| Camada         | Tecnologia                           |
|----------------|--------------------------------------|
| Linguagem      | TypeScript                           |
| Servidor HTTP  | Express 5                            |
| Banco de dados | MongoDB                              |
| ODM            | Mongoose 9                           |
| Dev runtime    | ts-node-dev (hot reload)             |
| Frontend       | HTML + CSS + JavaScript (ES Modules) |

---

## ✅ Pré-requisitos

Antes de começar, garanta que tem instalado na máquina:

1. **[Node.js](https://nodejs.org/)** 18 ou superior (inclui o `npm`).
2. **MongoDB** rodando localmente na porta padrão **`27017`**. Há duas formas:
   - **Opção A — MongoDB Community Server** instalado nativamente ([download](https://www.mongodb.com/try/download/community)); ou
   - **Opção B — Docker**: `docker run -d -p 27017:27017 --name mongo mongo:7`

> ℹ️ O projeto conecta em `mongodb://localhost:27017/reserva` **sem usuário e senha**.
> O banco `reserva` é criado automaticamente na primeira execução.

---

## 🚀 Como rodar (passo a passo)

```bash
# 1. Clone o repositório
git clone https://github.com/MyNameisNunes/Avalia-oDSMIII.git
cd Avalia-oDSMIII

# 2. Instale as dependências
npm install

# 3. Garanta que o MongoDB está rodando (veja "Pré-requisitos")

# 4. Popule o banco com as 8 mesas iniciais (rode uma vez)
npm run seed

# 5. Suba o servidor (com hot reload)
npm run dev
```

Se tudo deu certo, o terminal exibirá:

```
[2026-...] Conectado ao MongoDB (banco: reserva)
Servidor rodando em http://localhost:3000
```

Abra **http://localhost:3000** no navegador para ver o frontend.
A API fica disponível sob **http://localhost:3000/api**.

> A raiz `/` serve o frontend. Acessar uma rota inexistente (ex.: `/foo`) retorna
> *"Cannot GET /foo"* — isso é esperado; os endpoints da API vivem sob `/api`.

---

## 📐 Regras de negócio

| Regra | Descrição |
|-------|-----------|
| **Duração padrão** | Toda reserva ocupa a mesa por **90 minutos (1h30)**. |
| **Antecedência mínima** | A reserva deve ser feita com pelo menos **1 hora** de antecedência. |
| **Conflito de horário** | Não pode haver duas reservas ativas para a mesma mesa cujas janelas de 90 min se sobreponham. |
| **Capacidade** | A quantidade de pessoas não pode exceder a capacidade da mesa. |
| **Cancelamento** | Cancelar **não apaga** o registro — apenas muda o `status` para `cancelado` (preserva o histórico). |
| **Status por tempo** | Calculado dinamicamente: `reservado` (futuro) → `ocupado` (em andamento) → `finalizado` (passado). |

---

## 📡 Documentação da API

Base: `http://localhost:3000/api`
Respostas de sucesso trazem `{ mensagem, ... }`; respostas de erro trazem `{ erro: "..." }`.

### Mesas

#### `GET /api/mesas`
Lista todas as mesas, ordenadas por número.

```bash
curl http://localhost:3000/api/mesas
```

#### `POST /api/mesas`
Cadastra uma nova mesa.

```bash
curl -X POST http://localhost:3000/api/mesas \
  -H "Content-Type: application/json" \
  -d '{ "numero": 9, "capacidade": 4, "localizacao": "varanda" }'
```

#### `GET /api/mesas/status`
Retorna o estado atual de cada mesa para o mapa visual (`disponivel`, `reservado` ou `ocupado`).

```bash
curl http://localhost:3000/api/mesas/status
```

### Reservas

#### `POST /api/reservas`
Cria uma reserva. Aplica **todas** as regras de negócio.

**Corpo:**

| Campo         | Tipo    | Obrigatório | Observação                |
|---------------|---------|:-----------:|---------------------------|
| `nomeCliente` | string  | ✅          |                           |
| `contato`     | string  | ✅          |                           |
| `numeroMesa`  | number  | ✅          | a mesa precisa existir    |
| `qtdPessoas`  | number  | ✅          | ≤ capacidade da mesa      |
| `dataHora`    | string  | ✅          | ISO 8601, ≥ agora + 1h    |
| `observacoes` | string  | ❌          |                           |

```bash
curl -X POST http://localhost:3000/api/reservas \
  -H "Content-Type: application/json" \
  -d '{
    "nomeCliente": "Maria Silva",
    "contato": "(11) 99999-0000",
    "numeroMesa": 3,
    "qtdPessoas": 4,
    "dataHora": "2026-06-13T20:00:00.000Z",
    "observacoes": "Aniversário"
  }'
```

**Respostas possíveis:** `201` criada · `400` capacidade/antecedência/validação · `404` mesa inexistente · `409` conflito de horário.

#### `GET /api/reservas`
Lista reservas, com filtros opcionais por query string (combináveis).

| Filtro     | Exemplo                          |
|------------|----------------------------------|
| `cliente`  | `?cliente=maria` (busca parcial) |
| `mesa`     | `?mesa=3`                        |
| `status`   | `?status=reservado`              |
| `data`     | `?data=2026-06-13` (dia inteiro) |

```bash
curl "http://localhost:3000/api/reservas?status=reservado&mesa=3"
```

#### `PUT /api/reservas/:id`
Atualiza uma reserva. Revalida capacidade, antecedência e conflito caso a mesa ou o horário mudem.

```bash
curl -X PUT http://localhost:3000/api/reservas/<ID> \
  -H "Content-Type: application/json" \
  -d '{ "qtdPessoas": 2 }'
```

#### `DELETE /api/reservas/:id`
Cancela a reserva (muda o `status` para `cancelado`, não apaga o documento).

```bash
curl -X DELETE http://localhost:3000/api/reservas/<ID>
```

---

## 📁 Estrutura do projeto

```
Avalia-oDSMIII/
├── src/
│   ├── server.ts            # Ponto de entrada: Express + conexão MongoDB
│   ├── seed.ts              # Cadastro inicial das 8 mesas
│   ├── models/
│   │   ├── Mesa.ts          # Schema da mesa (número, capacidade, localização)
│   │   └── Reserva.ts       # Schema da reserva (cliente, mesa, status, ...)
│   ├── routes/
│   │   ├── mesas.ts         # GET / · POST / · GET /status
│   │   └── reservas.ts      # POST · GET · PUT · DELETE
│   └── utils/
│       └── status.ts        # Duração padrão + cálculo de status por tempo
├── public/                  # Frontend (servido como estático pelo Express)
│   ├── index.html           # Landing page
│   ├── mesas.html           # Mapa de mesas + reservas
│   ├── css/
│   └── js/
├── tsconfig.json
└── package.json
```

---

## 📜 Scripts disponíveis

| Comando         | O que faz                                                         |
|-----------------|-------------------------------------------------------------------|
| `npm run dev`   | Sobe o servidor em modo desenvolvimento com hot reload.           |
| `npm run seed`  | Popula o banco com as 8 mesas iniciais (recria a coleção `mesas`). |
| `npm run build` | Compila o TypeScript para `dist/`.                                |
| `npm start`     | Roda a versão compilada (`node dist/server.js`) — use após `build`.|

---

## 🧯 Solução de problemas

**`connect ECONNREFUSED 127.0.0.1:27017`**
O MongoDB não está rodando. Inicie o serviço do MongoDB ou suba via Docker
(`docker run -d -p 27017:27017 --name mongo mongo:7`).

**`MongoServerError: Command ... requires authentication`**
Seu MongoDB foi instalado com autenticação habilitada, mas o projeto conecta sem credenciais.
Desabilite a autenticação na config do MongoDB (`security: authorization: disabled` no
`mongod.cfg` e reinicie o serviço) **ou** suba o banco via Docker (que vem sem auth por padrão).

**`Error: listen EADDRINUSE: address already in use :::3000`**
A porta 3000 já está ocupada por outro processo. Encerre o que estiver usando a porta
(ex.: outro servidor ou container Docker) e suba novamente.

**Frontend não mostra dados**
Confirme que rodou `npm run seed` e que o servidor está conectado ao MongoDB.
