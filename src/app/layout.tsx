import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ApolloClientProvider from "@/components/ApolloClientProvider";
import { getClient } from "@/lib/apollo-client";
import { GET_GLOBAL_SETTINGS } from "@/lib/queries";

export const metadata: Metadata = {
  title: {
    default: "CyberCore Gear — Premium Mechanical Keyboards",
    template: "%s | CyberCore Gear",
  },
  description:
    "Teclados mecánicos personalizados de alta gama. Descubre switches, layouts y keycaps premium para tu setup definitivo.",
  keywords: ["teclados mecánicos", "mechanical keyboards", "custom keyboard", "gaming keyboard", "switches"],
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "CyberCore Gear",
    title: "CyberCore Gear — Premium Mechanical Keyboards",
    description: "Teclados mecánicos personalizados de alta gama.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let promos: string[] | undefined = undefined;
  let siteLogo: string | undefined = undefined;

  try {
    interface GlobalSettingsData {
      siteLogo?: string;
      themeOptions?: {
        promo1?: string;
        promo2?: string;
        promo3?: string;
        heroSlides?: any[];
      };
    }

    const client = await getClient();
    const { data } = await client.query<GlobalSettingsData>({
      query: GET_GLOBAL_SETTINGS,
    });

    // Extract promos
    if (data?.themeOptions) {
      promos = [
        data.themeOptions.promo1,
        data.themeOptions.promo2,
        data.themeOptions.promo3,
      ].filter(Boolean) as string[];
    }

    // Extract logo
    if (data?.siteLogo) {
      siteLogo = data.siteLogo;
    }
  } catch (e) {
    console.error("Error fetching global settings:", e);
  }

  return (
    <html lang="es-MX" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-white text-ccg-text">
        <ApolloClientProvider>
          <Navbar promos={promos?.length ? promos : undefined} logo={siteLogo} />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </ApolloClientProvider>
      </body>
    </html>
  );
}
