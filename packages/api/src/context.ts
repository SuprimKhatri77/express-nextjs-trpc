import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { Request, Response } from "express";

export interface AppContext {
  req: Request;
  res: Response;
  userId: string | undefined;
  db: any;
  setHeader: (name: string, value: string | string[]) => void;
  getHeader: (name: string) => string | string[] | undefined;
}

export const createContextFactory = (deps: {
  db: any;
  auth: any;
  fromNodeHeaders: any;
}) => {
  return async ({
    req,
    res,
  }: CreateExpressContextOptions): Promise<AppContext> => {
    const headers = deps.fromNodeHeaders(req.headers);
    let userId: string | undefined;

    try {
      const session = await deps.auth.api.getSession({
        headers,
      });
      if (session) {
        userId = session.user.id;
      }
    } catch (error) {
      console.log("error: ", error);
    }

    return {
      req,
      res,
      userId,
      db: deps.db,
      setHeader: (name: string, value: string | string[]) => {
        res.setHeader(name, value);
      },
      getHeader: (name: string) => {
        return req.headers[name.toLowerCase()];
      },
    };
  };
};

export type Context = AppContext;
