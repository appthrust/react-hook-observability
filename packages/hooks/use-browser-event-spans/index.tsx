import { useEffect, useRef, useState } from "react";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import {
  WebTracerProvider,
  ReadableSpan,
  BatchSpanProcessor,
  BufferConfig,
} from "@opentelemetry/sdk-trace-web";
import { Resource } from "@opentelemetry/resources";
import SetSpansExporter from "../set-spans-exporter";

interface useBrowserEventSpansOptions {
  batchConfig?: BufferConfig;
  eventKinds?: (keyof HTMLElementEventMap)[];
  tracerName?: string;
}

const useBrowserEventSpans = ({
  batchConfig = {},
  eventKinds = [],
  tracerName = "browser-event-tracer",
}: useBrowserEventSpansOptions) => {
  const watchRef = useRef<HTMLElement>(null);
  const [spans, setSpans] = useState<ReadableSpan[]>([]);

  useEffect(() => {
    let watchElement = watchRef.current;
    if (watchElement === null) {
      return;
    }

    let resource = new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]:
        "@opentelemetry/react-hook-obsevability/useBrowserEventSpans",
    });

    let newProvider = new WebTracerProvider({ resource });

    const newExporter = new SetSpansExporter({ setSpans });
    newProvider.addSpanProcessor(
      new BatchSpanProcessor(newExporter, batchConfig)
    );

    newProvider.register({});
    const listener = (e: Event) => {
      let tracer = newProvider.getTracer(tracerName);
      let span = tracer.startSpan(e.type);
      let target = e.target as HTMLElement;
      let xpath = getXpath(target);
      span.setAttributes({
        "element.id": target.id,
        "element.class": target.className,
        "element.tag": target.tagName,
        "element.xpath": xpath,
      });
      span.end();
    };
    const addListener = (eventKind: keyof HTMLElementEventMap) => {
      watchElement?.addEventListener(eventKind, listener);
    };
    eventKinds.forEach(addListener);

    return () => {
      newProvider.shutdown().then(() => {
        const removeListener = (eventKind: keyof HTMLElementEventMap) => {
          watchElement?.removeEventListener(eventKind, listener);
        };
        eventKinds.forEach(removeListener);
      });
    };
  }, [batchConfig, eventKinds, tracerName]);

  return { watchRef, spans, setSpans };
};

function getXpath(element: HTMLElement): string {
  return _getXpath("", element).toLowerCase();
}

function _getXpath(s: string, element: HTMLElement): string {
  if (element.tagName === "HTML") {
    return "//html" + s;
  } else {
    return _getXpath(
      "/" + element.tagName + s,
      element.parentElement as HTMLElement
    );
  }
}

export default useBrowserEventSpans;
