<p align="center">
    <h1 align="center">react-hook-observability</h1>
</p>

## About

**react-hook-observability** is a library that provides Observability as React Hooks in React.

**react-hook-observability** provides the following React Hooks.

| Hook Name                | Description                              | README                                                                           |
| :----------------------- | :--------------------------------------- | :------------------------------------------------------------------------------- |
| `useBrowserEventSpans`   | Get spans when web browser event occurs. | [useBrowserEventSpans](./packages/hooks/use-browser-event-spans/README.md)       |
| `useClientConsoleTracer` | Get tracer in web browser console.       | [useClientConsoleTracer](./packages/hooks/use-client-console-exporter/README.md) |

## Getting Started

Install the library.

### npm

```bash
npm install react-hook-observability
```

### yarn

```bash
yarn add react-hook-observability
```

### pnpm

```bash
pnpm add react-hook-observability
```

### bun

```bash
bun add react-hook-observability
```

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
