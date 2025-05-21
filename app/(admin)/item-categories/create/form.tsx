import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { createCategorySchema } from "@/types/categories";
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
import { useCreateCategory } from "@/hooks/useCategories";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useGetAllDivisions } from "@/hooks/useDivisions";

export default function DataFrom() {
  const { mutate, isPending } = useCreateCategory();
  const { data: divisions } = useGetAllDivisions();
  const form = useForm<z.infer<typeof createCategorySchema>>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      divisionId: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof createCategorySchema>) {
    mutate(values);
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
              <FormDescription>This is the name of your factory category.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="divisionId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Division</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? divisions?.result.data.find((division) => division.id === field.value)
                            ?.name
                        : "Select division"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="min-full p-0">
                  <Command>
                    <CommandInput placeholder="Search division..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No division found.</CommandEmpty>
                      <CommandGroup>
                        {divisions?.result.data.map((division) => (
                          <CommandItem
                            value={division.name}
                            key={division.id}
                            onSelect={() => {
                              form.setValue("divisionId", division.id);
                            }}
                          >
                            {division.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                division.id === field.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the division that will be used in the dashboard.
              </FormDescription>
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
