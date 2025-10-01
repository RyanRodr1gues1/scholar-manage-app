import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Aluno, AlunoFormData } from "@/types/aluno";
import { AlunosTable } from "@/components/AlunosTable";
import { AlunoForm } from "@/components/AlunoForm";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, GraduationCap } from "lucide-react";

const Index = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar todos os alunos
  const { data: alunos = [], isLoading } = useQuery({
    queryKey: ["alunos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alunos")
        .select("*")
        .order("data_criacao", { ascending: false });

      if (error) throw error;
      return data as Aluno[];
    },
  });

  // Filtrar alunos por busca
  const filteredAlunos = alunos.filter(
    (aluno) =>
      aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.curso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.matricula.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Criar aluno
  const createMutation = useMutation({
    mutationFn: async (data: AlunoFormData) => {
      const { error } = await supabase.from("alunos").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alunos"] });
      setIsFormOpen(false);
      toast({
        title: "Sucesso!",
        description: "Aluno cadastrado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao cadastrar",
        description: error.message || "Ocorreu um erro ao cadastrar o aluno.",
        variant: "destructive",
      });
    },
  });

  // Atualizar aluno
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AlunoFormData }) => {
      const { error } = await supabase
        .from("alunos")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alunos"] });
      setIsFormOpen(false);
      setSelectedAluno(null);
      toast({
        title: "Sucesso!",
        description: "Aluno atualizado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Ocorreu um erro ao atualizar o aluno.",
        variant: "destructive",
      });
    },
  });

  // Deletar aluno
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("alunos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alunos"] });
      setIsDeleteOpen(false);
      setDeleteId(null);
      toast({
        title: "Sucesso!",
        description: "Aluno excluído com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir",
        description: error.message || "Ocorreu um erro ao excluir o aluno.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: AlunoFormData) => {
    if (selectedAluno) {
      updateMutation.mutate({ id: selectedAluno.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (aluno: Aluno) => {
    setSelectedAluno(aluno);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  const handleNewAluno = () => {
    setSelectedAluno(null);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Sistema de Controle de Alunos
              </h1>
              <p className="text-muted-foreground mt-1">
                Gerencie cadastros de alunos de forma rápida e eficiente
              </p>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar por nome, email, curso ou matrícula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={handleNewAluno} className="shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            Novo Aluno
          </Button>
        </div>

        {/* Table */}
        <AlunosTable
          alunos={filteredAlunos}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />

        {/* Stats */}
        <div className="mt-6 text-sm text-muted-foreground">
          Mostrando {filteredAlunos.length} de {alunos.length} alunos
        </div>
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedAluno ? "Editar Aluno" : "Cadastrar Novo Aluno"}
            </DialogTitle>
            <DialogDescription>
              {selectedAluno
                ? "Atualize as informações do aluno abaixo."
                : "Preencha os dados do novo aluno abaixo."}
            </DialogDescription>
          </DialogHeader>
          <AlunoForm
            onSubmit={handleSubmit}
            defaultValues={
              selectedAluno
                ? {
                    nome: selectedAluno.nome,
                    email: selectedAluno.email,
                    curso: selectedAluno.curso,
                    matricula: selectedAluno.matricula,
                  }
                : undefined
            }
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={confirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default Index;
