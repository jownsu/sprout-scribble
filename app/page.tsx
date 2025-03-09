import getPosts from "@/server/actions/get-posts";
import React from "react";

const HomePage = async () => {
	const posts = await getPosts();

	if (posts.error) {
		return <div>{posts.message}</div>;
	}

	return <div>{posts.data?.map((post) => <h2 key={post.id}>{post.title}</h2>)}</div>;
};

export default HomePage;
