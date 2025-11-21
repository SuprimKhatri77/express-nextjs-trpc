// import jwt from "jsonwebtoken";
export const createContext = ({ req, res }) => {
    // This runs on EVERY request before any procedure
    // 1. Extract token from headers
    const token = req.headers.authorization?.replace("Bearer ", "");
    // 2. Verify and decode token
    let userId;
    if (token) {
        try {
            const decoded = jwt.verify(token, "your-secret");
            userId = decoded.userId;
        }
        catch (error) {
            // Token invalid, userId stays undefined
        }
    }
    // 3. Return context object (available in all procedures)
    return {
        req,
        res,
        userId,
        // You can add anything here:
        // db: prisma,
        // redis: redisClient,
        // whatever you need!
    };
};
