import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { updateItemSchema } from "@/types/items";
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
import { useGetItemById, useUpdateItem } from "@/hooks/useItems";
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
import { useGetAllCategories } from "@/hooks/useCategories";
import { useGetAllSubCategories } from "@/hooks/useSubCategories";
import { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useUploadImage } from "@/hooks/useUpload";
import { Label } from "@/components/ui/label";

const types: TypeOf<typeof updateItemSchema>["type"][] = [
  "RAW",
  "SEMIFINISHED",
  "FINISHED",
  "CONSUMABLE",
];

export default function DataFrom({ id }: { id: number }) {
  const { data } = useGetItemById(id);
  const { mutate: uploadImage, data: uploadImageRes } = useUploadImage();
  const form = useForm<z.infer<typeof updateItemSchema>>({
    resolver: zodResolver(updateItemSchema),
    values: data?.result.data,
    defaultValues: {
      name: "",
      alias: "",
      divisionId: undefined,
      categoryId: undefined,
      subCategoryId: undefined,
      thresholdQty: 0,
      daysToReorder: 0,
      type: "RAW",
      leadTime: 0,
      orderBy: "",
      needSalesOrderToSale: false,
    },
  });

  const { mutate, isPending } = useUpdateItem();
  const { data: divisions } = useGetAllDivisions();
  const divisionId = form.watch("divisionId");
  const categoryId = form.watch("categoryId");

  const { data: categories, refetch: refetchCategories } = useGetAllCategories({
    divisionId: form.getValues("divisionId"),
  });
  const { data: subcategories, refetch: refetchSubcategories } = useGetAllSubCategories({
    divisionId: form.getValues("divisionId"),
    categoryId: form.getValues("categoryId"),
  });

  useEffect(() => {
    if (divisionId) {
      refetchCategories();
    }
  }, [divisionId, form, refetchCategories]);

  useEffect(() => {
    if (categoryId) {
      refetchSubcategories();
    }
  }, [categoryId, form, refetchSubcategories]);

  function onSubmit(values: z.infer<typeof updateItemSchema>) {
    mutate({ ...values, id, image: uploadImageRes?.result.data });
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter item name"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-Z ]/g, "");
                    field.onChange(value);
                  }}
                  onBlur={(e) => {
                    field.onChange(e.target.value.trim());
                  }}
                />
              </FormControl>
              <FormDescription>This is the name of your factory item.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="picture">Picture</Label>
          <Input onChange={handleFileChange} id="picture" type="file" />
        </div>

        <FormField
          control={form.control}
          name="alias"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Alias Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter item alias name"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-Z ]/g, "");
                    field.onChange(value);
                  }}
                  onBlur={(e) => {
                    field.onChange(e.target.value.trim());
                  }}
                />
              </FormControl>
              <FormDescription>This is the alias name of your factory item.</FormDescription>
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
          name="categoryId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Category</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      disabled={!form.getValues("divisionId")}
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? categories?.result.data.find((category) => category.id === field.value)
                            ?.name
                        : "Select category"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="min-full p-0">
                  <Command>
                    <CommandInput placeholder="Search subcategory..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No subcategory found.</CommandEmpty>
                      <CommandGroup>
                        {categories?.result.data.map((category) => (
                          <CommandItem
                            value={category.name}
                            key={category.id}
                            onSelect={() => {
                              form.setValue("categoryId", category.id);
                            }}
                          >
                            {category.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                category.id === field.value ? "opacity-100" : "opacity-0"
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
                This is the category that will be used in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subCategoryId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Sub Category</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      disabled={!form.getValues("categoryId")}
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? subcategories?.result.data.find(
                            (subcategory) => subcategory.id === field.value
                          )?.name
                        : "Select subcategory"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="min-full p-0">
                  <Command>
                    <CommandInput placeholder="Search subcategory..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No subcategory found.</CommandEmpty>
                      <CommandGroup>
                        {subcategories?.result.data.map((subcategory) => (
                          <CommandItem
                            value={subcategory.name}
                            key={subcategory.id}
                            onSelect={() => {
                              form.setValue("subCategoryId", subcategory.id);
                            }}
                          >
                            {subcategory.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                subcategory.id === field.value ? "opacity-100" : "opacity-0"
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
                This is the sub category that will be used in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="thresholdQty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Threshold Quantity{" "}
                <span className="text-blue-500 font-bold">({data?.result.data.mainUnit.name})</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter threshold quantity"
                  {...field}
                  onChange={(value) => field.onChange(value.target.valueAsNumber)}
                />
              </FormControl>
              <FormDescription>This is the threshold quantity.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="leadTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Lead Time <span className="text-blue-500 font-bold">(Days)</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter lead time"
                  {...field}
                  onChange={(value) => field.onChange(value.target.valueAsNumber)}
                />
              </FormControl>
              <FormDescription>This is the days.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="daysToReorder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Notification Days <span className="text-blue-500 font-bold">(Days)</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter Notification Days"
                  {...field}
                  onChange={(value) => field.onChange(value.target.valueAsNumber)}
                />
              </FormControl>
              <FormDescription>This is the Notification Days.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="orderBy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order By</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter order by name(s)"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  onBlur={(e) => {
                    field.onChange(e.target.value.trim());
                  }}
                />
              </FormControl>
              <FormDescription>This is the name of your factory item.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="needSalesOrderToSale"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Need Sales Order to Sale</FormLabel>
              <FormControl>
                <Checkbox
                  className="w-5 h-5"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
              </FormControl>
              <FormDescription>
                Enable this if a sales order is required before selling.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
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
                      {field.value ? types.find((type) => type === field.value) : "Select division"}
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
                        {types.map((type) => (
                          <CommandItem
                            value={type}
                            key={type}
                            onSelect={() => {
                              form.setValue("type", type);
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

        <Button disabled={isPending} type="submit">
          {isPending ? <Loader2 className="animate-spin" /> : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
