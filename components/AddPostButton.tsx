"use client";
import { useFormStatus } from "react-dom";

const AddPostButton = () => {
	const { pending } = useFormStatus();

	return (
		<button 
            type="submit" 
            className="bg-white text-black px-3 py-2 disabled:opacity-50"
            disabled={pending}
        >
			Add Post
		</button>
	);
};

export default AddPostButton;
