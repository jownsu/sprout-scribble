/* PLUGINS */
import { Resend } from "resend";

/* HELPERS */
import getBaseUrl from "@/lib/base-url";

const resend = new Resend(process.env.RESEND_API_KEY); 
const domain = getBaseUrl();

/* Send verification link for email confirmation */
export const sendVerificationEmail = async (email: string, token: string) => {
    
    const confirm_link = `${domain}/auth/new-verification?token=${token}`;

    const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: [email],
        subject: "Sprout and Scribble - Confirmation Email",
        html: `<p>Click to <a href='${confirm_link}'>Confirm your email</a></p>`
    });

    if(error){
        return {
            status: false,
            message: error.message
        };
    }
    
    if(data){
        return {
            status: true,
            message: "Email Confirmation Sent"
        };
    }
}

/* Send reset password link for reset password */
export const sendResetPasswordEmail = async (email: string, token: string) => {
    
    const confirm_link = `${domain}/auth/new-password?token=${token}`;

    const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: [email],
        subject: "Sprout and Scribble - Confirmation Email",
        html: `<p>Click to <a href='${confirm_link}'>Reset your password</a></p>`
    });

    if(error){
        return {
            status: false,
            message: error.message
        };
    }
    
    if(data){
        return {
            status: true,
            message: "Email Confirmation Sent"
        };
    }
}

/* Send code for two factor authentication */
export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
    const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: [email],
        subject: "Sprout and Scribble - Your two factor token",
        html: `<p>Your confirmation code: ${token}</p>`
    });

    if(error){
        return {
            status: false,
            message: error.message
        };
    }
    
    if(data){
        return {
            status: true,
            message: "Two factor authenticaiton sent"
        };
    }
}