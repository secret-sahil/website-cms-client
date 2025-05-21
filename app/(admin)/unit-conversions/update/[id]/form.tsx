import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { updateUnitConversionSchema } from "@/types/unitConversions";
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
import { useGetUnitConversionById, useUpdateUnitConversion } from "@/hooks/useUnitConversions";
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
import { useGetAllUnits } from "@/hooks/useUnits";

export default function DataFrom({ id }: { id: number }) {
  const { mutate, isPending } = useUpdateUnitConversion();
  const { data } = useGetUnitConversionById(id);
  const { data: units } = useGetAllUnits();

  const form = useForm<z.infer<typeof updateUnitConversionSchema>>({
    resolver: zodResolver(updateUnitConversionSchema),
    values: data?.result.data,
    defaultValues: {
      fromUnitId: undefined,
      toUnitId: undefined,
      conversionFactor: 0,
    },
  });

  function onSubmit(values: z.infer<typeof updateUnitConversionSchema>) {
    mutate({ id, ...values });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="fromUnitId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>From Unit</FormLabel>
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
                        ? units?.result.data.find((unit) => unit.id === field.value)?.name
                        : "Select unit"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="min-full p-0">
                  <Command>
                    <CommandInput placeholder="Search unit..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No unit found.</CommandEmpty>
                      <CommandGroup>
                        {units?.result.data.map((unit) => (
                          <CommandItem
                            value={unit.name}
                            key={unit.id}
                            onSelect={() => {
                              form.setValue("fromUnitId", unit.id);
                            }}
                          >
                            {unit.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                unit.id === field.value ? "opacity-100" : "opacity-0"
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
                This is the unit that will be used in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="toUnitId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>To Unit</FormLabel>
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
                        ? units?.result.data.find((unit) => unit.id === field.value)?.name
                        : "Select unit"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="min-full p-0">
                  <Command>
                    <CommandInput placeholder="Search unit..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No unit found.</CommandEmpty>
                      <CommandGroup>
                        {units?.result.data.map((unit) => (
                          <CommandItem
                            value={unit.name}
                            key={unit.id}
                            onSelect={() => {
                              form.setValue("toUnitId", unit.id);
                            }}
                          >
                            {unit.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                unit.id === field.value ? "opacity-100" : "opacity-0"
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
                This is the unit that will be used in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="conversionFactor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conversion Factor</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter conversion factor"
                  {...field}
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^0-9.]/g, "");
                    value = value.replace(/^(\d*\.?\d*).*$/, "$1");
                    field.onChange(Number(value));
                  }}
                  onBlur={(e) => {
                    field.onChange(Number(e.target.value.trim()));
                  }}
                />
              </FormControl>
              <FormDescription>This is the conversion factor from unit to to unit.</FormDescription>
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
