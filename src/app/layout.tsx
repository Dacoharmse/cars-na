import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Providers } from "@/components/Providers";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Cars.na - Buy and Sell Cars in Namibia",
  description: "Find your perfect car in Namibia. Browse thousands of new and used vehicles from trusted dealers across the country.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.variable} ${outfit.variable} ${instrumentSerif.variable} antialiased`}>
        <Providers>
          <Header />
          <main id="main-content" className="pt-[40px]">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
