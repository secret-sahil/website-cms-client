import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { ArrowRightLeft, Check, ChevronsUpDown, Loader2 } from "lucide-react";
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
import { useEffect, useState } from "react";
import { useGetAllSalesOrders, useGetRequiredSalesItems } from "@/hooks/useSalesOrders";
import { retrunMaterialIssuesSchema } from "@/types/materialIssues";
import { useReturnMaterialIssues, useMaterialIssuedQuantity } from "@/hooks/useMaterialIssues";
import { useGetBatchesForItemWithSelectedQuantity } from "@/hooks/useInventory";
import { format } from "date-fns";
import { useGetAllStorages } from "@/hooks/useStorages";

export default function DataFrom() {
  const { mutate, isPending } = useReturnMaterialIssues();
  const [selectedItemId, setSelectedItemId] = useState<number>(0);
  const [workingIndex, setWorkingIndex] = useState<number>(0);
  const form = useForm<z.infer<typeof retrunMaterialIssuesSchema>>({
    resolver: zodResolver(retrunMaterialIssuesSchema),
    defaultValues: {
      storageId: undefined,
      salesOrderId: undefined,
      materialIssuesItems: [],
    },
  });

  const saleOrderId = form.watch("salesOrderId");

  const { data: materialIssuedQuantity } = useMaterialIssuedQuantity(saleOrderId);
  const deliveredQuantity = materialIssuedQuantity?.result.data;
  const { data: salesOrders } = useGetAllSalesOrders({
    status: JSON.stringify(["OPEN"]),
  });

  const { data: storages } = useGetAllStorages({
    type: JSON.stringify(["PRODUCTION"]),
    divisionId: salesOrders?.result.data.find((salesOrder) => salesOrder.id === saleOrderId)
      ?.divisionId,
  });

  const { fields: requiredFieldsMaterialIssuesItems } = useFieldArray({
    control: form.control,
    name: "materialIssuesItems",
  });

  const { data: itemsRequired } = useGetRequiredSalesItems(saleOrderId);
  const altQuantity = form.watch(`materialIssuesItems.${workingIndex}.altQuantity`);
  const quantity = form.watch(`materialIssuesItems.${workingIndex}.quantity`);
  const { data: selectedBatches, refetch: refetchSelectedBatches } =
    useGetBatchesForItemWithSelectedQuantity(
      {
        id: selectedItemId,
        isAltQuantity: false,
        requiredQuantity: quantity,
        type: JSON.stringify(["RAW"]),
      },
      !!selectedItemId
    );
  const requiredItems = itemsRequired?.result.data;

  useEffect(() => {
    if ((selectedItemId && altQuantity) || quantity) {
      refetchSelectedBatches();
    }
  }, [altQuantity, quantity, refetchSelectedBatches, selectedItemId]);

  useEffect(() => {
    if (selectedBatches) {
      const allBatchesToAppend = selectedBatches?.result?.data.slice(0, 10).map((batch) => ({
        batchId: batch.id,
        quantity: batch.quantity,
        batchQuantity:
          form
            .getValues(`materialIssuesItems.${workingIndex}.batches`)
            ?.find((Batch) => Batch.batchId === batch.id)?.batchQuantity ?? 0,
        batchAltQuantity:
          form
            .getValues(`materialIssuesItems.${workingIndex}.batches`)
            ?.find((Batch) => Batch.batchId === batch.id)?.batchAltQuantity ?? 0,
        createdAt: batch.createdAt,
        conversionFactor: Number(batch.conversionFactor),
        storage: batch.storage.name,
      }));
      form.setValue(`materialIssuesItems.${workingIndex}.batches`, allBatchesToAppend);
    }
  }, [form, selectedBatches, workingIndex]);

  useEffect(() => {
    if (requiredItems) {
      const itemsToAppend = requiredItems?.map((item) => ({
        itemId: item.item.id,
        quantity: 0,
        altQuantity: 0,
      }));

      form.setValue("materialIssuesItems", itemsToAppend);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requiredItems]);

  function onSubmit(values: z.infer<typeof retrunMaterialIssuesSchema>) {
    console.log(values);
    const cleanedMaterialIssuesItems = values.materialIssuesItems
      .filter((item) => item.altQuantity !== 0 && item.quantity !== 0)
      .map((item) => ({
        ...item,
        batches: item.batches
          ? item.batches.filter((batch) => batch.batchQuantity !== 0)
          : undefined,
      }));
    mutate({ ...values, materialIssuesItems: cleanedMaterialIssuesItems });
  }

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
          name="storageId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>From Storage</FormLabel>
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
                        ? storages?.result.data?.find((storages) => storages.id === field.value)
                            ?.name
                        : "Select Storage"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="min-full p-0">
                  <Command>
                    <CommandInput placeholder="Search storage..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No storage found.</CommandEmpty>
                      <CommandGroup>
                        {storages?.result.data?.map((storages) => (
                          <CommandItem
                            value={storages.name}
                            key={storages.id}
                            onSelect={() => {
                              form.setValue("storageId", storages.id);
                            }}
                          >
                            {storages.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                storages.id === field.value ? "opacity-100" : "opacity-0"
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
          name="materialIssuesItems"
          render={() => (
            <FormItem>
              <FormLabel>Items</FormLabel>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-2">#</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Required Quantity</TableHead>
                    <TableHead>Transfered Quantity</TableHead>
                    {/* <TableHead>Remaining Quantity</TableHead> */}
                    <TableHead>Transfer Quantity</TableHead>
                    <TableHead>Transfer Quantity (Alt Unit)</TableHead>
                    <TableHead>Select Batch</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requiredFieldsMaterialIssuesItems.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <span className="border px-2 py-1 bg-muted rounded-md leading-8">
                          {requiredItems?.find((item) => item.item.id === field.itemId)?.item.name}
                        </span>
                      </TableCell>
                      <TableCell>
                        {requiredItems?.find((item) => item.item.id === field.itemId)?.quantity}
                        {
                          requiredItems?.find((item) => item.item.id === field.itemId)?.item
                            .mainUnit.alias
                        }
                      </TableCell>
                      <TableCell className="text-orange-500">
                        {deliveredQuantity?.find((item) => {
                          return item.item_id === field.itemId;
                        })?.total_quantity ?? 0}
                        {
                          requiredItems?.find((item) => item.item.id === field.itemId)?.item
                            .mainUnit.alias
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex flex-row items-center border rounded-md">
                            <Input
                              className="border-none focus-visible:ring-0 shadow-none"
                              max={
                                deliveredQuantity?.find((item) => {
                                  return item.item_id === field.itemId;
                                })?.total_quantity ?? 0
                              }
                              value={form.watch(`materialIssuesItems.${index}.quantity`) ?? 0}
                              type="number"
                            />
                            <span className="pr-2">
                              {
                                requiredItems?.find((item) => item.item.id === field.itemId)?.item
                                  .mainUnit.alias
                              }
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-row items-center border rounded-md">
                          <Input
                            className="border-none focus-visible:ring-0 shadow-none"
                            value={form.watch(`materialIssuesItems.${index}.altQuantity`) ?? 0}
                            readOnly
                            type="number"
                          />
                          <span className="pr-2">
                            {
                              requiredItems?.find((item) => item.item.id === field.itemId)?.item
                                .altUnit.alias
                            }
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              // disabled={!form.getValues(`materialIssuesItems.${index}.altQuantity`)}
                              onClick={() => {
                                setSelectedItemId(field.itemId);
                                setWorkingIndex(index);
                              }}
                              variant="outline"
                            >
                              Change Batch <ArrowRightLeft />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="max-w-5xl">
                            <AlertDialogHeader className="flex flex-row justify-between items-center">
                              <AlertDialogTitle>
                                Select{" "}
                                <span className="border bg-muted px-2 rounded-md">
                                  {deliveredQuantity?.find((item) => {
                                    return item.item_id === field.itemId;
                                  })?.total_quantity ?? 0}{" "}
                                  {
                                    requiredItems?.find((item) => item.item.id === field.itemId)
                                      ?.item.mainUnit.alias
                                  }
                                </span>{" "}
                                or less from below batches.
                              </AlertDialogTitle>
                              <AlertDialogCancel className="text-muted-foreground">
                                Esc
                              </AlertDialogCancel>
                            </AlertDialogHeader>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Batch ID</TableHead>
                                  <TableHead>Avaliable Quantity</TableHead>
                                  <TableHead>Conversion Factor</TableHead>
                                  <TableHead>Avaliable Quantity (Alt Unit)</TableHead>
                                  <TableHead>Created At</TableHead>
                                  <TableHead>Storage</TableHead>
                                  <TableHead>Select Quantity</TableHead>
                                  <TableHead>Select Quantity (Alt Unit)</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {form
                                  .watch(`materialIssuesItems.${index}.batches`)
                                  ?.map((item, key) => (
                                    <TableRow key={key}>
                                      <TableCell>
                                        <span className="border border-border px-2 rounded-md">
                                          {item.batchId}
                                        </span>
                                      </TableCell>
                                      <TableCell>
                                        {item.quantity}{" "}
                                        {
                                          requiredItems?.find(
                                            (item) => item.item.id === field.itemId
                                          )?.item.mainUnit.alias
                                        }
                                      </TableCell>
                                      <TableCell>{item.conversionFactor}</TableCell>
                                      <TableCell>
                                        {item.quantity * item.conversionFactor}
                                        {
                                          requiredItems?.find(
                                            (item) => item.item.id === field.itemId
                                          )?.item.altUnit.alias
                                        }
                                      </TableCell>
                                      <TableCell>
                                        {format(new Date(item.createdAt ?? ""), "yyyy-MM-dd")}{" "}
                                        <span className="bg-muted rounded-md px-1 border">
                                          {format(new Date(item.createdAt ?? ""), "hh:mm a")}
                                        </span>
                                      </TableCell>
                                      <TableCell>
                                        <span className="border border-border px-2 rounded-md">
                                          {item.storage}
                                        </span>
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex flex-col">
                                          <div className="flex flex-row items-center border rounded-md">
                                            <Input
                                              className="border-none focus-visible:ring-0 shadow-none"
                                              type="number"
                                              min={0}
                                              value={form.watch(
                                                `materialIssuesItems.${index}.batches.${key}.batchQuantity`
                                              )}
                                              max={
                                                deliveredQuantity?.find((item) => {
                                                  return item.item_id === field.itemId;
                                                })?.total_quantity ?? 0
                                              }
                                              defaultValue={form.watch(
                                                `materialIssuesItems.${index}.batches.${key}.batchQuantity`
                                              )}
                                              onChange={(value) => {
                                                form.setValue(
                                                  `materialIssuesItems.${index}.batches.${key}.batchQuantity`,
                                                  value.target.valueAsNumber
                                                );
                                                form.setValue(
                                                  `materialIssuesItems.${index}.batches.${key}.batchAltQuantity`,
                                                  Number(
                                                    (
                                                      value.target.valueAsNumber *
                                                      item.conversionFactor
                                                    ).toFixed(3)
                                                  )
                                                );
                                                form.setValue(
                                                  `materialIssuesItems.${index}.quantity`,
                                                  Number(
                                                    form
                                                      .watch(`materialIssuesItems.${index}.batches`)
                                                      ?.reduce(
                                                        (sum, item) =>
                                                          sum + (item.batchQuantity || 0),
                                                        0
                                                      ) ?? 0
                                                  )
                                                );
                                                form.setValue(
                                                  `materialIssuesItems.${index}.altQuantity`,
                                                  Number(
                                                    form
                                                      .watch(`materialIssuesItems.${index}.batches`)
                                                      ?.reduce(
                                                        (sum, item) =>
                                                          sum + (item.batchAltQuantity || 0),
                                                        0
                                                      ) ?? 0
                                                  )
                                                );
                                              }}
                                            />
                                            <span className="pr-2">
                                              {
                                                requiredItems?.find(
                                                  (item) => item.item.id === field.itemId
                                                )?.item.mainUnit.alias
                                              }
                                            </span>
                                          </div>
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex flex-col">
                                          <div className="flex flex-row items-center border rounded-md">
                                            <Input
                                              className="border-none focus-visible:ring-0 shadow-none"
                                              type="number"
                                              min={0}
                                              max={
                                                deliveredQuantity?.find((item) => {
                                                  return item.item_id === field.itemId;
                                                })?.total_quantity ?? 0
                                              }
                                              value={form.watch(
                                                `materialIssuesItems.${index}.batches.${key}.batchAltQuantity`
                                              )}
                                              defaultValue={form.watch(
                                                `materialIssuesItems.${index}.batches.${key}.batchAltQuantity`
                                              )}
                                              onChange={(value) => {
                                                form.setValue(
                                                  `materialIssuesItems.${index}.batches.${key}.batchAltQuantity`,
                                                  value.target.valueAsNumber
                                                );
                                                form.setValue(
                                                  `materialIssuesItems.${index}.batches.${key}.batchQuantity`,
                                                  Number(
                                                    (
                                                      value.target.valueAsNumber /
                                                      item.conversionFactor
                                                    ).toFixed()
                                                  )
                                                );
                                                form.setValue(
                                                  `materialIssuesItems.${index}.quantity`,
                                                  Number(
                                                    form
                                                      .watch(`materialIssuesItems.${index}.batches`)
                                                      ?.reduce(
                                                        (sum, item) =>
                                                          sum + (item.batchQuantity || 0),
                                                        0
                                                      ) ?? 0
                                                  )
                                                );
                                                form.setValue(
                                                  `materialIssuesItems.${index}.altQuantity`,
                                                  Number(
                                                    form
                                                      .watch(`materialIssuesItems.${index}.batches`)
                                                      ?.reduce(
                                                        (sum, item) =>
                                                          sum + (item.batchAltQuantity || 0),
                                                        0
                                                      ) ?? 0
                                                  )
                                                );
                                              }}
                                            />
                                            <span className="pr-2">
                                              {
                                                requiredItems?.find(
                                                  (item) => item.item.id === field.itemId
                                                )?.item.altUnit.alias
                                              }
                                            </span>
                                          </div>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <FormDescription>Manage the required items for material transfer.</FormDescription>
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
