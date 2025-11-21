import { auth } from "./lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { db } from "./db";
export const createContext = async ({ req, res, }) => {
    // console.log("incoming request");
    const headers = fromNodeHeaders(req.headers);
    // console.log("headers from request: ", headers);
    let userId;
    try {
        const session = await auth.api.getSession({
            headers,
        });
        if (session) {
            userId = session.user.id;
        }
    }
    catch (error) {
        console.log("error: ", error);
    }
    return {
        req,
        res,
        userId,
        db,
        setHeader: (name, value) => {
            res.setHeader(name, value);
        },
        getHeader: (name) => {
            return req.headers[name.toLowerCase()];
        },
    };
};
