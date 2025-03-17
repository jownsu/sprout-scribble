import getBaseUrl from "@/lib/base-url";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY); 
const domain = getBaseUrl();

export const sendVerificationEmail = async (email: string, token: string) => {
    
    const confirmLink = `${domain}/auth/new-verification-token?token=${token}`;

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