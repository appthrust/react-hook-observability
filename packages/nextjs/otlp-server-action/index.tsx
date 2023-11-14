"use server";
import { z } from "zod";
import { ReadableSpan } from "@opentelemetry/sdk-trace-web";
import { SpanContext } from "@opentelemetry/api";
import { ExportResult } from "@opentelemetry/core";
import { IResource } from "@opentelemetry/resources";
import { createSafeActionClient } from "next-safe-action";

interface WithSpanContext {
  spanContext: SpanContext;
}

interface BrowserSpan
  extends Omit<ReadableSpan, "spanContext" | "resource">,
    WithSpanContext {}

const BrowserSpan: z.ZodType<BrowserSpan> = z.any();

const schema = BrowserSpan.array();

const action = createSafeActionClient();

const otlpServerAction = action(schema, async (spans) => {
  "use server";
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
        attributes: {},
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

export default otlpServerAction;
