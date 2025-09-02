import Mailgen from 'mailgen' // Using to generate the design of the email
import nodemailer from 'nodemailer' // Using to send the email 

const sendMailWithMailgen = async (options) => {
    const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        // Appears in header & footer of e-mails
        name: 'Mailgen',
        link: 'https://mailgen.js/'
        // Optional product logo
        // logo: 'https://mailgen.js/img/logo.png'
        }
    });
    const emailHTML = mailGenerator.generate(options.mailGenContent); // For people whose browser support HTML (unlikely it won't lmao)
    const emailText = mailGenerator.generatePlaintext(options.mailGenContent); // For people whose browser won't support HTML

    // Now, to send the email using Nodemailer
    // transporter defines the "from" and "to" of the email
    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST, // SMTP - Simple Mail Transfer Protocol (e.g: Gmail, Outlook, Mailtrap) - Nodemailer connects to the SMTP (basically Mailtrap's server)
        port: process.env.MAILTRAP_SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS,
        },
    });

    const email = { // Construct the message object according to Nodemailer's syntax
        from: process.env.MAILTRAP_SMTP_SENDEREMAIL,
        to: options.email,
        subject: options.subject,
        text: emailText,
        html: emailHTML
    }

    try {
        await transporter.sendMail(email)
    }
    catch(error) {
        console.log("Email failed", error);
    }
}

const emailVerificationMailgenContentGenerator = (username, verificationUrl) => { // Generating contents of the email for email verification which will be sent to emailHTML and emailPlainText in mailgenConfigure
    return {
        body: {
            name: username,
            intro: 'Welcome to our App! We\'re very excited to have you on board.',
            action: {
                instructions: 'To get started with our App, please click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Verify Email',
                    link: verificationUrl
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }
}

const forgotPasswordMailgenContentGenerator = (username, passwordResetUrl) => { // // Generating contents of the email for password reset which will be sent to emailHTML and emailPlainText in mailgenConfigure
    return {
        body: {
            name: username,
            intro: 'We received a request to change your password',
            action: {
                instructions: 'To change your password, please click here:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Reset Password',
                    link: passwordResetUrl
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }
}

const resendEmailVerificationMailgenContentGenerator = (username, verificationUrl) => { // Generating contents of the email for resending the email verification which will be sent to emailHTML and emailPlainText in mailgenConfigure
    return {
        body: {
            name: username,
            intro: 'We received a request to resend the email verification link',
            action: {
                instructions: 'To get started with our App, please click here:',
                button: {
                    color: '#d81212ff', // Optional action button color
                    text: 'Verify Email',
                    link: verificationUrl
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }
}


export { sendMailWithMailgen, emailVerificationMailgenContentGenerator, forgotPasswordMailgenContentGenerator, resendEmailVerificationMailgenContentGenerator } 