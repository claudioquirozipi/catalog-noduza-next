import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NODUZA_SHARE_IMAGE, SITE_URL } from "@/lib/share";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Íconos de Noduza; los catálogos los reemplazan por el logo del negocio (ver [businessId]/layout.tsx).
// Se declaran aquí y no como archivos favicon/icon en app/ para que esos archivos no se sumen en los catálogos.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Noduza Catálogo",
  description: "Catálogo de productos",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/logo/noduza-mark.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: { siteName: "Noduza", images: [NODUZA_SHARE_IMAGE] },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
