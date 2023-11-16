import { z } from "zod";
import { ReadableSpan } from "@opentelemetry/sdk-trace-web";
import { Attributes, SpanContext } from "@opentelemetry/api";
import { ExportResult } from "@opentelemetry/core";
import { IResource } from "@opentelemetry/resources";
import { createSafeActionClient } from "next-safe-action";
import "server-only";

interface WithSpanContext {
  spanContext: SpanContext;
}

interface WithResourceAttributes {
  resourceAttributes: Attributes;
}

interface BrowserSpan
  extends Omit<ReadableSpan, "spanContext" | "resource">,
    WithSpanContext,
    WithResourceAttributes {}

const BrowserSpan: z.ZodType<BrowserSpan> = z.any();

const schema = BrowserSpan.array();

const action = createSafeActionClient();

export const convertToBrowserSpan = (span: ReadableSpan): BrowserSpan => {
  const spanContext = span.spanContext();
  return {
    name: span.name,
    kind: span.kind,
    resourceAttributes: span.resource.attributes,
    parentSpanId: span.parentSpanId ?? "",
    startTime: span.startTime,
    endTime: span.endTime,
    status: span.status,
    attributes: span.attributes,
    links: span.links,
    events: span.events,
    duration: span.duration,
    ended: span.ended,
    instrumentationLibrary: {
      name: span.instrumentationLibrary.name,
      schemaUrl: span.instrumentationLibrary.schemaUrl ?? "",
      version: span.instrumentationLibrary.version ?? "",
    },
    droppedAttributesCount: span.droppedAttributesCount,
    droppedEventsCount: span.droppedEventsCount,
    droppedLinksCount: span.droppedLinksCount,
    spanContext: {
      spanId: spanContext.spanId,
      traceId: spanContext.traceId,
      traceFlags: spanContext.traceFlags,
    },
  };
};

export const exportOtlp = action(schema, async (spans) => {
  const {
    OTLPTraceExporter,
  } = require("@opentelemetry/exporter-trace-otlp-grpc");

  const tracesProcessor = new OTLPTraceExporter({
    url: process.env.RHO_OTLP_RECEIVER_URL,
  });
  let newSpans = spans.map((span) => {
    const readableSpan: ReadableSpan = {
      ...span,
      resource: {
        attributes: span.resourceAttributes,
        merge: function (_: IResource | null): IResource {
          throw new Error("Function not implemented.");
        },
      },
      spanContext: () => {
        return {
          traceId: span.spanContext.traceId,
          spanId: span.spanContext.spanId,
          traceFlags: span.spanContext.traceFlags,
          traceState: span.spanContext.traceState,
        };
      },
    };
    return readableSpan;
  });
  const exportTraces = (newSpans: ReadableSpan[]): Promise<ExportResult> => {
    return new Promise((resolve, reject) => {
      tracesProcessor.export(newSpans, (result: ExportResult) => {
        if (result.error) {
          reject(result.error);
        } else {
          resolve(result);
        }
      });
    });
  };

  const result = await exportTraces(newSpans);
  if (result.code !== 0) {
    return "failed to export";
  } else {
    return "success";
  }
});
