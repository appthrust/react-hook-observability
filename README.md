<p align="center">
    <h1 align="center">react-hook-observability</h1>
</p>

## About

**react-hook-observability** includes multiple libraries that provide Observability as React Hooks in React.

| Library Name                                                                                  | Description                                                                     | README                                               | NPM                                                                                                                                                                                                                 |
| :-------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------ | :--------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [@react-hook-observability/hooks](./packages/hooks/README.md)                                 | Provides Observability as React Hooks in React.                                 | [README](./packages/hooks/README.md)                 | [![npm version](https://img.shields.io/npm/v/@react-hook-observability/hooks.svg?style=for-the-badge&labelColor=000000)](https://www.npmjs.com/package/@react-hook-observability/hooks)                             |
| [@react-hook-observability/nextjs-hooks](./packages/nextjs-hooks/README.md)                   | Provides Observability as React Hooks in React and this is specific to Next.js. | [README](./packages/nextjs-hooks/README.md)          | [![npm version](https://img.shields.io/npm/v/@react-hook-observability/nextjs-hooks?style=for-the-badge&labelColor=000000)](https://www.npmjs.com/package/@react-hook-observability/nextjs-hooks)                   |
| [@react-hook-observability/nextjs-server-actions](./packages/nextjs-server-actions/README.md) | Provides ServerActions for Next.js.                                             | [README](./packages/nextjs-server-actions/README.md) | [![npm version](https://img.shields.io/npm/v/@react-hook-observability/nextjs-server-actions?style=for-the-badge&labelColor=000000)](https://www.npmjs.com/package/@react-hook-observability/nextjs-server-actions) |

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