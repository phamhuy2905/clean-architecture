import authRouter from "./auth.router";
import userRouter from "./user.router";

const appRouter = {
    auth: authRouter,
    user: userRouter
};

export default appRouter;
