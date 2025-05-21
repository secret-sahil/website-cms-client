import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { createSalesSchema } from "@/types/sales";
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

import { useCreateSales, useDelieveredQuantity } from "@/hooks/useSales";
import { Check, ChevronsUpDown, Loader2, Wallet } from "lucide-react";
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
import { useEffect } from "react";
import { useGetAllSalesOrders, useGetSalesOrderById } from "@/hooks/useSalesOrders";
import { Textarea } from "@/components/ui/textarea";

export default function DataFrom() {
  const { mutate, isPending } = useCreateSales();

  const form = useForm<z.infer<typeof createSalesSchema>>({
    resolver: zodResolver(createSalesSchema),
    defaultValues: {
      saleRemarks: "",
      salesOrderId: undefined,
      salesItems: [],
    },
  });

  const salesOrderId = form.watch("salesOrderId");

  const { data: salesOrders } = useGetAllSalesOrders({
    status: JSON.stringify(["OPEN"]),
  });

  const { data: salesOrder, refetch: refetchSalesOrder } = useGetSalesOrderById(salesOrderId);

  const { data: delieveredQuantity, refetch: refetchDelieveredQuantity } =
    useDelieveredQuantity(salesOrderId);

  const salesItems = salesOrder?.result.data?.salesOrderItems;
  const deliveredQuantity = delieveredQuantity?.result.data;
  const { fields: requiredFieldsSalesItems } = useFieldArray({
    control: form.control,
    name: "salesItems",
  });

  function onSubmit(values: z.infer<typeof createSalesSchema>) {
    const cleanedData = values.salesItems.filter((item) => item.quantity !== 0);
    mutate({ ...values, salesItems: cleanedData });
  }

  useEffect(() => {
    if (salesOrderId) {
      refetchSalesOrder();
      refetchDelieveredQuantity();
    }
  }, [salesOrderId, form, refetchSalesOrder, refetchDelieveredQuantity]);

  useEffect(() => {
    if (salesOrderId && salesOrder?.result.data?.salesOrderItems) {
      const itemsToAppend = salesOrder.result.data.salesOrderItems.map((item) => ({
        itemId: item.item.id,
        quantity:
          item.quantity -
          (deliveredQuantity?.find((delivereditem) => delivereditem.item_id === item.item.id)
            ?.total_quantity ?? 0),
      }));

      form.setValue("salesItems", itemsToAppend);
    }
  }, [salesOrderId, salesOrder, form, deliveredQuantity]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="salesOrderId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Sales Order</FormLabel>
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
                        ? salesOrders?.result.data?.find(
                            (salesOrder) => salesOrder.id === field.value
                          )?.voucherNo
                        : "Select Sales Order"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="min-full p-0">
                  <Command>
                    <CommandInput placeholder="Search division..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No open sales order found.</CommandEmpty>
                      <CommandGroup>
                        {salesOrders?.result.data?.map((salesOrder) => (
                          <CommandItem
                            value={salesOrder.voucherNo}
                            key={salesOrder.id}
                            onSelect={() => {
                              form.setValue("salesOrderId", salesOrder.id);
                            }}
                          >
                            {salesOrder.voucherNo}
                            <Check
                              className={cn(
                                "ml-auto",
                                salesOrder.id === field.value ? "opacity-100" : "opacity-0"
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
                This is the sales order that will be used in the dashboard.
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
                    <TableHead>Original Quantity</TableHead>
                    <TableHead>Delievered Quantity</TableHead>
                    <TableHead>Wallet Quantity</TableHead>
                    <TableHead>Pending Quantity</TableHead>
                    <TableHead>Sale Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requiredFieldsSalesItems.map((field, index) => {
                    // if (form.watch(`salesItems.${index}.quantity`) != 0) {
                    return (
                      <TableRow key={field.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <span className="border px-2 py-1 bg-muted rounded-md">
                            {
                              salesItems?.find(
                                (item) => item.item.id === form.watch(`salesItems.${index}.itemId`)
                              )?.item.name
                            }
                          </span>
                        </TableCell>
                        <TableCell>
                          {form.watch(`salesItems.${index}.itemId`)
                            ? salesItems?.find(
                                (item) => item.item.id === form.watch(`salesItems.${index}.itemId`)
                              )?.quantity
                            : "-"}{" "}
                          {form.watch(`salesItems.${index}.itemId`)
                            ? salesItems?.find(
                                (item) => item.item.id === form.watch(`salesItems.${index}.itemId`)
                              )?.item.mainUnit.name
                            : "-"}
                        </TableCell>
                        <TableCell className="text-green-500">
                          {deliveredQuantity?.find(
                            (item) => item.item_id === form.watch(`salesItems.${index}.itemId`)
                          )?.total_quantity ?? 0}{" "}
                          {form.watch(`salesItems.${index}.itemId`)
                            ? salesItems?.find(
                                (item) => item.item.id === form.watch(`salesItems.${index}.itemId`)
                              )?.item.mainUnit.name
                            : "-"}
                        </TableCell>
                        {/*  */}

                        <TableCell className="text-red-500">
                          <Wallet className="text-red-500 size-4 inline-flex mr-1" />
                          {form.watch(`salesItems.${index}.itemId`)
                            ? (salesItems?.find(
                                (item) => item.item.id === form.watch(`salesItems.${index}.itemId`)
                              )?.redeemedQty ?? 0)
                            : "-"}
                        </TableCell>
                        {/*  */}
                        <TableCell className="text-red-500">
                          {form.watch(`salesItems.${index}.itemId`)
                            ? (salesItems?.find(
                                (item) => item.item.id === form.watch(`salesItems.${index}.itemId`)
                              )?.quantity ?? 0) -
                              (deliveredQuantity?.find(
                                (item) => item.item_id === form.watch(`salesItems.${index}.itemId`)
                              )?.total_quantity ?? 0)
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Input
                            value={form.watch(`salesItems.${index}.quantity`)}
                            min={0}
                            max={
                              form.watch(`salesItems.${index}.itemId`)
                                ? (salesItems?.find(
                                    (item) =>
                                      item.item.id === form.watch(`salesItems.${index}.itemId`)
                                  )?.quantity ?? 0) -
                                  (deliveredQuantity?.find(
                                    (item) =>
                                      item.item_id === form.watch(`salesItems.${index}.itemId`)
                                  )?.total_quantity ?? 0)
                                : 0
                            }
                            disabled={!form.getValues("salesOrderId")}
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
                            ? salesItems?.find(
                                (item) => item.item.id === form.watch(`salesItems.${index}.itemId`)
                              )?.item.mainUnit.name
                            : "-"}
                        </TableCell>
                      </TableRow>
                    );
                    // }
                  })}
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
