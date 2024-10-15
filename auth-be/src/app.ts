import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { envVariables } from "./config/envLoader";

const app = express();

app.use(
    cors({
        origin: envVariables.corsOrigin,
        credentials: true,
    })
);

app.use(
    express.json({
        limit: "16kb",
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "16kb",
    })
);

app.use(express.static("public"));
app.use(cookieParser());


import { userRouter } from "./routers/user.router";
app.use("/api/v1/user", userRouter);

import { tweetRouter } from "./routers/tweet.router";
app.use("/api/v1/tweet", tweetRouter);


import { repostRouter } from "./routers/repost.router";
app.use("/api/v1/repost", repostRouter);

import { replyRouter } from "./routers/reply.router";
app.use("/api/v1/reply", replyRouter);

export {
    app
}
