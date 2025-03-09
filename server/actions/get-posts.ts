"use server";

import { db } from "@/server";

export default async function getPosts() {
	const posts = await db.query.posts.findMany();

	if (!posts) {
		return { error: true, message: "Posts not found" };
	}

	return {
		data: posts
	};
}
