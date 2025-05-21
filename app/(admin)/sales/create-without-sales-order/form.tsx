import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { createIndependentSalesSchema } from "@/types/sales";
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

import { useCreateIndependentSales } from "@/hooks/useSales";
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
import { useGetAllParties } from "@/hooks/useParties";
import { useGetAllItems } from "@/hooks/useItems";
import { Textarea } from "@/components/ui/textarea";

export default function DataFrom() {
  const { mutate, isPending } = useCreateIndependentSales();

  const form = useForm<z.infer<typeof createIndependentSalesSchema>>({
    resolver: zodResolver(createIndependentSalesSchema),
    defaultValues: {
      saleRemarks: "",
      partyId: 0,
      salesItems: [],
    },
  });

  const { data: requiredItemsData } = useGetAllItems({
    type: JSON.stringify(["SEMIFINISHED", "FINISHED", "CONSUMABLE"]),
  });
  const requiredItems = requiredItemsData?.result.data;

  const {
    fields: requiredFieldsSalesItems,
    append: appendRequiredFieldsSalesItems,
    remove: removeRequiredFieldsSalesItems,
  } = useFieldArray({
    control: form.control,
    name: "salesItems",
  });

  function onSubmit(values: z.infer<typeof createIndependentSalesSchema>) {
    const cleanedData = values.salesItems.filter((item) => item.quantity !== 0);
    mutate({ ...values, salesItems: cleanedData });
  }

  const { data: parties } = useGetAllParties({
    type: JSON.stringify(["BUYER"]),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="partyId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Party</FormLabel>
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
                        ? parties?.result.data.find((party) => party.id === field.value)?.name
                        : "Select party"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="min-full p-0">
                  <Command>
                    <CommandInput placeholder="Search division..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No party found.</CommandEmpty>
                      <CommandGroup>
                        {parties?.result.data.map((party) => (
                          <CommandItem
                            value={party.name}
                            key={party.id}
                            onSelect={() => {
                              form.setValue("partyId", party.id);
                            }}
                          >
                            {party.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                party.id === field.value ? "opacity-100" : "opacity-0"
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
                This is the party that will be used in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="salesItems"
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
                  {requiredFieldsSalesItems.map((field, index) => {
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
                                  disabled={!form.getValues("partyId")}
                                  className={cn(
                                    "w-full justify-between",
                                    !form.watch(`salesItems.${index}.itemId`) &&
                                      "text-muted-foreground"
                                  )}
                                >
                                  {form.watch(`salesItems.${index}.itemId`)
                                    ? requiredItems?.find(
                                        (item) =>
                                          item.id === form.watch(`salesItems.${index}.itemId`)
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
                                      const selectedItems = form.watch("salesItems") || [];

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
                                                `salesItems.${index}.itemId`,
                                                soItem.id
                                              );
                                            }}
                                          >
                                            {soItem.name}
                                            <Check
                                              className={cn(
                                                "ml-auto",
                                                form.watch(`salesItems.${index}.itemId`) ===
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
                            value={form.watch(`salesItems.${index}.quantity`)}
                            min={0}
                            disabled={!form.getValues("partyId")}
                            onChange={(value) =>
                              form.setValue(
                                `salesItems.${index}.quantity`,
                                value.target.valueAsNumber
                              )
                            }
                            type="number"
                            placeholder="Sale Quantity"
                          />
                        </TableCell>
                        <TableCell>
                          {form.watch(`salesItems.${index}.itemId`)
                            ? requiredItems?.find(
                                (item) => item.id === form.watch(`salesItems.${index}.itemId`)
                              )?.mainUnit.name
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            onClick={() => removeRequiredFieldsSalesItems(index)}
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
                      if (form.watch("partyId")) {
                        appendRequiredFieldsSalesItems({
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
              <FormDescription>Manage the required items for SALES.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="saleRemarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Packaging Remarks</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter packaging remarks"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  onBlur={(e) => {
                    field.onChange(e.target.value.trim());
                  }}
                />
              </FormControl>
              <FormDescription>Packaging remarks for sales order</FormDescription>
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
