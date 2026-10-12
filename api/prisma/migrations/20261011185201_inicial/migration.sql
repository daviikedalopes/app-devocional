-- CreateEnum
CREATE TYPE "Papel" AS ENUM ('USUARIO', 'ADMIN');

-- CreateEnum
CREATE TYPE "TipoMeta" AS ENUM ('DIAS_SEMANA', 'MINUTOS_DIA', 'LEITURA_ATE_DATA');

-- CreateEnum
CREATE TYPE "StatusSeguidor" AS ENUM ('PENDENTE', 'ACEITO');

-- CreateEnum
CREATE TYPE "PapelGrupo" AS ENUM ('LIDER', 'MEMBRO');

-- CreateEnum
CREATE TYPE "AlvoDenuncia" AS ENUM ('USUARIO', 'DEVOCIONAL', 'ANOTACAO', 'COMENTARIO', 'PEDIDO_ORACAO', 'GRUPO');

-- CreateEnum
CREATE TYPE "StatusDenuncia" AS ENUM ('ABERTA', 'RESOLVIDA', 'DESCARTADA');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT,
    "googleId" TEXT,
    "appleId" TEXT,
    "emailConfirmadoEm" TIMESTAMP(3),
    "dataNascimento" DATE NOT NULL,
    "fotoUrl" TEXT,
    "bio" TEXT,
    "igreja" TEXT,
    "perfilPrivado" BOOLEAN NOT NULL DEFAULT true,
    "timezone" TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
    "horarioLembrete" TEXT,
    "notificacoes" JSONB,
    "papel" "Papel" NOT NULL DEFAULT 'USUARIO',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiraEm" TIMESTAMP(3) NOT NULL,
    "revogadoEm" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devocionais" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "iniciadoEm" TIMESTAMP(3) NOT NULL,
    "dia" DATE NOT NULL,
    "duracaoLeituraSeg" INTEGER NOT NULL DEFAULT 0,
    "duracaoOracaoSeg" INTEGER NOT NULL DEFAULT 0,
    "manual" BOOLEAN NOT NULL DEFAULT false,
    "visivelAmigos" BOOLEAN NOT NULL DEFAULT false,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "devocionais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devocional_passagens" (
    "id" TEXT NOT NULL,
    "devocionalId" TEXT NOT NULL,
    "livro" TEXT NOT NULL,
    "capituloInicio" INTEGER NOT NULL,
    "capituloFim" INTEGER NOT NULL,
    "versiculoInicio" INTEGER,
    "versiculoFim" INTEGER,

    CONSTRAINT "devocional_passagens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capitulos_lidos" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "livro" TEXT NOT NULL,
    "capitulo" INTEGER NOT NULL,
    "ciclo" INTEGER NOT NULL DEFAULT 1,
    "lidoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "devocionalId" TEXT,

    CONSTRAINT "capitulos_lidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anotacoes" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "devocionalId" TEXT,
    "livro" TEXT,
    "capitulo" INTEGER,
    "texto" TEXT,
    "oQueDeusFalou" TEXT,
    "aplicacao" TEXT,
    "oracao" TEXT,
    "visivelAmigos" BOOLEAN NOT NULL DEFAULT false,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anotacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedidos_oracao" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "devocionalId" TEXT,
    "texto" TEXT NOT NULL,
    "visivelAmigos" BOOLEAN NOT NULL DEFAULT false,
    "respondidoEm" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pedidos_oracao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orando_por" (
    "pedidoOracaoId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orando_por_pkey" PRIMARY KEY ("pedidoOracaoId","usuarioId")
);

-- CreateTable
CREATE TABLE "compartilhamentos" (
    "id" TEXT NOT NULL,
    "grupoId" TEXT NOT NULL,
    "devocionalId" TEXT,
    "anotacaoId" TEXT,
    "pedidoOracaoId" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "compartilhamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "streaks" (
    "usuarioId" TEXT NOT NULL,
    "atual" INTEGER NOT NULL DEFAULT 0,
    "recorde" INTEGER NOT NULL DEFAULT 0,
    "ultimoDia" DATE,
    "semanaGracaUsada" DATE,

    CONSTRAINT "streaks_pkey" PRIMARY KEY ("usuarioId")
);

-- CreateTable
CREATE TABLE "metas" (
    "id" TEXT NOT NULL,
    "criadorId" TEXT NOT NULL,
    "grupoId" TEXT,
    "tipo" "TipoMeta" NOT NULL,
    "alvo" INTEGER,
    "livros" TEXT[],
    "inicio" DATE NOT NULL,
    "fim" DATE,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seguidores" (
    "seguidorId" TEXT NOT NULL,
    "seguidoId" TEXT NOT NULL,
    "status" "StatusSeguidor" NOT NULL DEFAULT 'PENDENTE',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seguidores_pkey" PRIMARY KEY ("seguidorId","seguidoId")
);

-- CreateTable
CREATE TABLE "amens" (
    "devocionalId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "amens_pkey" PRIMARY KEY ("devocionalId","usuarioId")
);

-- CreateTable
CREATE TABLE "comentarios" (
    "id" TEXT NOT NULL,
    "devocionalId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "removidoEm" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comentarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grupos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "fotoUrl" TEXT,
    "codigoConvite" TEXT NOT NULL,
    "avisoFixado" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grupos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grupo_membros" (
    "grupoId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "papel" "PapelGrupo" NOT NULL DEFAULT 'MEMBRO',
    "entrouEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "grupo_membros_pkey" PRIMARY KEY ("grupoId","usuarioId")
);

-- CreateTable
CREATE TABLE "dispositivos_push" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "plataforma" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dispositivos_push_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "denuncias" (
    "id" TEXT NOT NULL,
    "autorId" TEXT NOT NULL,
    "alvoTipo" "AlvoDenuncia" NOT NULL,
    "alvoId" TEXT NOT NULL,
    "motivo" TEXT NOT NULL,
    "status" "StatusDenuncia" NOT NULL DEFAULT 'ABERTA',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "denuncias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bloqueios" (
    "bloqueadorId" TEXT NOT NULL,
    "bloqueadoId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bloqueios_pkey" PRIMARY KEY ("bloqueadorId","bloqueadoId")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_username_key" ON "usuarios"("username");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_googleId_key" ON "usuarios"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_appleId_key" ON "usuarios"("appleId");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_tokenHash_key" ON "refresh_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "refresh_tokens_usuarioId_idx" ON "refresh_tokens"("usuarioId");

-- CreateIndex
CREATE INDEX "devocionais_usuarioId_dia_idx" ON "devocionais"("usuarioId", "dia");

-- CreateIndex
CREATE INDEX "devocionais_usuarioId_criadoEm_idx" ON "devocionais"("usuarioId", "criadoEm");

-- CreateIndex
CREATE INDEX "devocional_passagens_devocionalId_idx" ON "devocional_passagens"("devocionalId");

-- CreateIndex
CREATE UNIQUE INDEX "capitulos_lidos_usuarioId_ciclo_livro_capitulo_key" ON "capitulos_lidos"("usuarioId", "ciclo", "livro", "capitulo");

-- CreateIndex
CREATE INDEX "anotacoes_usuarioId_criadoEm_idx" ON "anotacoes"("usuarioId", "criadoEm");

-- CreateIndex
CREATE INDEX "anotacoes_usuarioId_livro_idx" ON "anotacoes"("usuarioId", "livro");

-- CreateIndex
CREATE INDEX "pedidos_oracao_usuarioId_idx" ON "pedidos_oracao"("usuarioId");

-- CreateIndex
CREATE INDEX "compartilhamentos_grupoId_criadoEm_idx" ON "compartilhamentos"("grupoId", "criadoEm");

-- CreateIndex
CREATE INDEX "metas_criadorId_ativa_idx" ON "metas"("criadorId", "ativa");

-- CreateIndex
CREATE INDEX "metas_grupoId_idx" ON "metas"("grupoId");

-- CreateIndex
CREATE INDEX "seguidores_seguidoId_status_idx" ON "seguidores"("seguidoId", "status");

-- CreateIndex
CREATE INDEX "comentarios_devocionalId_criadoEm_idx" ON "comentarios"("devocionalId", "criadoEm");

-- CreateIndex
CREATE UNIQUE INDEX "grupos_codigoConvite_key" ON "grupos"("codigoConvite");

-- CreateIndex
CREATE INDEX "grupo_membros_usuarioId_idx" ON "grupo_membros"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "dispositivos_push_token_key" ON "dispositivos_push"("token");

-- CreateIndex
CREATE INDEX "dispositivos_push_usuarioId_idx" ON "dispositivos_push"("usuarioId");

-- CreateIndex
CREATE INDEX "denuncias_status_criadoEm_idx" ON "denuncias"("status", "criadoEm");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devocionais" ADD CONSTRAINT "devocionais_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devocional_passagens" ADD CONSTRAINT "devocional_passagens_devocionalId_fkey" FOREIGN KEY ("devocionalId") REFERENCES "devocionais"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "capitulos_lidos" ADD CONSTRAINT "capitulos_lidos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "capitulos_lidos" ADD CONSTRAINT "capitulos_lidos_devocionalId_fkey" FOREIGN KEY ("devocionalId") REFERENCES "devocionais"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anotacoes" ADD CONSTRAINT "anotacoes_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anotacoes" ADD CONSTRAINT "anotacoes_devocionalId_fkey" FOREIGN KEY ("devocionalId") REFERENCES "devocionais"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos_oracao" ADD CONSTRAINT "pedidos_oracao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos_oracao" ADD CONSTRAINT "pedidos_oracao_devocionalId_fkey" FOREIGN KEY ("devocionalId") REFERENCES "devocionais"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orando_por" ADD CONSTRAINT "orando_por_pedidoOracaoId_fkey" FOREIGN KEY ("pedidoOracaoId") REFERENCES "pedidos_oracao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orando_por" ADD CONSTRAINT "orando_por_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compartilhamentos" ADD CONSTRAINT "compartilhamentos_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "grupos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compartilhamentos" ADD CONSTRAINT "compartilhamentos_devocionalId_fkey" FOREIGN KEY ("devocionalId") REFERENCES "devocionais"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compartilhamentos" ADD CONSTRAINT "compartilhamentos_anotacaoId_fkey" FOREIGN KEY ("anotacaoId") REFERENCES "anotacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compartilhamentos" ADD CONSTRAINT "compartilhamentos_pedidoOracaoId_fkey" FOREIGN KEY ("pedidoOracaoId") REFERENCES "pedidos_oracao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "streaks" ADD CONSTRAINT "streaks_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metas" ADD CONSTRAINT "metas_criadorId_fkey" FOREIGN KEY ("criadorId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metas" ADD CONSTRAINT "metas_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "grupos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguidores" ADD CONSTRAINT "seguidores_seguidorId_fkey" FOREIGN KEY ("seguidorId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguidores" ADD CONSTRAINT "seguidores_seguidoId_fkey" FOREIGN KEY ("seguidoId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "amens" ADD CONSTRAINT "amens_devocionalId_fkey" FOREIGN KEY ("devocionalId") REFERENCES "devocionais"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "amens" ADD CONSTRAINT "amens_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_devocionalId_fkey" FOREIGN KEY ("devocionalId") REFERENCES "devocionais"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupo_membros" ADD CONSTRAINT "grupo_membros_grupoId_fkey" FOREIGN KEY ("grupoId") REFERENCES "grupos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupo_membros" ADD CONSTRAINT "grupo_membros_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispositivos_push" ADD CONSTRAINT "dispositivos_push_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "denuncias" ADD CONSTRAINT "denuncias_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bloqueios" ADD CONSTRAINT "bloqueios_bloqueadorId_fkey" FOREIGN KEY ("bloqueadorId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bloqueios" ADD CONSTRAINT "bloqueios_bloqueadoId_fkey" FOREIGN KEY ("bloqueadoId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
