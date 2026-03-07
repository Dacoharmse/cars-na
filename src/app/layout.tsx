import type { Metadata } from "next";
import { DM_Sans, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Providers } from "@/components/Providers";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["200", "400", "600", "700", "800"],
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
      <body className={`${dmSans.variable} ${bricolage.variable} antialiased`}>
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
