"use client";

import { ExportResult } from "@opentelemetry/core";
import { ReadableSpan, SpanExporter } from "@opentelemetry/sdk-trace-web";
import { Dispatch, SetStateAction } from "react";

export default class SetSpansExporter implements SpanExporter {
  _is_shutdown: boolean = false;
  _setSpans: Dispatch<SetStateAction<ReadableSpan[]>>;
  constructor({
    setSpans,
  }: {
    setSpans: Dispatch<SetStateAction<ReadableSpan[]>>;
  }) {
    this._setSpans = setSpans;
  }

  export(
    spans: ReadableSpan[],
    resultCallback: (result: ExportResult) => void
  ): void {
    if (this._is_shutdown) {
      console.log("already shutdown");
      return;
    }
    this._setSpans(spans);
    resultCallback({ code: 0 });
  }
  shutdown(): Promise<void> {
    this._is_shutdown = true;
    return Promise.resolve();
  }
  forceFlush?(): Promise<void> {
    return Promise.resolve();
  }
}
