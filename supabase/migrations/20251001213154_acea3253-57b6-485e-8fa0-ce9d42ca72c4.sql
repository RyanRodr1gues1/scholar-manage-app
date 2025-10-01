-- Criar tabela de alunos
CREATE TABLE public.alunos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  curso TEXT NOT NULL,
  matricula TEXT NOT NULL UNIQUE,
  data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.alunos ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública (para este CRUD administrativo)
CREATE POLICY "Permitir leitura pública de alunos"
  ON public.alunos
  FOR SELECT
  USING (true);

-- Política para permitir inserção pública
CREATE POLICY "Permitir inserção pública de alunos"
  ON public.alunos
  FOR INSERT
  WITH CHECK (true);

-- Política para permitir atualização pública
CREATE POLICY "Permitir atualização pública de alunos"
  ON public.alunos
  FOR UPDATE
  USING (true);

-- Política para permitir exclusão pública
CREATE POLICY "Permitir exclusão pública de alunos"
  ON public.alunos
  FOR DELETE
  USING (true);

-- Criar índice para melhorar performance de buscas por email
CREATE INDEX idx_alunos_email ON public.alunos(email);

-- Criar índice para melhorar performance de buscas por matrícula
CREATE INDEX idx_alunos_matricula ON public.alunos(matricula);