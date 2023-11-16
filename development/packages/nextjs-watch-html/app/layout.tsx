"use client";

import { useBrowserEventSpans } from "#hooks";
import { exportOtlpReceiver } from "#nextServerActions";
import { useServerActionExporter } from "#nextHooks";
import { ReadableSpan } from "@opentelemetry/sdk-trace-web";
import "./globals.css";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { TraceState } from "@opentelemetry/core";

const inter = Inter({ subsets: ["latin"] });

interface TekitoSpan {}

export default function RootLayout() {
  // 1. get browser event spans
  const { watchRef, spans, setSpans } = useBrowserEventSpans({
    eventKinds: ["click"],
    batchConfig: {
      scheduledDelayMillis: 1000,
    },
  });
  // 2. prepare elements to show spans
  const [spanElements, setSpanElements] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const elements: JSX.Element[] = [];
    // 3. convert spans to elements
    elements.push(
      ...spans.map((span, index) => {
        return (
          <div
            key={index}
            className={`
            flex flex-row items-center justify-center
            transition-opacity duration-1000
            select-none
          `}
          >
            <p>{span.name}</p>
          </div>
        );
      })
    );
    setSpanElements(elements);
    return () => {};
  }, [spans]);

  useServerActionExport({
    spans,
    convertToStringifySpan: convertToBrowserSpan,
    serverAction: exportOtlp,
    postServerAction: ({ data, serverError, validationError }) => {
      if (serverError) {
        console.log("server error");
        console.log(serverError);
        return;
      }
      if (validationError) {
        console.log("validation error");
        console.log(validationError);
        return;
      }
      console.log("data");
      console.log(data);
      setSpans([]);
      setSpans([]);
    },
    intervalDuration: 1000,
  });
  return (
    <html lang="en" ref={watchRef}>
      <body className={inter.className}>
        <main
          className={`
          flex flex-col items-center justify-center
          w-screen
          4xl:px-24 2xl:px-16 xl:px-12 lg:px-8 md:px-6 sm:px-4 px-2
          4xl:py-8 2xl:py-6 xl:py-4 lg:py-3 md:py-2 sm:py-2 py-2
        `}
        >
          <div
            className={`
            absolute top-0
          `}
          >
            {/* 5. show span elements */}
            {spanElements}
          </div>
          <div
            className={`
              flex flex-row items-center justify-center
              w-screen h-screen
              4xl:px-24 2xl:px-16 xl:px-12 lg:px-8 md:px-6 sm:px-4 px-2
              4xl:py-12 2xl:py-8 xl:py-6 lg:py-4 md:py-3 sm:py-2 py-1
              select-none
            `}
          >
            Click anywhere in page
          </div>
        </main>
      </body>
    </html>
  );
}
