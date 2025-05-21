import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { createUnitConversionSchema } from "@/types/unitConversions";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateUnitConversion } from "@/hooks/useUnitConversions";
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
import { z } from "zod";
import { Input } from "@/components/ui/input";

export default function DataFrom() {
  const { mutate, isPending } = useCreateUnitConversion();
  const { data: units } = useGetAllUnits();

  const form = useForm<z.infer<typeof createUnitConversionSchema>>({
    resolver: zodResolver(createUnitConversionSchema),
    defaultValues: {
      fromUnitId: undefined,
      toUnitId: undefined,
      conversionFactor: 0,
    },
  });

  function onSubmit(values: z.infer<typeof createUnitConversionSchema>) {
    mutate(values);
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
                  type="number"
                  placeholder="Enter conversion factor"
                  {...field}
                  onChange={(value) => field.onChange(value.target.valueAsNumber)}
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
