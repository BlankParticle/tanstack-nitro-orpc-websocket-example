import handler from "@tanstack/react-start/server-entry";
import { type RequestContext } from "./lib/context";

declare module "@tanstack/react-start" {
  interface Register {
    server: {
      requestContext: RequestContext;
    };
  }
}

export default {
  fetch(request: Request) {
    return handler.fetch(request, {
      context: {
        server: "node-nitro",
      },
    });
  },
};
