import { configDotenv } from "dotenv";

configDotenv();

const envVariables = {
    corsOrigin: process.env.CORS_ORIGIN,
    port: process.env.PORT,
    emailSender: process.env.SENDER,
    emailPassword: process.env.EMAIL_PASSWORD
}

export { envVariables }
