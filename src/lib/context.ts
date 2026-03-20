export type RequestContext = {
  server: string;
};

export const createContext = (): RequestContext => {
  return {
    server: "node-nitro",
  };
};
