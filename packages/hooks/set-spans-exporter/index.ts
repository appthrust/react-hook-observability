"use client";

import { ExportResult } from "@opentelemetry/core";
import { ReadableSpan, SpanExporter } from "@opentelemetry/sdk-trace-web";
import { Dispatch, SetStateAction } from "react";

interface SetSpansExporterConfig {
  setSpans: Dispatch<SetStateAction<ReadableSpan[]>>;
}

export default class SetSpansExporter implements SpanExporter {
  _is_shutdown: boolean = false;
  _setSpans: Dispatch<SetStateAction<ReadableSpan[]>>;
  constructor({ setSpans }: SetSpansExporterConfig) {
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
    this._setSpans((current) => [...current, ...spans]);
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
