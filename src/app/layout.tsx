import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/firebase/authContext";

export const metadata: Metadata = {
  title: "TELLTALE — AI Murder Mystery Detective Platform",
  description: "An AI-driven interactive detective platform where the truth is locked and justice must be reconstructed.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-noir-950 text-noir-100 antialiased">
      <body className="min-h-screen bg-noir-950 text-noir-100 selection:bg-thread-900 selection:text-thread-200">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
