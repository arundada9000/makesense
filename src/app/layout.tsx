import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AppShell, StoreHydration } from "@/components/shell/app-shell";
import { ServiceWorkerRegistration } from "@/components/service-worker";
import { FeedbackProvider } from "@/components/feedback";
import { CustomCursor } from "@/components/custom-cursor";
import { ContextMenu } from "@/components/context-menu";
import { ScrollToTop } from "@/components/site/scroll-to-top";
import "./globals.css";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const SITE_URL = "https://makesensebusiness.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Free Business & Personal Finance Calculators | MakeSense",
    template: "%s | MakeSense",
  },
  description:
    "Free calculators for business and everyday money: startup runway, revenue projection, profitability, LTV:CAC, break-even, salary, savings goals and more. Every formula explained with worked examples. Runs entirely on your device.",
  applicationName: "MakeSense",
  authors: [{ name: "Arun Neupane", url: "https://arunneupane.vercel.app" }],
  creator: "Arun Neupane",
  publisher: "MakeSense",
  keywords: [
    "business calculator",
    "startup runway calculator",
    "revenue projection calculator",
    "profitability calculator",
    "ltv cac calculator",
    "break-even calculator",
    "personal finance calculator",
    "salary calculator",
    "savings goal calculator",
    "income vs expenses calculator",
    "emergency fund calculator",
    "business model simulator",
    "startup financial modeling",
    "free online business calculator",
    "small business calculator",
    "startup metrics calculator",
  ],
  category: "business",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    siteName: "MakeSense",
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "Free Business & Personal Finance Calculators | MakeSense",
    description:
      "Free calculators for business and everyday money: startup runway, revenue projection, profitability, LTV:CAC, break-even, salary, savings goals and more, with formulas explained.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Business & Personal Finance Calculators | MakeSense",
    description:
      "Free calculators for business and everyday money, formulas explained and run entirely on your device.",
    creator: "@arunneupane",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "y_iQncnrIS7Nycs-SFAgvF9aPPyozMkTeJhrDnmS2R0",
  },
  other: {
    "google-adsense-account": "ca-pub-1708134460872611",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0d10" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="apple-light"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <ThemeProvider>
          <FeedbackProvider>
            <StoreHydration>
              <AppShell>{children}</AppShell>
            </StoreHydration>
          </FeedbackProvider>
        </ThemeProvider>
        <ServiceWorkerRegistration />
        <ScrollToTop />
        <CustomCursor />
        <ContextMenu />
      </body>
    </html>
  );
}