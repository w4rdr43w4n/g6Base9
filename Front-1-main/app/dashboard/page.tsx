import { options } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import delScan, { authenticate } from "../lib/delScan";
import { validateAuthors } from "../lib/formVaild";
export default async function Page() {
  const session = getServerSession(options);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/dashboard");
  }
  //const r = await delScan(["45661"],3000);
  //console.log(r)
  //const resp = await authenticate()
  //console.log(validateAuthors("ward rawan"))
  return (
    <>
      <h3>Dashboard Page</h3>
    </>
  );
}
