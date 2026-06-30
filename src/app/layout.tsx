import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import { Toaster } from "sonner";
import { settingsService } from "@/services/settings.service";
import "./globals.css";

// ---------------------------------------------------------------------------
// Fontes
// ---------------------------------------------------------------------------

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// ---------------------------------------------------------------------------
// Metadata dinâmica (via SEO settings do DB)
// ---------------------------------------------------------------------------

export async function generateMetadata(): Promise<Metadata> {
  const [company, seo] = await Promise.all([
    settingsService.getCompany(),
    settingsService.getSeo(),
  ]);

  const appName = company?.name ?? "Zumbo Store";
  const title = seo?.meta_title ?? `${appName} — Compras inteligentes, entregas rápidas.`;
  const description =
    seo?.meta_description ??
    "A principal loja online de Moçambique. Smartphones, Eletrodomésticos, Moda e muito mais com entrega rápida.";

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_APP_URL ?? "https://zumbostore.co.mz"
    ),
    title: {
      default: title,
      template: `%s | ${appName}`,
    },
    description,
    keywords: [
      "loja online Moçambique",
      "compras online Maputo",
      "smartphones Moçambique",
      "eletrodomésticos",
    ],
    openGraph: {
      type: "website",
      locale: "pt_MZ",
      siteName: appName,
      title,
      description,
      ...(seo?.og_image_url
        ? { images: [{ url: seo.og_image_url, width: 1200, height: 630 }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: "/",
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B1F3A",
};

// ---------------------------------------------------------------------------
// Layout raiz
// ---------------------------------------------------------------------------

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-MZ"
      className={`${inter.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        {children}

        {/* Toast global (sonner) — posicionado no canto inferior direito */}
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          toastOptions={{
            duration: 5000,
            classNames: {
              error:   "!bg-red-50 !border-red-200 !text-red-800",
              success: "!bg-green-50 !border-green-200 !text-green-800",
              info:    "!bg-blue-50 !border-blue-200 !text-blue-800",
            },
          }}
        />
      </body>
    </html>
  );
}
