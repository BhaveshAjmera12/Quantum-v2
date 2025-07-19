import nodemailer from 'nodemailer'

export const sendMail = async (to, subject, text)=>{
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS, 
            }

            
        })

        const mailOptions = {
      from: `"Rebuilt-Quantum" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent to:", to);


    } catch (error) {
         console.error("Error sending email:", error);
         throw new Error("Failed to send email");
    }
}