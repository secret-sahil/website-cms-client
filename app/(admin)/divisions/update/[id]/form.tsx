import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { updateDivisionSchema } from "@/types/divisions";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useGetDivisionById, useUpdateDivision } from "@/hooks/useDivisions";
import { Loader2 } from "lucide-react";

export default function DataForm({ id }: { id: number }) {
  const { mutate, isPending } = useUpdateDivision();
  const { data } = useGetDivisionById(id);

  const form = useForm<z.infer<typeof updateDivisionSchema>>({
    resolver: zodResolver(updateDivisionSchema),
    values: data?.result?.data,
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof updateDivisionSchema>) {
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
              <FormLabel>Division Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter division name"
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
              <FormDescription>This is the name of your factory division.</FormDescription>
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
