export interface Aluno {
  id: string;
  nome: string;
  email: string;
  curso: string;
  matricula: string;
  data_criacao: string;
}

export type AlunoFormData = Omit<Aluno, 'id' | 'data_criacao'>;
