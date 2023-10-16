# useBrowserEventSpans

en: `useBrowserEventSpans` is a hook that returns spans when a web browser event occurs.

## Usage

### useBrowserEventSpans + useClientConsoleExporter

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Setup Interactor and return following properties.
  // - watchRef: <html> tag ref
  // - spans: trace spans
  // - resetSpans: reset trace spans
  const { watchRef, spans, resetSpans } = useBrowserEventSpans({
    eventKinds: ["click"],
    batchConfig: {
      scheduledDelayMillis: 100,
    },
  });
  // 2. Setup Exporter. In this case, useClientConsoleExporter.
  useClientConsoleExporter({ spans, resetSpans, intervalDuration: 100 });
  // 3. Rendering html tag with watchRef.
  return (
    <html lang="en" ref={watchRef}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```
