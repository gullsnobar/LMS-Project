import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";

interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

const sendMail = async (options: EmailOptions): Promise<void> => {
  try {
    
    // Create Transporter
  
    const transporter: Transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      service: process.env.SMTP_SERVICE,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const { email, subject, template, data } = options;

    // ===============================
    // Email Template Path
    // ===============================
    const templatePath = path.join(
      __dirname,
      "..",
      "views",
      "emails",
      template
    );

    // ===============================
    // Render EJS Template
    // ===============================
    const html: string = await ejs.renderFile(templatePath, data);

    // ===============================
    // Mail Options
    // ===============================
    const mailOptions = {
      from: `"No Reply" <${process.env.SMTP_USER}>`,
      to: email,
      subject: subject,
      html: html,
    };

    // ===============================
    // Send Mail
    // ===============================
    await transporter.sendMail(mailOptions);
  } catch (error: any) {
    console.error("Email sending failed:", error.message);
    throw new Error(error.message);
  }
};

export default sendMail;
