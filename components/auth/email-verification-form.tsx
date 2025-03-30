"use client";

import { newVerification } from "@/server/actions/tokens";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import AuthCard from "./auth-card";
import FormError from "./form-error";
import FormSuccess from "./form-success";

const EmailVerificationForm = () => {

    const token = useSearchParams().get("token");
    
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleVerification = useCallback(() => {

        if(success || error) {
            return;
        }

        if(!token){
            setError("No token found");
            return;
        }

        newVerification(token).then((data) => {
            if(data.status){
                setSuccess(data.message);
            }
            else {
                setError(data.message)
            }
        });

    }, []);

    useEffect(() => {
        handleVerification();
    }, []);

	return (
        <AuthCard
            backButtonLabel="Back to login"
            backButtonHref="/auth/login"
            cardTitle="Verify your account."
        >
            <div className="flex items-center flex-col w-full justify-center">
                <p>{!success && !error ? "Verifying email..." : null}</p>
                <FormSuccess message={success} />
                <FormError message={error} />
            </div>
        </AuthCard>
    );
};

export default EmailVerificationForm;
