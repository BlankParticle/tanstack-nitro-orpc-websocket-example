import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

export const Route = createFileRoute("/terminal")({
  ssr: false,
  component: TerminalPage,
});

function TerminalPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      theme: {
        background: "#1e1e1e",
        foreground: "#d4d4d4",
      },
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(el);
    fitAddon.fit();

    const ws = new WebSocket(`ws://${window.location.host}/api/pty`);

    ws.onopen = () => {
      term.onData((data) => ws.send(data));
      term.onResize(({ cols, rows }) => {
        ws.send(JSON.stringify({ type: "resize", cols, rows }));
      });
    };

    ws.onmessage = (e) => {
      term.write(e.data);
    };

    ws.onclose = () => {
      term.write("\r\n\x1b[90m[connection closed]\x1b[0m\r\n");
    };

    const onResize = () => fitAddon.fit();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ws.close();
      term.dispose();
    };
  }, []);

  return (
    <main className="page-wrap flex flex-col h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Terminal</h1>
      <div ref={containerRef} className="flex-1 rounded overflow-hidden" />
    </main>
  );
}
