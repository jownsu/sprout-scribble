import createPost from "@/server/actions/create-post";
import getPosts from "@/server/actions/get-posts";
import React from "react";

const HomePage = async () => {
	const posts = await getPosts();

	if (posts.error) {
		return <div>{posts.message}</div>;
	}

	return (
		<div>
			<div className="mb-4">
				{posts.data?.map((post) => <h2 key={post.id}>{post.title}</h2>)}
			</div>

			<form action={createPost} className="flex gap-2">
				<input type="text" name="title" className="border text-black bg-white px-2" />
				<button type="submit" className="bg-white text-black px-3 py-2">Add Post</button>
			</form>
		</div>
	);
};

export default HomePage;
