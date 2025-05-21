import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { createProductionSchema } from "@/types/production";
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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useCreateProduction } from "@/hooks/useProduction";
import { Check, ChevronsUpDown, Loader2, Trash } from "lucide-react";
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
import { useGetAllItems } from "@/hooks/useItems";
import { useGetAllStorages } from "@/hooks/useStorages";

export default function DataFrom() {
  const { mutate, isPending } = useCreateProduction();

  const form = useForm<z.infer<typeof createProductionSchema>>({
    resolver: zodResolver(createProductionSchema),
    defaultValues: {
      storageId: 0,
      productionItems: [],
    },
  });

  const { data: requiredItemsData } = useGetAllItems({
    type: JSON.stringify(["SEMIFINISHED", "FINISHED"]),
  });
  const requiredItems = requiredItemsData?.result.data;

  const {
    fields: requiredFieldsProductionItems,
    append: appendRequiredFieldsProductionItems,
    remove: removeRequiredFieldsProductionItems,
  } = useFieldArray({
    control: form.control,
    name: "productionItems",
  });

  function onSubmit(values: z.infer<typeof createProductionSchema>) {
    const cleanedData = values.productionItems.filter((item) => item.quantity !== 0);
    mutate({ ...values, productionItems: cleanedData });
  }

  const { data: storages } = useGetAllStorages({
    type: JSON.stringify(["SEMIFINISHED", "FINISHED"]),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="storageId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Storage</FormLabel>
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
                        ? storages?.result.data.find((storage) => storage.id === field.value)?.name
                        : "Select storage"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="min-full p-0">
                  <Command>
                    <CommandInput placeholder="Search division..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No storage found.</CommandEmpty>
                      <CommandGroup>
                        {storages?.result.data.map((storage) => (
                          <CommandItem
                            value={storage.name}
                            key={storage.id}
                            onSelect={() => {
                              form.setValue("storageId", storage.id);
                            }}
                          >
                            {storage.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                storage.id === field.value ? "opacity-100" : "opacity-0"
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
                This is the storage that will be used in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="productionItems"
          render={() => (
            <FormItem>
              <FormLabel>Items</FormLabel>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-2">#</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Sale Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requiredFieldsProductionItems.map((field, index) => {
                    return (
                      <TableRow key={field.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  disabled={!form.getValues("storageId")}
                                  className={cn(
                                    "w-full justify-between",
                                    !form.watch(`productionItems.${index}.itemId`) &&
                                      "text-muted-foreground"
                                  )}
                                >
                                  {form.watch(`productionItems.${index}.itemId`)
                                    ? requiredItems?.find(
                                        (item) =>
                                          item.id === form.watch(`productionItems.${index}.itemId`)
                                      )?.name
                                    : "Select item"}
                                  <ChevronsUpDown className="opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="min-full p-0">
                              <Command>
                                <CommandInput placeholder="Search item..." className="h-9" />
                                <CommandList>
                                  <CommandEmpty>No item found.</CommandEmpty>
                                  <CommandGroup>
                                    {requiredItems?.map((soItem) => {
                                      const selectedItems = form.watch("productionItems") || [];

                                      const alreadySelected = selectedItems.some(
                                        (selectedItem) => selectedItem.itemId === soItem.id
                                      );

                                      if (!alreadySelected) {
                                        return (
                                          <CommandItem
                                            value={soItem.name}
                                            key={soItem.id}
                                            onSelect={() => {
                                              form.setValue(
                                                `productionItems.${index}.itemId`,
                                                soItem.id
                                              );
                                            }}
                                          >
                                            {soItem.name}
                                            <Check
                                              className={cn(
                                                "ml-auto",
                                                form.watch(`productionItems.${index}.itemId`) ===
                                                  soItem.id
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                          </CommandItem>
                                        );
                                      }

                                      return null;
                                    })}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </TableCell>

                        <TableCell>
                          <Input
                            value={form.watch(`productionItems.${index}.quantity`)}
                            min={0}
                            disabled={!form.getValues("storageId")}
                            onChange={(value) =>
                              form.setValue(
                                `productionItems.${index}.quantity`,
                                value.target.valueAsNumber
                              )
                            }
                            type="number"
                            placeholder="Sale Quantity"
                          />
                        </TableCell>
                        <TableCell>
                          {form.watch(`productionItems.${index}.itemId`)
                            ? requiredItems?.find(
                                (item) => item.id === form.watch(`productionItems.${index}.itemId`)
                              )?.mainUnit.name
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            onClick={() => removeRequiredFieldsProductionItems(index)}
                          >
                            <Trash size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow
                    className="cursor-pointer"
                    onClick={() => {
                      if (form.watch("storageId")) {
                        appendRequiredFieldsProductionItems({
                          itemId: 0,
                          quantity: 0,
                        });
                      }
                    }}
                  >
                    <TableCell>+</TableCell>
                    <TableCell>Add row</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <FormDescription>Manage the required items for PRODUCTION.</FormDescription>
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
