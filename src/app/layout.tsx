import "./globals.css";
import "@/styles/globals.scss";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import Script from "next/script";
import { ThemeProvider } from "@mui/material/styles";
import { muiTheme } from "@/theme/mui-theme";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  axes: ["opsz"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "esenton - studio interaktywne | Strony internetowe i aplikacje webowe",
  description:
    "Tworzymy strony internetowe, aplikacje webowe, sklepy WooCommerce, systemy CRM/ERP, integracje API i dedykowane oprogramowanie dla firm.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Script
          id="cookieyes"
          src="https://cdn-cookieyes.com/client_data/07f615b71c43be541676d20952660c06/script.js"
          strategy="beforeInteractive"
        />
        <AppRouterCacheProvider options={{ key: "mui" }}>
          <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
