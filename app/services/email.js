const nodemailer = require('nodemailer');


async function sendEmail({ to, subject, html, from = 'announcraze@yopmail.com' }) {
    const transporter = nodemailer.createTransport({
        host: 'mail.smtp2go.com',
        port: 2525,
        auth: {
            user: process.env.SMTP2GO_USER,
            pass: process.env.SMTP2GO_PASSWORD
        }
    });

    const mailOptions = {
        from,
        to,
        subject,
        html
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent');
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}
async function sendVerificationEmail(account, origin) {
    let message;
    if (origin) {
        const verifyUrl = `${origin}/api/v1/users/verify?token=${account.verificationToken}`;
        message = `<p>Please click the below link to verify your email address:</p>
                   <p><a href="${verifyUrl}">${verifyUrl}</a></p>`;
    } else {
        message = `<p>Please use the below token to verify your email address with the <code>/api/v1/users/verify</code> api route:</p>
                   <p><code>${account.verificationToken}</code></p>`;
    }

    await sendEmail({
        to: account.email,
        subject: 'AnnounCraze - Verify Email',
        html: `<h4>Verify Email</h4>
               <p>Thanks for registering!</p>
               ${message}`
    });
}

async function sendAlreadyRegisteredEmail(email, origin) {
    let message;
    if (origin) {
        message = `<p>If you don't know your password please visit the <a href="${origin}/api/v1/users/forgot-password">forgot password</a> page.</p>`;
    } else {
        message = `<p>If you don't know your password you can reset it via the <code>/api/v1/users/forgot-password</code> api route.</p>`;
    }

    await sendEmail({
        to: email,
        subject: 'AnnounCraze - Email Already Registered',
        html: `<h4>Email Already Registered</h4>
               <p>Your email <strong>${email}</strong> is already registered.</p>
               ${message}`
    });
}

// since we need a post for the password rest, we can't send an url like in the verification email;
//it would need to be a frontend url that would then call the api with the token
async function sendPasswordResetEmail(account, origin) {
    let message;
    // if (origin) {
    //     const resetUrl = `${origin}/api/v1/users/reset-password?token=${account.resetToken.token}`;
    //     message = `<p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
    //                <p><a href="${resetUrl}">${resetUrl}</a></p>`;
    // } 
    // else {
    //     message = `<p>Please use the below token to reset your password with the <code>/api/v1/users/reset-password</code> api route:</p>
    //                <p><code>${account.resetToken.token}</code></p>`;
    // }
    message = `<p>Please use the below token to reset your password with the <code>/api/v1/users/reset-password</code> api route:</p>
                <p><code>${account.resetToken.token}</code></p>`;
    await sendEmail({
        to: account.email,
        subject: 'AnnounCraze - Reset Password',
        html: `<h4>Reset Password Email</h4>
               ${message}`
    });
}

module.exports = {
    sendVerificationEmail,
    sendAlreadyRegisteredEmail,
    sendPasswordResetEmail
};