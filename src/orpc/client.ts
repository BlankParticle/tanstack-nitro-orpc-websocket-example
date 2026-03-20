import { createRouterClient } from "@orpc/server";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/websocket";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { createIsomorphicFn, getGlobalStartContext } from "@tanstack/react-start";
import type { RouterClient } from "@orpc/server";
import router from "#/orpc/router";

const getORPCClient = createIsomorphicFn()
  .server(
    (): RouterClient<typeof router> =>
      createRouterClient(router, {
        context: () => {
          const context = getGlobalStartContext();
          if (!context) throw new Error("No context found for the request");
          return {
            headers: getRequestHeaders(),
            ...context,
          };
        },
      }),
  )
  .client((): RouterClient<typeof router> => {
    // TODO: Use partysocket's reconnecting websocket client to auto reconnect
    // https://orpc.dev/docs/adapters/websocket
    // https://www.npmjs.com/package/partysocket#usage
    const websocket = new WebSocket(`ws://${window.location.host}/api/orpc`);
    const link = new RPCLink({ websocket });
    return createORPCClient(link);
  });

export const client = getORPCClient();

export const orpc = createTanstackQueryUtils(client);
