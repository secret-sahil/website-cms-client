import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { updateBomSchema } from "@/types/boms";
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
import { Trash } from "lucide-react";
import { useGetBomById, useUpdateBom } from "@/hooks/useBoms";
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
import { useGetAllDivisions } from "@/hooks/useDivisions";
import { useEffect } from "react";

export default function DataFrom({ id }: { id: number }) {
  const { data } = useGetBomById(id, undefined, true);
  const { mutate, isPending } = useUpdateBom();

  const form = useForm<z.infer<typeof updateBomSchema>>({
    resolver: zodResolver(updateBomSchema),
    values: {
      ...data?.result?.data,
      itemsRequired:
        data?.result.data.itemsRequired.map((item) => ({
          quantity: item.quantity,
          itemId: item.item.id,
        })) ?? [],
      byProducts:
        data?.result.data.byProducts.map((item) => ({
          quantity: item.quantity,
          itemId: item.item.id,
        })) ?? [],
    },
    defaultValues: {
      name: "",
      alias: "",
      divisionId: undefined,
      finalProductId: undefined,
      itemsRequired: [],
      byProducts: [],
    },
  });

  const divisionId = form.watch("divisionId");

  const { data: finalItems, refetch: refetchFinalItems } = useGetAllItems({
    divisionId: form.getValues("divisionId"),
    type: JSON.stringify(["SEMIFINISHED", "FINISHED"]),
  });

  const { data: requiredItems, refetch: refetchRequiredItems } = useGetAllItems({
    divisionId: form.getValues("divisionId"),
    type: JSON.stringify(["RAW", "SEMIFINISHED", "CONSUMABLE"]),
  });

  const { data: byProducts, refetch: refetchByProducts } = useGetAllItems({
    divisionId: form.getValues("divisionId"),
    type: JSON.stringify(["RAW", "SEMIFINISHED", "FINISHED"]),
  });

  const { data: divisions } = useGetAllDivisions();

  const {
    fields: requiredFieldsItemsRequired,
    append: appendRequiredItemsRequired,
    remove: removeRequiredItemsRequired,
  } = useFieldArray({ control: form.control, name: "itemsRequired" });

  const {
    fields: requiredFieldsByProducts,
    append: appendRequiredByProducts,
    remove: removeRequiredByProducts,
  } = useFieldArray({ control: form.control, name: "byProducts" });

  function onSubmit(values: z.infer<typeof updateBomSchema>) {
    mutate({ id, ...values });
  }

  useEffect(() => {
    if (divisionId) {
      refetchFinalItems();
      refetchRequiredItems();
      refetchByProducts();
    }
  }, [divisionId, form, refetchByProducts, refetchFinalItems, refetchRequiredItems]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="finalProductId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                Final Product{" "}
                {field.value && (
                  <span className="text-red-500 font-bold">
                    (1 {""}
                    {finalItems?.result.data.find((item) => item.id === field.value)?.mainUnit.name}
                    )
                  </span>
                )}
              </FormLabel>
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
                        ? finalItems?.result.data.find((item) => item.id === field.value)?.name
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
                        {finalItems?.result.data.map((item) => (
                          <CommandItem
                            value={item.name}
                            key={item.id}
                            onSelect={() => {
                              form.setValue("finalProductId", item.id);
                              form.setValue("name", `${item.name} Bom`);
                            }}
                          >
                            {item.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                item.id === field.value ? "opacity-100" : "opacity-0"
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
                This is the item that will be used in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bom Name</FormLabel>
              <FormControl>
                <Input
                  disabled
                  placeholder="Enter bom name"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  onBlur={(e) => {
                    field.onChange(e.target.value.trim());
                  }}
                />
              </FormControl>
              <FormDescription>Auto generated after final product selection</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="alias"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bom Alias Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter bom alias name"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  onBlur={(e) => {
                    field.onChange(e.target.value.trim());
                  }}
                />
              </FormControl>
              <FormDescription>This is the alias name of your factory bom.</FormDescription>
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
                        ? divisions?.result.data.find((division) => division.id === field.value)
                            ?.name
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
                        {divisions?.result.data.map((division) => (
                          <CommandItem
                            value={division.name}
                            key={division.id}
                            onSelect={() => {
                              form.setValue("divisionId", division.id);
                            }}
                          >
                            {division.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                division.id === field.value ? "opacity-100" : "opacity-0"
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
          name="itemsRequired"
          render={() => (
            <FormItem>
              <FormLabel>Items Required</FormLabel>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-2">#</TableHead>
                    <TableHead className="w-1/3">Item</TableHead>
                    <TableHead className="w-1/3">Quantity</TableHead>
                    <TableHead className="w-1/3">Unit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requiredFieldsItemsRequired.map((field, index) => (
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
                                  !form.watch(`itemsRequired.${index}.itemId`) &&
                                    "text-muted-foreground"
                                )}
                              >
                                {form.watch(`itemsRequired.${index}.itemId`)
                                  ? requiredItems?.result.data.find(
                                      (item) =>
                                        item.id === form.watch(`itemsRequired.${index}.itemId`)
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
                                  {requiredItems?.result.data.map((item) => (
                                    <CommandItem
                                      value={item.name}
                                      key={item.id}
                                      onSelect={() => {
                                        form.setValue(`itemsRequired.${index}.itemId`, item.id);
                                      }}
                                    >
                                      {item.name}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          form.watch(`itemsRequired.${index}.itemId`) === item.id
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell>
                        <Input
                          value={form.watch(`itemsRequired.${index}.quantity`)}
                          disabled={!form.getValues("divisionId")}
                          onChange={(value) =>
                            form.setValue(
                              `itemsRequired.${index}.quantity`,
                              value.target.valueAsNumber
                            )
                          }
                          type="number"
                          placeholder="Quantity"
                        />
                      </TableCell>
                      <TableCell>
                        {form.watch(`itemsRequired.${index}.itemId`)
                          ? requiredItems?.result.data.find(
                              (item) => item.id === form.watch(`itemsRequired.${index}.itemId`)
                            )?.mainUnit.name
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Button type="button" onClick={() => removeRequiredItemsRequired(index)}>
                          <Trash size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow
                    className="cursor-pointer"
                    onClick={() => appendRequiredItemsRequired({ itemId: NaN, quantity: NaN })}
                  >
                    <TableCell>+</TableCell>
                    <TableCell>Add row</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <FormDescription>Manage the required items for BOM.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="byProducts"
          render={() => (
            <FormItem>
              <FormLabel>By Products</FormLabel>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-2">#</TableHead>
                    <TableHead className="w-1/3">Item</TableHead>
                    <TableHead className="w-1/3">Quantity</TableHead>
                    <TableHead className="w-1/3">Unit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requiredFieldsByProducts.map((field, index) => (
                    <TableRow key={field.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                disabled={!form.getValues("divisionId")}
                                role="combobox"
                                className={cn(
                                  "w-full justify-between",
                                  !form.watch(`byProducts.${index}.itemId`) &&
                                    "text-muted-foreground"
                                )}
                              >
                                {form.watch(`byProducts.${index}.itemId`)
                                  ? byProducts?.result.data.find(
                                      (item) => item.id === form.watch(`byProducts.${index}.itemId`)
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
                                  {byProducts?.result.data.map((item) => (
                                    <CommandItem
                                      value={item.name}
                                      key={item.id}
                                      onSelect={() => {
                                        form.setValue(`byProducts.${index}.itemId`, item.id);
                                      }}
                                    >
                                      {item.name}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          form.watch(`byProducts.${index}.itemId`) === item.id
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell>
                        <Input
                          disabled={!form.getValues("divisionId")}
                          value={form.watch(`byProducts.${index}.quantity`)}
                          onChange={(value) =>
                            form.setValue(
                              `byProducts.${index}.quantity`,
                              value.target.valueAsNumber
                            )
                          }
                          type="number"
                          placeholder="Quantity"
                        />
                      </TableCell>
                      <TableCell>
                        {form.watch(`byProducts.${index}.itemId`)
                          ? byProducts?.result.data.find(
                              (item) => item.id === form.watch(`byProducts.${index}.itemId`)
                            )?.mainUnit.name
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Button type="button" onClick={() => removeRequiredByProducts(index)}>
                          <Trash size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow
                    className="cursor-pointer"
                    onClick={() => appendRequiredByProducts({ itemId: NaN, quantity: NaN })}
                  >
                    <TableCell>+</TableCell>
                    <TableCell>Add row</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <FormDescription>Manage the by products for BOM.</FormDescription>
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
