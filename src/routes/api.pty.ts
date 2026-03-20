import { NitroWebSocketResponse } from "#/lib/nitro-ws-response.ts";
import { createFileRoute } from "@tanstack/react-router";
import pty from "node-pty";

const PTY_MAP = new Map<string, pty.IPty>();

export const Route = createFileRoute("/api/pty")({
  server: {
    handlers: {
      GET: () =>
        new NitroWebSocketResponse({
          open(peer) {
            const shell = process.env.SHELL || "/bin/zsh";
            const proc = pty.spawn(shell, [], {
              name: "xterm-256color",
              cols: 80,
              rows: 30,
              cwd: process.cwd(),
              env: process.env,
            });
            PTY_MAP.set(peer.id, proc);
            proc.onData((data) => peer.send(data));
            proc.onExit(() => {
              PTY_MAP.delete(peer.id);
              peer.close(1001, "Process exited");
            });
          },
          message(peer, message) {
            const proc = PTY_MAP.get(peer.id);
            if (proc) proc.write(message.text());
          },
          close(peer) {
            const proc = PTY_MAP.get(peer.id);
            if (proc) proc.kill();
            PTY_MAP.delete(peer.id);
          },
        }),
    },
  },
});
