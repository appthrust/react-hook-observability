"use client";

import { ReadableSpan } from "@opentelemetry/sdk-trace-web";
import { useEffect } from "react";

interface useServerActionsExporterOptions<BS, SAR> {
  spans: ReadableSpan[];
  convertToStringifySpan: (span: ReadableSpan) => BS;
  serverAction: (spans: BS[]) => Promise<SAR>;
  postServerAction: (serverActionResponse: SAR) => void;
  intervalDuration?: number;
}

export function useServerActionExporter<BS, SAR>({
  spans,
  convertToStringifySpan,
  serverAction,
  postServerAction,
  intervalDuration = 1000,
}: useServerActionsExporterOptions<BS, SAR>) {
  useEffect(() => {
    const interval = setInterval(() => {
      if (spans.length === 0) {
        return;
      }
      const stringifySpans = spans.map(convertToStringifySpan);
      serverAction(stringifySpans).then(postServerAction);
    }, intervalDuration);
    return () => clearInterval(interval);
  });
}
