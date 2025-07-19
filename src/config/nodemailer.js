import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

// Transportador de correos
let transporter = nodemailer.createTransport({
  service: 'gmail',
  host: process.env.HOST_MAILTRAP,
  port: process.env.PORT_MAILTRAP,
  auth: {
    user: process.env.USER_MAILTRAP,
    pass: process.env.PASS_MAILTRAP,
  }
});

// ENV: Añade esta variable si no la tienes
// URL_BACKEND=https://travel-agency-backend-dn6i.onrender.com/

export const sendMailToRegister = (userMail, token) => {
  const backendUrl = process.env.URL_BACKEND?.replace(/\/$/, ""); // sin / final
  const verifyUrl = `${backendUrl}/travel/usuarios/verificar/${encodeURIComponent(token)}`;

  const mailOptions = {
    from: `"Travel Agency" <${process.env.USER_MAILTRAP}>`,
    to: userMail,
    subject: "🌎 Travel Agency - Verificación de cuenta",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="color: #2c3e50;">¡Bienvenido/a a Travel Agency!</h2>
        <p style="color: #34495e; font-size: 16px;">
          Gracias por registrarte. Para activar tu cuenta, haz clic en el siguiente botón:
        </p>
        <p style="text-align: center; margin: 30px;">
          <a href="${verifyUrl}"
             style="background-color: #1abc9c; color: white; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-weight: bold;">
            Verificar mi cuenta
          </a>
        </p>
        <p style="font-size: 14px; color: #7f8c8d;">
          Si tú no realizaste este registro, puedes ignorar este mensaje.
        </p>
        <hr style="margin: 30px 0;">
        <footer style="text-align: center; font-size: 13px; color: #95a5a6;">
          Travel Agency &copy; ${new Date().getFullYear()} - Todos los derechos reservados.
        </footer>
      </div>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("❌ Error al enviar el correo:", error);
    } else {
      console.log("✅ Correo de verificación enviado:", info.messageId);
    }
  });
};

export const sendMailToRecoveryPassword = async (email, token) => {
  const frontendUrl = process.env.URL_FRONTEND?.replace(/\/$/, "");
  const resetUrl = `${frontendUrl}/travel/usuarios/recuperar-password/${encodeURIComponent(token)}`;

  const info = await transporter.sendMail({
    from: `"Travel Agency" <${process.env.USER_MAILTRAP}>`,
    to: email,
    subject: "🔐 Recuperación de contraseña - Travel Agency",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="color: #2c3e50;">¿Olvidaste tu contraseña?</h2>
        <p style="color: #34495e; font-size: 16px;">
          Recibimos una solicitud para restablecer tu contraseña. Para continuar, haz clic en el siguiente botón:
        </p>
        <p style="text-align: center; margin: 30px;">
          <a href="${resetUrl}"
             style="background-color: #e67e22; color: white; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-weight: bold;">
            Restablecer contraseña
          </a>
        </p>
        <p style="font-size: 14px; color: #7f8c8d;">
          Si no solicitaste este cambio, puedes ignorar este mensaje y tu contraseña permanecerá segura.
        </p>
        <hr style="margin: 30px 0;">
        <footer style="text-align: center; font-size: 13px; color: #95a5a6;">
          Travel Agency &copy; ${new Date().getFullYear()} - Todos los derechos reservados.
        </footer>
      </div>
    `,
  });

  console.log("✅ Correo de recuperación enviado:", info.messageId);
};
