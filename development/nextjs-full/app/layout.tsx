"use client";

import { useBrowserEventSpans } from "@react-hook-observability/hooks";
import "./globals.css";
import { Inter } from "next/font/google";
import { useClientConsoleExporter } from "@react-hook-observability/hooks";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { watchRef, spans, resetSpans } = useBrowserEventSpans({
    eventKinds: ["click"],
    batchConfig: {
      scheduledDelayMillis: 100,
    },
  });
  useClientConsoleExporter({ spans, resetSpans, intervalDuration: 100 });
  return (
    <html lang="en" ref={watchRef}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
