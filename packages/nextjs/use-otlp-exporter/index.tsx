"use client";

import { ReadableSpan } from "@opentelemetry/sdk-trace-web";
import otlpServerAction from "../otlp-server-action";
import { useServerActionExporter } from "../use-server-actions-exporter";

interface useOtlpExproterConfig {
  setSpans: (spans: ReadableSpan[]) => void;
  spans: ReadableSpan[];
  intervalDuration?: number;
}

export default function useOtlpExporter({
  spans,
  setSpans,
  intervalDuration = 1000,
}: useOtlpExproterConfig) {
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
    intervalDuration,
  });
}
