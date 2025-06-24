import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // o usa "hotmail", "outlook", "sendinblue", etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendMailToVerifyMovilUser = async (email, token) => {
  const info = await transporter.sendMail({
    from: `"Travel Agency" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verifica tu cuenta en Travel Agency 🌎",
    html: `
      <p>Gracias por registrarte.</p>
      <p>Tu código de verificación es: <strong>${token}</strong></p>
      <p>Ingresa este código en la app para activar tu cuenta.</p>
    `,
  });

  console.log("Correo enviado: %s", info.messageId);
};
