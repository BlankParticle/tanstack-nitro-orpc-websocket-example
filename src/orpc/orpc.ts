import type { RequestContext } from "#/lib/context.ts";
import { os as osBase } from "@orpc/server";

export const os = osBase.$context<RequestContext>();
