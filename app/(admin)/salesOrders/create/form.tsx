import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { createSalesOrderSchema } from "@/types/salesOrders";
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

import { useCreateSalesOrder, useGetAllSalesOrders } from "@/hooks/useSalesOrders";
import { CalendarIcon, Check, ChevronsUpDown, Loader2, Trash } from "lucide-react";
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
import { useEffect } from "react";
import { useGetAllParties } from "@/hooks/useParties";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useGetAllInventory } from "@/hooks/useInventory";

export default function DataFrom() {
  const { mutate, isPending } = useCreateSalesOrder();
  const { data: allSalesOrders } = useGetAllSalesOrders();
  const { data: allItems } = useGetAllInventory();
  const allItemsData = allItems?.result.data;
  const form = useForm<z.infer<typeof createSalesOrderSchema>>({
    resolver: zodResolver(createSalesOrderSchema),
    defaultValues: {
      voucherNo: "",
      deliveryDate: undefined,
      partyId: undefined, //need to confirm
      divisionId: undefined,
      salesOrderItems: [],
    },
  });

  const divisionId = form.watch("divisionId");
  const partyId = form.watch("partyId");
  const { data: salesOrderItems, refetch: refetchSalesOrderItems } = useGetAllItems({
    divisionId: form.getValues("divisionId"),
    type: JSON.stringify(["SEMIFINISHED", "FINISHED"]),
  });

  const { data: parties } = useGetAllParties({
    type: JSON.stringify(["BUYER"]),
  });

  const divisions = parties?.result?.data?.find((party) => party.id === partyId)?.divisions;

  const {
    fields: requiredFieldsSalesOrderItems,
    append: appendRequiredSalesOrderItems,
    remove: removeRequiredSalesOrderItems,
  } = useFieldArray({ control: form.control, name: "salesOrderItems" });

  function onSubmit(values: z.infer<typeof createSalesOrderSchema>) {
    mutate(values);
  }

  useEffect(() => {
    if (divisionId) {
      refetchSalesOrderItems();
    }
  }, [divisionId, form, refetchSalesOrderItems]);

  useEffect(() => {
    if (partyId) {
      form.setValue(
        "voucherNo",
        `SO/${parties?.result.data.find((party) => party.id === partyId)?.name ?? ""}/${allSalesOrders && isNaN(allSalesOrders?.result.data[allSalesOrders?.result.data.length - 1]?.id + 1) ? 1 : allSalesOrders && allSalesOrders?.result.data[allSalesOrders?.result.data.length - 1]?.id + 1}`
      );
    }
  }, [partyId, form, parties?.result.data, allSalesOrders]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="voucherNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Voucher No.</FormLabel>
              <FormControl>
                <Input disabled placeholder="Enter voucher no name" {...field} />
              </FormControl>
              <FormDescription>voucher no for this sales order</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
                        ? divisions?.find((division) => division.division.id === field.value)
                            ?.division.name
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
                        {divisions?.map((division) => (
                          <CommandItem
                            value={division.division.name}
                            key={division.division.id}
                            onSelect={() => {
                              form.setValue("divisionId", division.division.id);
                            }}
                          >
                            {division.division.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                division.division.id === field.value ? "opacity-100" : "opacity-0"
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

        <FormField
          control={form.control}
          name="deliveryDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Delivery Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(!field.value && "text-muted-foreground")}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>Delivery date of sales order</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="salesOrderItems"
          render={() => (
            <FormItem>
              <FormLabel>Items</FormLabel>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-2">#</TableHead>
                    <TableHead className="w-1/5">Item</TableHead>
                    <TableHead className="w-1/5">Quantity</TableHead>
                    <TableHead className="w-1/5">Avaliable Quantity in wallet</TableHead>
                    <TableHead className="w-1/5">Redeem Quantity from wallet</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requiredFieldsSalesOrderItems.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                disabled={!form.getValues("divisionId")}
                                className={cn(
                                  "w-full justify-between",
                                  !form.watch(`salesOrderItems.${index}.itemId`) &&
                                    "text-muted-foreground"
                                )}
                              >
                                {form.watch(`salesOrderItems.${index}.itemId`)
                                  ? salesOrderItems?.result.data.find(
                                      (item) =>
                                        item.id === form.watch(`salesOrderItems.${index}.itemId`)
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
                                  {salesOrderItems?.result.data.map((soItem) => {
                                    const selectedItems = form.watch("salesOrderItems") || [];

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
                                              `salesOrderItems.${index}.itemId`,
                                              soItem.id
                                            );
                                          }}
                                        >
                                          {soItem.name}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              form.watch(`salesOrderItems.${index}.itemId`) ===
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
                      <TableCell className="flex items-center gap-1">
                        <Input
                          value={form.watch(`salesOrderItems.${index}.quantity`)}
                          disabled={!form.getValues("divisionId")}
                          onChange={(value) =>
                            form.setValue(
                              `salesOrderItems.${index}.quantity`,
                              value.target.valueAsNumber
                            )
                          }
                          type="number"
                          placeholder="Quantity"
                        />
                        {form.watch(`salesOrderItems.${index}.itemId`)
                          ? salesOrderItems?.result.data.find(
                              (item) => item.id === form.watch(`salesOrderItems.${index}.itemId`)
                            )?.mainUnit.name
                          : "-"}
                      </TableCell>
                      <TableCell className="text-center text-red-500 font-bold">
                        {
                          allItemsData?.find(
                            (item) => item.itemId === form.watch(`salesOrderItems.${index}.itemId`)
                          )?.totalWalletQty
                        }{" "}
                        {allItemsData?.find(
                          (item) => item.itemId === form.watch(`salesOrderItems.${index}.itemId`)
                        )?.totalWalletQty &&
                          salesOrderItems?.result.data.find(
                            (item) => item.id === form.watch(`salesOrderItems.${index}.itemId`)
                          )?.mainUnit.name}
                      </TableCell>
                      <TableCell className="flex items-center gap-1">
                        <Input
                          max={
                            allItemsData?.find(
                              (item) =>
                                item.itemId === form.watch(`salesOrderItems.${index}.itemId`)
                            )?.totalWalletQty ?? 0
                          }
                          value={form.watch(`salesOrderItems.${index}.redeemedQty`)}
                          disabled={
                            parties?.result.data.find((party) => party.id === form.watch("partyId"))
                              ?.name == "Self"
                          }
                          onChange={(value) =>
                            form.setValue(
                              `salesOrderItems.${index}.redeemedQty`,
                              value.target.valueAsNumber
                            )
                          }
                          type="number"
                          placeholder="Redeem Quantity"
                        />
                        {form.watch(`salesOrderItems.${index}.itemId`)
                          ? salesOrderItems?.result.data.find(
                              (item) => item.id === form.watch(`salesOrderItems.${index}.itemId`)
                            )?.mainUnit.name
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Button type="button" onClick={() => removeRequiredSalesOrderItems(index)}>
                          <Trash size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow
                    className="cursor-pointer"
                    onClick={() =>
                      form.getValues("divisionId") &&
                      appendRequiredSalesOrderItems({ itemId: NaN, quantity: NaN })
                    }
                  >
                    <TableCell>+</TableCell>
                    <TableCell>Add row</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <FormDescription>Manage the required items for SALESORDER.</FormDescription>
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
