import * as schema from "./schema";
declare const sql: import("@neondatabase/serverless").NeonQueryFunction<false, false>;
export declare const db: import("drizzle-orm/neon-http").NeonHttpDatabase<typeof schema> & {
    $client: import("@neondatabase/serverless").NeonQueryFunction<false, false>;
};
export { sql };
//# sourceMappingURL=index.d.ts.map