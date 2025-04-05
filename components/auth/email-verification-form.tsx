"use client";

/* NEXT */
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

/* COMPONENTS */
import AuthCard from "@/components/auth/auth-card";
import FormError from "@/components/auth/form-error";
import FormSuccess from "@/components/auth/form-success";

/* ACTIONS */
import { newVerification } from "@/server/actions/auth/tokens";

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

    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, []);

    useEffect(() => {
        handleVerification();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, []);

	return (
        <AuthCard
            back_button_label="Back to login"
            back_button_href="/auth/login"
            card_title="Verify your account."
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
