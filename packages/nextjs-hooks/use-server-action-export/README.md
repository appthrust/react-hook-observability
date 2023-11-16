# useServerActionExport

`useServerActionExport` is a hook that exports spans to server using server actions.

## Usage

### export to console log.

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
        convertToStringifySpan: (span) => JSON.stringify({ name: span.name }: { name: string }),
        serverAction: async (spans: { name: string }[]) => {
            console.log(spans);
        },
        postServerAction: () => {
            setSpans([]);
        },
        intervalDuration: 1000,
    });
}
```