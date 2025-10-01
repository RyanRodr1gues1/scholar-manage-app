import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlunoFormData } from "@/types/aluno";

const alunoSchema = z.object({
  nome: z.string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim(),
  email: z.string()
    .min(1, "Email é obrigatório")
    .email("Email inválido")
    .max(255, "Email deve ter no máximo 255 caracteres")
    .trim(),
  curso: z.string()
    .min(1, "Curso é obrigatório")
    .max(100, "Curso deve ter no máximo 100 caracteres")
    .trim(),
  matricula: z.string()
    .min(1, "Matrícula é obrigatória")
    .max(50, "Matrícula deve ter no máximo 50 caracteres")
    .trim(),
});

interface AlunoFormProps {
  onSubmit: (data: AlunoFormData) => void;
  defaultValues?: AlunoFormData;
  isLoading?: boolean;
}

export const AlunoForm = ({ onSubmit, defaultValues, isLoading }: AlunoFormProps) => {
  const form = useForm<AlunoFormData>({
    resolver: zodResolver(alunoSchema),
    defaultValues: defaultValues || {
      nome: "",
      email: "",
      curso: "",
      matricula: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Digite o nome completo" 
                  {...field} 
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  type="email"
                  placeholder="exemplo@email.com" 
                  {...field} 
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="curso"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Curso</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Digite o curso" 
                  {...field} 
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="matricula"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Matrícula</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Digite a matrícula" 
                  {...field} 
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Salvando..." : "Salvar Aluno"}
        </Button>
      </form>
    </Form>
  );
};
