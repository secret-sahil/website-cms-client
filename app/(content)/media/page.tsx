"use client";
import AdminLayout from "@/components/layout/admin/page";
import React, { useEffect, useRef, useState } from "react";
import { useCreateMedia, useDeleteMedia, useGetAllMedia, useUpdateMedia } from "@/hooks/useMedia";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Ban, Copy, Loader2, MoreVertical, Replace, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Page() {
  const { data } = useGetAllMedia();
  const media = data?.result?.data?.data ?? [];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [replaceTargetId, setReplaceTargetId] = useState<string | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { mutate: uploadFile } = useCreateMedia();
  const { mutate: updateFile } = useUpdateMedia();
  const { mutate: deleteFile, isPending } = useDeleteMedia();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (replaceTargetId) {
      updateFile({ file, id: replaceTargetId });
    } else {
      uploadFile(file);
    }
    setUploadDialogOpen(false);
    setReplaceTargetId(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (replaceTargetId) {
        updateFile({ file, id: replaceTargetId });
      } else {
        uploadFile(file);
      }
      setUploadDialogOpen(false);
      setReplaceTargetId(null);
    }
  };

  useEffect(() => {
    document.body.style.pointerEvents = "";
  }, [uploadDialogOpen, isAlertOpen]);

  return (
    <AdminLayout
      breadcrumbs={[
        {
          label: "Media",
          href: "/media",
        },
      ]}
    >
      <div className="relative p-4">
        <div className="grid select-none grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item) => (
            <div key={item.id} className="relative bg-slate-100 rounded-lg px-3 pb-5">
              <div className="p-2 flex justify-between items-center">
                <h3 className="text-sm font-medium truncate">{item.name}</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 focus-visible:ring-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(item.url)}>
                      <Copy /> Copy Url
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setReplaceTargetId(item.id);
                        setUploadDialogOpen(true);
                      }}
                    >
                      <Replace /> Replace
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setDeleteId(item.id);
                        setIsAlertOpen(true);
                      }}
                      asChild
                    >
                      <Button variant="destructive" className="w-full justify-start">
                        <Ban /> Delete
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Image
                width={400}
                height={400}
                src={item.url}
                alt={item.name}
                className="w-full h-48 object-cover rounded-sm"
              />
            </div>
          ))}
        </div>

        {/* Upload Dialog */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{replaceTargetId ? "Replace Image" : "Upload Image"}</DialogTitle>
            </DialogHeader>
            <div
              className={`mt-4 p-6 border-2 border-dashed rounded-lg text-center transition-all ${
                dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <p className="text-gray-500">Drag & drop or click to upload</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,image/gif"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Alert Dialog */}
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteFile(deleteId ?? "");
                    setIsAlertOpen(false);
                  }}
                  className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
                  disabled={isPending}
                >
                  {isPending ? <Loader2 className="animate-spin" /> : "Continue"}
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
          onClick={() => {
            setReplaceTargetId(null);
            setUploadDialogOpen(true);
          }}
          className="fixed bottom-6 right-6 z-50 rounded-full p-4 shadow-lg"
        >
          <Upload className="w-5 h-5 mr-2" />
          Upload
        </Button>
      </div>
    </AdminLayout>
  );
}
