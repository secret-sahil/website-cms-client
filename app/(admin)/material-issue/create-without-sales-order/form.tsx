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

import { ArrowRightLeft, Check, ChevronsUpDown, Loader2, Trash } from "lucide-react";
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
import { createMaterialIssuesWithoutSalesOrderSchema } from "@/types/materialIssues";
import { useCreateIndependentMaterialIssues } from "@/hooks/useMaterialIssues";
import { useGetBatchesForItemWithSelectedQuantity } from "@/hooks/useInventory";
import { format } from "date-fns";
import { useGetAllStorages } from "@/hooks/useStorages";
import { useGetAllParties } from "@/hooks/useParties";
import { useGetAllItems } from "@/hooks/useItems";

export default function DataFrom() {
  const { mutate, isPending } = useCreateIndependentMaterialIssues();
  const [selectedItemId, setSelectedItemId] = useState<number>(0);
  const [selectedItemIdIsAlt, setSelectedItemIdIsAlt] = useState<boolean>(false);
  const [workingIndex, setWorkingIndex] = useState<number>(-1);
  const form = useForm<z.infer<typeof createMaterialIssuesWithoutSalesOrderSchema>>({
    resolver: zodResolver(createMaterialIssuesWithoutSalesOrderSchema),
    defaultValues: {
      partyId: 0,
      storageId: 0,
      materialIssuesItems: [],
    },
  });

  const { data: parties } = useGetAllParties({
    type: JSON.stringify(["BUYER"]),
  });

  const { data: storages } = useGetAllStorages({
    type: JSON.stringify(["PRODUCTION"]),
  });

  const {
    fields: requiredFieldsMaterialIssuesItems,
    append: appendRequiredFieldsMaterialIssuesItems,
    remove: removeRequiredFieldsMaterialIssuesItems,
  } = useFieldArray({
    control: form.control,
    name: "materialIssuesItems",
  });

  const altQuantity = form.watch(`materialIssuesItems.${workingIndex}.altQuantity`);
  const quantity = form.watch(`materialIssuesItems.${workingIndex}.quantity`);
  const {
    data: selectedBatches,
    refetch: refetchSelectedBatches,
    error,
    isError,
  } = useGetBatchesForItemWithSelectedQuantity(
    {
      id: selectedItemId,
      isAltQuantity: selectedItemIdIsAlt,
      requiredQuantity: selectedItemIdIsAlt ? altQuantity : quantity,
      type: JSON.stringify(["RAW"]),
    },
    !!selectedItemId
  );

  const { data: requiredItemsData } = useGetAllItems({
    type: JSON.stringify(["RAW", "CONSUMABLE"]),
  });
  const requiredItems = requiredItemsData?.result.data;
  function onSubmit(values: z.infer<typeof createMaterialIssuesWithoutSalesOrderSchema>) {
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

  useEffect(() => {
    if (isError && selectedItemIdIsAlt) {
      form.setValue(`materialIssuesItems.${workingIndex}.quantity`, 0);
    } else if (isError && !selectedItemIdIsAlt) {
      form.setValue(`materialIssuesItems.${workingIndex}.altQuantity`, 0);
    }
    form.setValue(`materialIssuesItems.${workingIndex}.error`, error?.result.error);
  }, [error, form, isError, selectedItemIdIsAlt, workingIndex]);

  useEffect(() => {
    if ((selectedItemId && altQuantity) || quantity) {
      refetchSelectedBatches();
    }
  }, [altQuantity, quantity, refetchSelectedBatches, selectedItemId]);

  useEffect(() => {
    if (selectedBatches) {
      let quantity: number = 0;
      selectedBatches?.result?.data?.map(
        (batch) =>
          (quantity += selectedItemIdIsAlt ? batch.selectedQuantity : batch.selectedQuantityAlt)
      );

      if (selectedItemIdIsAlt) {
        form.setValue(
          `materialIssuesItems.${workingIndex}.quantity`,
          selectedBatches?.result?.data[0]?.item?.mainUnit?.alias == "pcs"
            ? quantity
              ? Number(quantity.toFixed())
              : 0
            : quantity
        );
      } else {
        form.setValue(`materialIssuesItems.${workingIndex}.altQuantity`, quantity);
      }

      const allBatchesToAppend = selectedBatches?.result?.data
        ?.filter((batch) => batch.quantity > 0)
        ?.map((batch) => ({
          batchId: batch.id,
          quantity: batch.quantity,
          batchQuantity:
            batch.item.mainUnit.alias == "pcs"
              ? batch?.selectedQuantity
                ? Number(batch?.selectedQuantity.toFixed())
                : 0
              : batch.selectedQuantity,
          createdAt: batch.createdAt,
          batchAltQuantity: batch.selectedQuantityAlt,
          conversionFactor: Number(batch.conversionFactor),
          storage: batch.storage.name,
        }));
      form.setValue(`materialIssuesItems.${workingIndex}.batches`, allBatchesToAppend);
    }
  }, [form, selectedBatches, selectedItemIdIsAlt, workingIndex]);

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
          name="storageId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>To Storage</FormLabel>
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
                    <TableHead>Transfer Quantity (Main Unit)</TableHead>
                    <TableHead>Transfer Quantity (Alt Unit)</TableHead>
                    <TableHead>Select Batch</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requiredFieldsMaterialIssuesItems.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                disabled={
                                  !form.getValues("partyId") && !form.getValues("storageId")
                                }
                                className={cn(
                                  "w-full justify-between",
                                  !form.watch(`materialIssuesItems.${index}.itemId`) &&
                                    "text-muted-foreground"
                                )}
                              >
                                {form.watch(`materialIssuesItems.${index}.itemId`)
                                  ? requiredItems?.find(
                                      (item) =>
                                        item.id ===
                                        form.watch(`materialIssuesItems.${index}.itemId`)
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
                                    const selectedItems = form.watch("materialIssuesItems") || [];

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
                                              `materialIssuesItems.${index}.itemId`,
                                              soItem.id
                                            );
                                          }}
                                        >
                                          {soItem.name}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              form.watch(`materialIssuesItems.${index}.itemId`) ===
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
                        <div className="flex flex-col">
                          <div className="flex flex-row items-center border rounded-md">
                            <Input
                              className="border-none focus-visible:ring-0 shadow-none"
                              value={
                                form
                                  .watch(`materialIssuesItems.${index}.batches`)
                                  ?.reduce((sum, item) => sum + (item.batchQuantity || 0), 0) ?? 0
                              }
                              disabled={!form.watch("partyId") && !form.watch("storageId")}
                              onChange={(value) => {
                                form.setValue(
                                  `materialIssuesItems.${index}.quantity`,
                                  value.target.valueAsNumber
                                );
                                setSelectedItemIdIsAlt(false);
                                setWorkingIndex(index);
                                setSelectedItemId(
                                  (form.watch(`materialIssuesItems.${index}.itemId`) &&
                                    requiredItems?.find(
                                      (item) =>
                                        item.id ===
                                        form.watch(`materialIssuesItems.${index}.itemId`)
                                    )?.id) ??
                                    0
                                );
                              }}
                              type="number"
                            />
                            <span className="pr-2">
                              {form.watch(`materialIssuesItems.${index}.itemId`) &&
                                requiredItems?.find(
                                  (item) =>
                                    item.id === form.watch(`materialIssuesItems.${index}.itemId`)
                                )?.mainUnit.alias}
                            </span>
                          </div>
                          <span className="text-red-500">
                            {form.watch(`materialIssuesItems.${index}.error`)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-row items-center border rounded-md">
                          <Input
                            className="border-none focus-visible:ring-0 shadow-none"
                            value={
                              form
                                .watch(`materialIssuesItems.${index}.batches`)
                                ?.reduce((sum, item) => sum + (item.batchAltQuantity || 0), 0) ?? 0
                            }
                            disabled={!form.watch("partyId") && !form.watch("storageId")}
                            onChange={(value) => {
                              form.setValue(
                                `materialIssuesItems.${index}.altQuantity`,
                                value.target.valueAsNumber
                              );
                              setSelectedItemIdIsAlt(true);
                              setWorkingIndex(index);
                              setSelectedItemId(form.watch(`materialIssuesItems.${index}.itemId`));
                            }}
                            type="number"
                          />
                          <span className="pr-2">
                            {form.watch(`materialIssuesItems.${index}.itemId`) &&
                              requiredItems?.find(
                                (item) =>
                                  item.id === form.watch(`materialIssuesItems.${index}.itemId`)
                              )?.altUnit.alias}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              disabled={!form.getValues(`materialIssuesItems.${index}.altQuantity`)}
                              onClick={() => {
                                setSelectedItemId(
                                  form.watch(`materialIssuesItems.${index}.itemId`)
                                );
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
                                Select required{" "}
                                <span className="border bg-muted px-2 rounded-md">
                                  {form.watch(`materialIssuesItems.${index}.itemId`) &&
                                    requiredItems?.find(
                                      (item) =>
                                        item.id ===
                                        form.watch(`materialIssuesItems.${index}.itemId`)
                                    )?.mainUnit.alias}
                                </span>{" "}
                                from below batches.
                              </AlertDialogTitle>
                              <AlertDialogCancel className="text-muted-foreground">
                                Esc
                              </AlertDialogCancel>
                            </AlertDialogHeader>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Btach ID</TableHead>
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
                                      <TableCell>{item.batchId}</TableCell>
                                      <TableCell>
                                        {item.quantity}{" "}
                                        {form.watch(`materialIssuesItems.${index}.itemId`) &&
                                          requiredItems?.find(
                                            (item) =>
                                              item.id ===
                                              form.watch(`materialIssuesItems.${index}.itemId`)
                                          )?.mainUnit.alias}
                                      </TableCell>
                                      <TableCell>{item.conversionFactor}</TableCell>
                                      <TableCell>
                                        {item.quantity * item.conversionFactor}
                                        {form.watch(`materialIssuesItems.${index}.itemId`) &&
                                          requiredItems?.find(
                                            (item) =>
                                              item.id ===
                                              form.watch(`materialIssuesItems.${index}.itemId`)
                                          )?.altUnit.alias}
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
                                              }}
                                            />
                                            <span className="pr-2">
                                              {form.watch(`materialIssuesItems.${index}.itemId`) &&
                                                requiredItems?.find(
                                                  (item) =>
                                                    item.id ===
                                                    form.watch(
                                                      `materialIssuesItems.${index}.itemId`
                                                    )
                                                )?.mainUnit.alias}
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
                                              max={item.quantity * item.conversionFactor}
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
                                              }}
                                            />
                                            <span className="pr-2">
                                              {form.watch(`materialIssuesItems.${index}.itemId`) &&
                                                requiredItems?.find(
                                                  (item) =>
                                                    item.id ===
                                                    form.watch(
                                                      `materialIssuesItems.${index}.itemId`
                                                    )
                                                )?.altUnit.alias}
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
                      <TableCell>
                        <Button
                          type="button"
                          onClick={() => removeRequiredFieldsMaterialIssuesItems(index)}
                        >
                          <Trash size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow
                    className="cursor-pointer"
                    onClick={() => {
                      if (form.watch("partyId") && form.watch("storageId")) {
                        appendRequiredFieldsMaterialIssuesItems({
                          itemId: 0,
                          quantity: 0,
                          altQuantity: 0,
                        });
                      }
                    }}
                  >
                    <TableCell>+</TableCell>
                    <TableCell>Add row</TableCell>
                  </TableRow>
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
