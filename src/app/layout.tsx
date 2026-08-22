import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AppShell, StoreHydration } from "@/components/shell/app-shell";
import { ServiceWorkerRegistration } from "@/components/service-worker";
import { FeedbackProvider } from "@/components/feedback";
import { CustomCursor } from "@/components/custom-cursor";
import { ContextMenu } from "@/components/context-menu";
import "./globals.css";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "MakeSense | Business Model Simulator",
    template: "%s | MakeSense",
  },
  description:
    "Model revenue, costs, cash flow, tax and financing for your business. Runs entirely on your device.",
  applicationName: "MakeSense",
  openGraph: {
    siteName: "MakeSense",
    type: "website",
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
        <CustomCursor />
        <ContextMenu />
      </body>
    </html>
  );
}
