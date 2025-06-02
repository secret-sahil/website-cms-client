"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { createJobSchema } from "@/types/job";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import {
  Form,
  FormControl,
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCreateJob } from "@/hooks/useJob";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useGetAllOffice } from "@/hooks/useOffice";
import { cn } from "@/lib/utils";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

export default function DataFrom() {
  const { data: offices } = useGetAllOffice();
  const { mutate, isPending } = useCreateJob();
  const form = useForm<z.infer<typeof createJobSchema>>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      title: "",
      description: "",
      locationId: "",
      experience: "",
    },
  });

  function onSubmit(values: z.infer<typeof createJobSchema>) {
    mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter job title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="locationId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Job Location</FormLabel>
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
                        ? offices?.result.data.data.find((office) => office.id === field.value)
                            ?.name
                        : "Select job location"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="min-full p-0">
                  <Command>
                    <CommandInput placeholder="Search office..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No office found.</CommandEmpty>
                      <CommandGroup>
                        {offices?.result.data.data.map((office) => (
                          <CommandItem
                            value={office.name}
                            key={office.id}
                            onSelect={() => {
                              form.setValue("locationId", office.id);
                            }}
                          >
                            {office.name}
                            <Check
                              className={cn(
                                "ml-auto",
                                office.id === field.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experience</FormLabel>
              <FormControl>
                <Input placeholder="Enter job experience required eg.(2-3 Years)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Content</FormLabel>
              <FormControl>
                <Suspense fallback={<p className="text-black">Loading...</p>}>
                  <Editor
                    menuBar={false}
                    {...field}
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
