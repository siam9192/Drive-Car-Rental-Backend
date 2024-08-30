import config from '../config';
import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: config.app_user_name,
      pass: config.app_pass_key,
    },
  });


const accountRecoverMailHtml = (data:{name:string,otp:string}) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your One-Time Password (OTP)</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            color: #333;
        }
        .otp-code {
            font-size: 24px;
            font-weight: bold;
            color: #4CAF50;
            text-align: center;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            font-size: 14px;
            color: #777;
            margin-top: 20px;
        }
        .footer a {
            color: #007BFF;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Recover your account</h1>
        </div>
        <p>Hi ${data.name},</p>
        <p>We received a request to recover  your account. To complete this process, please use the One-Time Password (OTP) provided below.</p>
        <div class="otp-code">
            ${data.otp}
        </div>
        <p>Please enter this OTP in the verification field to proceed. For security reasons, this OTP is valid for only [15/30] minutes. If you did not request this OTP, please disregard this email.</p>
        <p>If you encounter any issues or need further assistance, please contact our support team at <a href="mailto:[Support Email]">drive@gmail.com</a>.</p>
        <div class="footer">
            <p>Thank you for using [Your Service Name]!</p>
            <p><a href="[Your Company’s Website]">Visit our website</a></p>
        </div>
    </div>
</body>
</html>

`;
};
export const sendAccountRecoverMail = async (
    data:{name:string,otp:string,email:string}
) => {
  await transporter.sendMail({
    from: 'camperShop.email.@gmail.com',
    to: data.email,
    subject: 'Recover your account',
    html: accountRecoverMailHtml({name:data.name,otp:data.otp}),
  });
};
