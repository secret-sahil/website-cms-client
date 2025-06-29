import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import "@mdxeditor/editor/style.css";
import ReactQueryProvider from "./reactQueryProvider";
import { Toaster } from "react-hot-toast";
import { env } from "@/env.mjs";

const geistSans = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `Admin - ${env.NEXT_PUBLIC_APP_NAME}`,
  description: "Admin dashboard for managing the application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} antialiased dark`}>
        <Toaster position="bottom-center" />
        <ReactQueryProvider>
          <main>{children}</main>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
