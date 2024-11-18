import { mailtrapClient, sender } from "./mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { PASSWORD_RESET_REQUEST_TEMPLATE } from "./emailTemplates.js";
import { PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationCode) => {
    const recipients = [{email}];

    try{
        const response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            subject: "Verify Your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationCode),
            category: "Email Verification",
        });

        console.log("Verification email sent successfully:", response);
    } catch (error) {
        console.error("Error sending verification email:", error);
        return error;
    }
};

export const sendWelcomeEmail = async (email, name) => {
    const recipients = [{email}];

    try{

        const response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            template_uuid: "1f57d876-eb00-4ffb-bf27-97c12e201a49",
            template_variables: {
                "name": name,
            },
        });

        console.log("Welcome email sent successfully:", response);

    } catch (error) {
        console.error("Error sending welcome email:", error);
        return error;
    }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
    const recipients = [{email}];

    try{
        const response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            subject: "Reset Your Password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset",
        });
        console.log("Password reset email sent successfully:", response);
    } catch (error) {
        console.error("Error sending password reset email:", error);
        return error;
    }
};

export const sendResetSuccessEmail = async (email) => {
    const recipients = [{email}];

    try{
        const response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset",
        });

        console.log("Password reset success email sent successfully:", response);

    } catch (error) {
        console.error("Error sending password reset success email:", error);
        return error;
    }
};
