import "./globals.css";
import React from "react";
import RegisterSW from "../components/RegisterSW";
import AppHeader from "../components/AppHeader";

export const metadata = {
  title: "Serviços",
  description: "Aqui você soluciona o seu problema",
  manifest: "/manifest.webmanifest",
  themeColor: "#16a34a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AppHeader />
        <RegisterSW />
        {children}
      </body>
    </html>
  );
}
