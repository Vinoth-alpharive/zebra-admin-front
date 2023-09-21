const nodemailer = require("nodemailer");
async function sendEmail(data) {
  try {
    const smtpEndpoint = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const smtpUsername = process.env.SMTP_USERNAME;
    const smtpPassword = process.env.SMTP_PASSWORD;
    const mailFrom = data.senderAddress ? data.senderAddress : process.env.MAIL_FROM_ADDRESS;    
    // Create the SMTP transport.
    let transporter = nodemailer.createTransport({
      host: smtpEndpoint,
      port: port,
      secure: false, // true for 465, false for other ports
      auth: {
        user: smtpUsername,
        pass: smtpPassword,
      },
    });
    // Specify the fields in the email.
    let mailOptions = {
      from: mailFrom,
      to: data.toAddress,
      subject: data.subject,
      html: data.body_html,
    };
   
    let info = await transporter.sendMail(mailOptions);
  
    return { error: false };
  } catch (error) {
    console.error("send-email-error", error);
    return {
      error: true,
      message: "Cannot send email",
    };
  }
}
module.exports = { sendEmail };