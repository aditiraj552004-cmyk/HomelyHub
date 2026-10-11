import "dotenv/config";

import Mailgen from "mailgen";
import nodemailer from "nodemailer";

// ======================================================
// Mail Generator
// ======================================================

const mailGenerator =
  new Mailgen({
    theme: "default",

    product: {
      name: "Homely Hub",

      link:
        process.env
          .FRONTEND_URL ||
        "http://localhost:5173",
    },
  });

// ======================================================
// SMTP
// ======================================================

const smtpPort = Number(
  process.env
    .MAILTRAP_SMTP_PORT
);

const transporter =
  nodemailer.createTransport({
    host:
      process.env
        .MAILTRAP_SMTP_HOST,

    port: smtpPort,

    secure:
      smtpPort === 465,

    auth: {
      user:
        process.env
          .MAILTRAP_SMTP_USER,

      pass:
        process.env
          .MAILTRAP_SMTP_PASS,
    },
  });

// ======================================================
// Send Mail
// ======================================================

const sendMail = async (
  options
) => {
  try {
    const emailBody =
      mailGenerator.generate(
        options.mailGenContent
      );

    const emailText =
      mailGenerator.generatePlaintext(
        options.mailGenContent
      );

    const mailOptions = {
      from:
        process.env
          .MAIL_FROM ||
        "Homely Hub <hello@homelyhub.in>",

      to: options.email,

      subject:
        options.subject,

      text: emailText,

      html: emailBody,
    };

    const info =
      await transporter.sendMail(
        mailOptions
      );

    console.log(
      `✅ Email sent: ${info.messageId}`
    );

    return info;
  } catch (error) {
    console.error(
      "❌ Email sending failed:",
      error.message
    );

    throw error;
  }
};

// ======================================================
// Forgot Password Template
// ======================================================

const forgotPasswordMailGenContent =
  (
    username,
    passwordResetUrl
  ) => {
    return {
      body: {
        name:
          username ||
          "Homely Hub User",

        intro:
          "We received a request to reset your Homely Hub password.",

        action: {
          instructions:
            "Click the button below to reset your password.",

          button: {
            color: "#2563EB",

            text:
              "Reset Password",

            link:
              passwordResetUrl,
          },
        },

        outro:
          "If you did not request a password reset, you can safely ignore this email.",
      },
    };
  };

export {
  sendMail,
  forgotPasswordMailGenContent,
};