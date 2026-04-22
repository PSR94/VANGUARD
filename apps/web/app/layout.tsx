import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "VANGUARD",
  description: "AI Release Intelligence and PR Risk Copilot"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen md:flex">
            <Sidebar />
            <main className="flex-1 p-6 md:p-8">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
