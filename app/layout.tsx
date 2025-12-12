import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Where to Watch - Agregador de Filmes e Séries",
  description: "Encontre onde assistir seus filmes e séries favoritos, com notas de todos os principais sites de crítica.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
