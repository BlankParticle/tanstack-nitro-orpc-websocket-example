import { createRouterClient } from "@orpc/server";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/websocket";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { createIsomorphicFn } from "@tanstack/react-start";
import type { RouterClient } from "@orpc/server";
import router from "#/orpc/router";
import { createContext } from "#/lib/context.ts";

const getORPCClient = createIsomorphicFn()
  .server(() =>
    createRouterClient(router, {
      // Tanstack doesn't currently provide any helper function to access the request context
      // thus this, I will make an issue about this to make this easier
      context: () => ({
        headers: getRequestHeaders(),
        ...createContext(),
      }),
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

export const client: RouterClient<typeof router> = getORPCClient();

export const orpc = createTanstackQueryUtils(client);
