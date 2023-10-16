import { ReadableSpan, WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { useEffect, Dispatch, SetStateAction } from "react";

interface useClientConsoleExporterOptions {
  spans: ReadableSpan[];
  resetSpans: () => void;
  intervalDuration?: number;
}

const useClientConsoleExporter = ({
  spans,
  resetSpans,
  intervalDuration = 500,
}: useClientConsoleExporterOptions) => {
  useEffect(() => {
    const interval = setInterval(() => {
      if (spans.length === 0) {
        return;
      }
      spans.forEach((span) => {
        console.log(span);
      });
      resetSpans();
    }, intervalDuration);
    return () => clearInterval(interval);
  });
};

export default useClientConsoleExporter;
