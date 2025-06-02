// app/api/send-email/route.ts
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, imageUrl } = await req.json();

    if (!email || !imageUrl) {
      return new Response("Email ou imagem faltando", { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail", // ou "outlook", "hotmail", etc.
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Cozinha ou Consequência" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Sua Foto da Comida!",
      html: `
        <h2>Obrigado por participar!</h2>
        <p>Aqui está a sua imagem:</p>
        <img src="${imageUrl}" alt="Imagem" width="400" />
      `,
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error: any) {
    console.error("Erro ao enviar email:", error);
    return new Response("Erro no envio de email", { status: 500 });
  }
}
