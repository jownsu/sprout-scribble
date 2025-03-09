"use server";

import { db } from "@/server";
import { posts } from "@/server/schema";
import { revalidatePath } from "next/cache";

export default async function createPost(form_data: FormData) {
    
    const title = form_data.get("title")?.toString();

    if(title){
        revalidatePath("/");
        await db.insert(posts).values({
            title
        });
    }
}
