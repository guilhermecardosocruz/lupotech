import "./globals.css";
import React from "react";
import AppHeader from "../components/AppHeader";

export const metadata = {
  title: "Serviços",
  description: "Aqui você soluciona o seu problema",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
