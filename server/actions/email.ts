import getBaseUrl from "@/lib/base-url";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY); 
const domain = getBaseUrl();

export const sendVerificationEmail = async (email: string, token: string) => {
    
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;

    const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: [email],
        subject: "Sprout and Scribble - Confirmation Email",
        html: `<p>Click to <a href='${confirmLink}'>Confirm your email</a></p>`
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

export const sendResetPasswordEmail = async (email: string, token: string) => {
    
    const confirmLink = `${domain}/auth/new-password?token=${token}`;

    const { data, error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: [email],
        subject: "Sprout and Scribble - Confirmation Email",
        html: `<p>Click to <a href='${confirmLink}'>Reset your password</a></p>`
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