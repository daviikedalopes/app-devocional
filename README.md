# App Devocional

App para incentivar o tempo diário com Deus: cronômetro de leitura e oração, constância, metas, checklist da Bíblia, anotações, amigos e grupos. O foco é constância e encorajamento, sem competição: não há rankings nem medalhas.

## Estrutura

```
app-devocional/
├── api/                 # Node.js + Express 5 + Prisma (PostgreSQL)
│   ├── prisma/          # schema.prisma e migrations
│   ├── src/
│   │   ├── config/      # variáveis de ambiente (validadas com Zod)
│   │   ├── modules/     # um módulo por domínio: *.routes / *.service / *.schema
│   │   └── shared/      # banco, erros, autenticação, dados da Bíblia, datas
│   └── test/            # Vitest + Supertest
├── app/                 # Expo (React Native) em JavaScript + Expo Router
│   └── src/
│       ├── app/         # telas: (auth)/login, cadastro · (tabs)/Hoje, Leitura, Grupos, Perfil
│       ├── api/         # cliente HTTP com renovação automática do token
│       ├── store/       # sessão (Zustand + SecureStore)
│       └── components/
└── docker-compose.yml   # PostgreSQL de desenvolvimento (porta 5433)
```

## Como rodar

Pré-requisitos: Node.js 22 ou mais recente, Docker Desktop e o app **Expo Go** no celular.

### 1. Banco de dados

```bash
docker compose up -d
```

### 2. API

```bash
cd api
npm install
cp .env.example .env        # depois troque o JWT_SECRET
npx prisma migrate dev
npm run dev                 # http://localhost:3333
```

Testes: `npm test`

### 3. App

```bash
cd app
npm install
cp .env.example .env        # no celular, use o IP da máquina em EXPO_PUBLIC_API_URL
npx expo start
```

Escaneie o QR code com o Expo Go. Para instalar dependências no app, use sempre `npx expo install <pacote>`.

## Endpoints disponíveis

| Método | Rota | Descrição |
|---|---|---|
| GET | `/health` | Status da API |
| POST | `/auth/cadastro` | Cria conta (idade mínima de 13 anos) e retorna os tokens |
| POST | `/auth/login` | Login com e-mail e senha |
| POST | `/auth/refresh` | Troca o refresh token por um novo par (rotação) |
| POST | `/auth/logout` | Revoga o refresh token |
| GET/PATCH | `/usuarios/me` | Perfil do usuário logado |
| GET | `/leitura/livros` | Os 66 livros da Bíblia (público) |
| GET | `/leitura/progresso` | Progresso do checklist de leitura |
| POST/DELETE | `/leitura/capitulos` | Marca/desmarca capítulos manualmente (`{ livro, capitulos }`) |
| POST | `/devocionais` | Registra um devocional (tempo de leitura/oração e passagens; marca o checklist) |
| GET | `/devocionais` | Lista os devocionais do usuário (paginação por `cursor` e `limite`) |
| GET | `/devocionais/hoje` | Resumo do dia no fuso do usuário |
| GET/DELETE | `/devocionais/:id` | Detalhe / remoção (os capítulos continuam no checklist) |

Regras do devocional: até 4 h por registro, data não pode estar no futuro e o registro retroativo vale para os últimos 7 dias. O "dia" do devocional é calculado no fuso horário do usuário.

## Próximos passos (roteiro)

1. ~~**Devocional**: cronômetro de leitura e oração, registro manual e passagens que marcam o checklist automaticamente.~~ ✓
2. **Anotações** e diário.
3. **Constância** (streak com dia de graça, calculado no fuso do usuário) e **metas** pessoais.
4. **Amigos e feed**: seguir, Amém, comentários e pedidos de oração.
5. **Grupos**: presença do dia, leitura em conjunto e metas de grupo.
6. **Notificações** (Expo Push), moderação, confirmação de e-mail e login com Google e Apple.
