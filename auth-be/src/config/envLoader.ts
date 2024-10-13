import { configDotenv } from "dotenv";

configDotenv();

const envVariables = {
    corsOrigin: process.env.CORS_ORIGIN,
    port: process.env.PORT,
    emailSender: process.env.SENDER,
    emailPassword: process.env.EMAIL_PASSWORD,
    accessTokenSecret: process.env.ACCESSTOKENSECRET,
    refreshTokenSecret: process.env.REFRESHTOKENSECRET,
    accessTokenExpiry: process.env.ACCESSTOKENEXPIRY,
    refreshTokenExpiry: process.env.REFRESHTOKENEXPIRY,
}

export { envVariables }
