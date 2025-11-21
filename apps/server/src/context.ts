import { auth } from "./lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { db } from "./db";
import type { Request, Response } from "express";

export interface AppContext {
  req: Request;
  res: Response;
  userId: string | undefined;
  db: typeof db;
  setHeader: (name: string, value: string | string[]) => void;
  getHeader: (name: string) => string | string[] | undefined;
}

export const createContext = async ({
  req,
  res,
}: CreateExpressContextOptions): Promise<AppContext> => {
  const headers = fromNodeHeaders(req.headers);
  let userId: string | undefined;

  try {
    const session = await auth.api.getSession({
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
    db,
    setHeader: (name: string, value: string | string[]) => {
      res.setHeader(name, value);
    },
    getHeader: (name: string) => {
      return req.headers[name.toLowerCase()];
    },
  };
};

export type Context = AppContext;
