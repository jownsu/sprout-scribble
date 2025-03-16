"use server";
import { LoginSchema } from "@/types/login-schema";
import { createSafeActionClient } from "next-safe-action";

const action = createSafeActionClient();

export const emailSignIn = action
    .schema(LoginSchema)
    .action(async ({parsedInput: { email, password }}) => {

        console.log("FROM ACTION", {email, password});
    });