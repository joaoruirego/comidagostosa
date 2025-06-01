import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ error: "Error parsing form data" });
        return;
      }

      const email = Array.isArray(fields.email)
        ? fields.email[0]
        : fields.email;
      if (!email) {
        res.status(400).json({ error: "Email is required" });
        return;
      }

      const image = Array.isArray(files.image) ? files.image[0] : files.image;
      if (!image) {
        res.status(400).json({ error: "Image is required" });
        return;
      }

      try {
        // Create a transporter object using SMTP transport
        const transporter = nodemailer.createTransport({
          service: "Gmail", // Use your email service
          auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_PASS, // Your email password or app-specific password
          },
        });

        // Set up email data
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Your Photo from Comida Engraçada",
          text: "Here is your photo!",
          attachments: [
            {
              filename: "photo.jpg",
              path: image.filepath, // Use the file path from formidable
            },
          ],
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Email sent successfully" });
      } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Error sending email" });
      }
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
