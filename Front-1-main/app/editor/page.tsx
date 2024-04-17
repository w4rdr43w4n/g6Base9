
import Editor from "@/components/editor/Editor";
import { options } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default function Home() {
	const session = getServerSession(options);
	if (!session) {
	  redirect("/api/auth/signin?callbackUrl=/profile");
	}
	return (
		<main>
			<Editor/>
		</main>
	);
}