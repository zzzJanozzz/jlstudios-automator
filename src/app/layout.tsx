// src/app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "JLStudios — Web Automator Next-Gen",
  description: "Motor interno de generación de sitios web premium",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {children}
        <Toaster
          position="bottom-right"
          theme="dark"
          richColors
          closeButton
        />
      </body>
    </html>
  );
}