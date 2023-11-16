# exportOtlp


`exportOtlp` contains ServerAction for sending data in OTLP format.

## Usage

### useServerActionExport by @react-hook-observability/nextjs-hooks + exportOtlp

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Setup Interactor and return following properties.
  const { spans, setSpans } = ...;

  // 2. Setup Exporter.
  useServerActionExport({
  spans,
  convertToStringifySpan: convertToBrowserSpan,
  serverAction: exportOtlp,
  postServerAction: ({ data, serverError, validationError }) => {
    if (serverError) {
      console.log("server error");
      console.log(serverError);
      return;
    }
    if (validationError) {
      console.log("validation error");
      console.log(validationError);
      return;
    }
    console.log("data");
    console.log(data);
    setSpans([]);
    setSpans([]);
  },
  intervalDuration: 1000,
});
}
```