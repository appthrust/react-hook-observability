"use client";

import { useBrowserEventSpans } from "#hooks";
import { otlpServerAction, useServerActionExporter } from "#nextHooks";
import "./globals.css";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

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

  useServerActionExporter({
    spans,
    serverAction: otlpServerAction,
    convertToStringifySpan: (span) => {
      return {
        name: span.name,
        kind: span.kind,
        parentSpanId: span.parentSpanId,
        startTime: span.startTime,
        endTime: span.endTime,
        status: span.status,
        attributes: span.attributes,
        links: span.links,
        events: span.events,
        duration: span.duration,
        ended: span.ended,
        instrumentationLibrary: span.instrumentationLibrary,
        droppedAttributesCount: span.droppedAttributesCount,
        droppedEventsCount: span.droppedEventsCount,
        droppedLinksCount: span.droppedLinksCount,
        spanContext: span.spanContext(),
      };
    },
    postServerAction: ({ data, serverError, validationError }) => {
      if (serverError) {
        console.log(serverError);
        return;
      }
      if (validationError) {
        console.log(validationError);
        return;
      }
      console.log(data);
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
