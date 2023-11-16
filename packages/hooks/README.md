<p align="center">
    <h1 align="center">@react-hook-observability/hooks</h1>
</p>

<p align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/next">
    <img alt="" src="https://img.shields.io/npm/v/@react-hook-observability/hooks.svg?style=for-the-badge&labelColor=000000">
  </a>
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
npm install @react-hook-observability/hooks
```

### yarn

```bash
yarn add @react-hook-observability/hooks
```

### pnpm

```bash
pnpm add @react-hook-observability/hooks
```

### bun

```bash
bun add @react-hook-observability/hooks
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

## Contributing

see [CONTRIBUTING.md](./CONTRIBUTING.md)