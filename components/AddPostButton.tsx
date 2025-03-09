"use client";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

const AddPostButton = () => {
	const { pending } = useFormStatus();

	return (
		<Button 
            variant={"secondary"}
            type="submit" 
            className="bg-white text-black px-3 py-2 disabled:opacity-50"
            disabled={pending}
        >
			Add Post
		</Button>
	);
};

export default AddPostButton;
