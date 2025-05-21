import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { createPartySchema } from "@/types/parties";
import { Input } from "@/components/ui/input";
import { TypeOf, z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateParty } from "@/hooks/useParties";
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
import { Textarea } from "@/components/ui/textarea";

const types: TypeOf<typeof createPartySchema>["type"] = ["BUYER", "SELLER", "JOBWORK"];

export default function DataFrom() {
  const { mutate, isPending } = useCreateParty();
  const { data: divisions } = useGetAllDivisions();
  const form = useForm<z.infer<typeof createPartySchema>>({
    resolver: zodResolver(createPartySchema),
    defaultValues: {
      name: "",
      alias: "",
      divisions: [],
      address: "",
      type: [],
    },
  });

  function onSubmit(values: z.infer<typeof createPartySchema>) {
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
              <FormLabel>Party Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter party name"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  onBlur={(e) => {
                    field.onChange(e.target.value.trim());
                  }}
                />
              </FormControl>
              <FormDescription>This is the name of your factory party.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="alias"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Party Alias Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter party alias name"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  onBlur={(e) => {
                    field.onChange(e.target.value.trim());
                  }}
                />
              </FormControl>
              <FormDescription>This is the name of your factory party.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter address"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  onBlur={(e) => {
                    field.onChange(e.target.value.trim());
                  }}
                />
              </FormControl>
              <FormDescription>This is the name of your party address.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Party Type</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value?.length && "text-muted-foreground"
                      )}
                    >
                      {field.value?.length ? field.value.join(", ") : "Select party type"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="min-full p-0">
                  <Command>
                    <CommandInput placeholder="Search type..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No party type found.</CommandEmpty>
                      <CommandGroup>
                        {types.map((type) => {
                          const isSelected = field.value?.includes(type);
                          return (
                            <CommandItem
                              key={type}
                              value={type}
                              onSelect={() => {
                                form.setValue(
                                  "type",
                                  isSelected
                                    ? field.value.filter((t) => t !== type)
                                    : [...(field.value || []), type]
                                );
                              }}
                            >
                              {type}
                              <Check
                                className={cn("ml-auto", isSelected ? "opacity-100" : "opacity-0")}
                              />
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>Select one or multiple party types.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="divisions"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Divisions</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value.length && "text-muted-foreground"
                      )}
                    >
                      {field.value.length
                        ? divisions?.result.data
                            .filter((division) => field.value.includes(division.id))
                            .map((division) => division.name)
                            .join(", ")
                        : "Select divisions"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="min-w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search division..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No division found.</CommandEmpty>
                      <CommandGroup>
                        {divisions?.result.data.map((division) => {
                          const isSelected = field.value.includes(division.id);
                          return (
                            <CommandItem
                              key={division.id}
                              onSelect={() => {
                                const newValue = isSelected
                                  ? field.value.filter((id) => id !== division.id)
                                  : [...field.value, division.id];
                                form.setValue("divisions", newValue);
                              }}
                            >
                              {division.name}
                              <Check
                                className={cn("ml-auto", isSelected ? "opacity-100" : "opacity-0")}
                              />
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>Select one or more divisions.</FormDescription>
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
