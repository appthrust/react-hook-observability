import { ReadableSpan } from "@opentelemetry/sdk-trace-web";
import { useEffect } from "react";

interface useServerActionsExportOptions<BS, SAR> {
  spans: ReadableSpan[];
  convertToStringifySpan: (span: ReadableSpan) => BS;
  serverAction: (spans: BS[]) => Promise<SAR>;
  postServerAction: (serverActionResponse: SAR) => void;
  intervalDuration?: number;
}

export default function useServerActionExport<BS, SAR>({
  spans,
  convertToStringifySpan,
  serverAction,
  postServerAction,
  intervalDuration = 1000,
}: useServerActionsExportOptions<BS, SAR>) {
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
