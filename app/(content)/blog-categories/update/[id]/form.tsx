import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { updateCategorySchema } from "@/types/categories";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useGetCategoryById, useUpdateCategory } from "@/hooks/useCategories";
import { Loader2 } from "lucide-react";

export default function DataFrom({ id }: { id: string }) {
  const { mutate, isPending } = useUpdateCategory();
  const { data } = useGetCategoryById(id);

  const form = useForm<z.infer<typeof updateCategorySchema>>({
    resolver: zodResolver(updateCategorySchema),
    values: data?.result.data,
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof updateCategorySchema>) {
    mutate({ id, ...values });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter category name"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-Z ]/g, "");
                    field.onChange(value);
                  }}
                  onBlur={(e) => {
                    field.onChange(e.target.value.trim());
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isPending} type="submit">
          {isPending ? <Loader2 className="animate-spin" /> : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
