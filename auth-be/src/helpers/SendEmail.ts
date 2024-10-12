import nodemailer from "nodemailer"
import { envVariables } from "../config/envLoader";

export async function sendMail(email: string, otp: string, username: string) {
    try {
        // Create a transporter
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: envVariables.emailSender,
                pass: envVariables.emailPassword,
            },
        });
        const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>New Post Notification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                background-color: #f4f4f4;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: auto;
                background: white;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: #0073e6;
                color: white;
                padding: 10px 0;
                text-align: center;
                border-radius: 10px 10px 0 0;
            }
            .content {
                padding: 20px;
                text-align: center;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                margin: 20px 0;
                background: #0073e6;
                color: white;
                text-decoration: none;
                border-radius: 5px;
            }
            .footer {
                text-align: center;
                margin-top: 20px;
                font-size: 0.8em;
                color: #777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="content">
                <p>Hey there,</p>
                <p>The otp is ${otp}, use it to register.</p>
            </div>
        </div>
    </body>
    </html>
    `;

        // Setup email data
        let mailOptions = {
            from: process.env.SENDER,
            to: email,
            subject: 'OTP Verification',
            html: htmlContent,
        };


        transporter.sendMail(mailOptions, (error, _) => {
            if (error) {
                return console.log(error);
            }
        });
    } catch (err) {
        console.log(err)
    }
}
