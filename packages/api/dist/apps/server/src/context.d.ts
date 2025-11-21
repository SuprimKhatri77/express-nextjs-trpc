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
export declare const createContext: ({ req, res, }: CreateExpressContextOptions) => Promise<AppContext>;
export type Context = AppContext;
//# sourceMappingURL=context.d.ts.map