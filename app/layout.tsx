import "./globals.css";
import React from "react";
import RegisterSW from "../components/RegisterSW";
import AppHeader from "../components/AppHeader";

export const metadata = {
  title: "Serviços",
  description: "Aqui você soluciona o seu problema",
  manifest: "/manifest.webmanifest",
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
// Viewport oficial (Next 15): themeColor deve ficar aqui
export const viewport = {
  themeColor: "#16a34a",
};
