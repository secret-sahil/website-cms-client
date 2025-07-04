"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { updateBlogSchema } from "@/types/blog";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useGetBlogById, useUpdateBlog } from "@/hooks/useBlog";
import { ArrowRightLeft, Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { cn } from "@/lib/utils";
import { useGetAllCategories } from "@/hooks/useCategories";
import { useGetAllMedia } from "@/hooks/useMedia";
import Image from "next/image";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

export default function DataFrom({ id }: { id: string }) {
  const { mutate, isPending } = useUpdateBlog();
  const { data: categories } = useGetAllCategories();
  const { data: media } = useGetAllMedia({ type: JSON.stringify(["image", "gif"]) });
  const { data } = useGetBlogById(id);

  const form = useForm<z.infer<typeof updateBlogSchema>>({
    resolver: zodResolver(updateBlogSchema),
    values: {
      ...data?.result.data,
      categoryIds: data?.result.data.categories.map((e) => e.category.id) || [],
    },
    defaultValues: {
      title: "",
      description: "",
      content: "",
      featuredImageId: "",
      categoryIds: [],
      tags: [],
    },
  });

  function onSubmit(values: z.infer<typeof updateBlogSchema>) {
    mutate({ id, ...values });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blog Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter blog title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="featuredImageId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Featured Image</FormLabel>
              <FormControl>
                <div className="flex gap-2 items-center">
                  <Input placeholder="Select an image" readOnly={true} {...field} />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline">
                        Select Image <ArrowRightLeft className="ml-2" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-7xl">
                      <AlertDialogHeader className="flex flex-row justify-between items-center">
                        <AlertDialogTitle>Select featured image.</AlertDialogTitle>
                        <AlertDialogCancel className="text-muted-foreground">Esc</AlertDialogCancel>
                      </AlertDialogHeader>
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 max-h-[70vh] overflow-y-auto">
                        {media?.result.data.data.map((img) => (
                          <button
                            key={img.id}
                            onClick={() => {
                              field.onChange(img.id);
                            }}
                            className={cn(
                              "border-2 rounded-xl p-1 hover:bg-accent",
                              form.watch("featuredImageId") === img.id ? "border-blue-500" : ""
                            )}
                          >
                            <Image
                              src={img.url}
                              alt={img.id}
                              width={150}
                              height={150}
                              className="w-full rounded-lg h-48 object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryIds"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Categories</FormLabel>
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
                      {field.value?.length
                        ? categories?.result.data.data
                            .filter((category) => field.value?.includes(category.id))
                            .map((category) => category.name)
                            .join(", ")
                        : "Select categories"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="min-w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search category..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        {categories?.result.data.data.map((category) => {
                          const isSelected = field.value?.includes(category.id);
                          return (
                            <CommandItem
                              key={category.id}
                              onSelect={() => {
                                const newValue = isSelected
                                  ? field.value?.filter((id) => id !== category.id)
                                  : [...(field.value ?? []), category.id];
                                form.setValue("categoryIds", newValue);
                              }}
                            >
                              {category.name}
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
              <FormDescription>Select one or more categories.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <div className="flex flex-wrap items-center gap-2 border border-input rounded-md p-2 min-h-[2.5rem]">
                  {field.value?.map((tag: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        className="hover:text-destructive"
                        onClick={() => {
                          const newTags = field.value?.filter(
                            (_: string, i: number) => i !== index
                          );
                          form.setValue("tags", [...(newTags ?? [])] as [string, ...string[]]);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <input
                    type="text"
                    placeholder="Add tag and press Enter"
                    className="flex-1 bg-transparent outline-none text-sm"
                    onPaste={(e) => {
                      e.preventDefault();
                      const paste = e.clipboardData.getData("text");
                      const values = paste
                        .split(",")
                        .map((v) => v.trim())
                        .filter((v) => v && !field.value?.includes(v));
                      if (values.length > 0) {
                        form.setValue("tags", [...(field.value ?? []), ...values]);
                      }
                      e.currentTarget.value = "";
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        const value = e.currentTarget.value.trim();
                        if (value && !field.value?.includes(value)) {
                          form.setValue("tags", [...(field.value ?? []), value]);
                          e.currentTarget.value = "";
                        }
                      }
                    }}
                  />
                </div>
              </FormControl>
              <FormDescription>Enter tags and press Enter or comma.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blog Description</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="Enter blog title" {...field} />
              </FormControl>
              <FormDescription>Used in seo meta description aslo.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blog Content</FormLabel>
              <FormControl>
                <Suspense fallback={<p className="text-black">Loading...</p>}>
                  <Editor
                    {...field}
                    initialValue={data?.result.data.content || ""}
                    onChange={(content) => field.onChange(content)}
                  />
                </Suspense>
              </FormControl>
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
