import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { Providers } from "@/components/Providers";

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
      <body className="antialiased">
        <Providers>
          <Header />
          <main id="main-content" className="pt-[104px]">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
