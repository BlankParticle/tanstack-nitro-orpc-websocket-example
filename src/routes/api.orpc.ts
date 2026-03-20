import { experimental_RPCHandler as RPCHandler } from "@orpc/server/crossws";
import { createFileRoute } from "@tanstack/react-router";
import router from "#/orpc/router";
import { onError } from "@orpc/server";
import { NitroWebSocketResponse } from "#/lib/nitro-ws-response.ts";

const handler = new RPCHandler(router, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

export const Route = createFileRoute("/api/orpc")({
  server: {
    handlers: {
      ANY: ({ context }) =>
        new NitroWebSocketResponse({
          message: (peer, message) => handler.message(peer, message, { context }),
          close: (peer) => handler.close(peer),
        }),
    },
  },
});
