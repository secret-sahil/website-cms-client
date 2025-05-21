import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { updateSalesOrderSchema } from "@/types/salesOrders";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarIcon, Trash } from "lucide-react";
import { useGetSalesOrderById, useUpdateSalesOrder } from "@/hooks/useSalesOrders";
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
import { useGetAllItems } from "@/hooks/useItems";
import { useEffect } from "react";
import { useGetAllParties } from "@/hooks/useParties";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { useGetAllInventory } from "@/hooks/useInventory";

const status: TypeOf<typeof updateSalesOrderSchema>["status"][] = [
  "INPROGRESS",
  "CLOSED",
  "CANCELLED",
  "OPEN",
];

export default function DataFrom({ id }: { id: number }) {
  const { data } = useGetSalesOrderById(id);
  const { mutate, isPending } = useUpdateSalesOrder();
  const { data: allItems } = useGetAllInventory();
  const allItemsData = allItems?.result.data;
  const form = useForm<z.infer<typeof updateSalesOrderSchema>>({
    resolver: zodResolver(updateSalesOrderSchema),
    values: {
      ...data?.result?.data,
      deliveryDate: data?.result.data.deliveryDate
        ? new Date(data?.result.data.deliveryDate)
        : undefined,
      salesOrderItems:
        data?.result?.data?.salesOrderItems.map((item) => ({
          quantity: item.quantity,
          redeemedQty: item.redeemedQty,
          itemId: item.item.id,
        })) ?? [],
    },
    defaultValues: {
      voucherNo: "",
      deliveryDate: undefined,
      partyId: undefined,
      divisionId: undefined,
      salesOrderItems: [],
      status: undefined,
      orderRemarks: "",
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

  function onSubmit(values: z.infer<typeof updateSalesOrderSchema>) {
    mutate({ ...values, id, statusRemarks: "" });
  }

  useEffect(() => {
    if (divisionId) {
      refetchSalesOrderItems();
    }
  }, [divisionId, form, refetchSalesOrderItems]);

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
                <Input
                  disabled
                  placeholder="Enter voucher no name"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  onBlur={(e) => {
                    field.onChange(e.target.value.trim());
                  }}
                />
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
              <FormDescription>Delivery Date of sales order</FormDescription>
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

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Item Type</FormLabel>
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
                        ? status.find((type) => type === field.value)
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
                        {status.map((type) => (
                          <CommandItem
                            value={type}
                            key={type}
                            onSelect={() => {
                              form.setValue("status", type);
                            }}
                          >
                            {type}
                            <Check
                              className={cn(
                                "ml-auto",
                                type === field.value ? "opacity-100" : "opacity-0"
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
          name="orderRemarks"
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
