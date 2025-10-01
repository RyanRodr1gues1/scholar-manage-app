import { Aluno } from "@/types/aluno";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AlunosTableProps {
  alunos: Aluno[];
  onEdit: (aluno: Aluno) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export const AlunosTable = ({ alunos, onEdit, onDelete, isLoading }: AlunosTableProps) => {
  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card">
        <div className="p-8 text-center">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
            <div className="h-4 bg-muted rounded w-2/3 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (alunos.length === 0) {
    return (
      <div className="rounded-lg border bg-card">
        <div className="p-8 text-center">
          <p className="text-muted-foreground">
            Nenhum aluno cadastrado ainda. Clique em "Novo Aluno" para começar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Matrícula</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Curso</TableHead>
            <TableHead>Data de Cadastro</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alunos.map((aluno) => (
            <TableRow key={aluno.id} className="hover:bg-accent/50 transition-colors">
              <TableCell className="font-medium">{aluno.matricula}</TableCell>
              <TableCell>{aluno.nome}</TableCell>
              <TableCell>{aluno.email}</TableCell>
              <TableCell>{aluno.curso}</TableCell>
              <TableCell>
                {format(new Date(aluno.data_criacao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(aluno)}
                  className="hover:bg-primary/10 hover:text-primary"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(aluno.id)}
                  className="hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
