import { db } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";

async function handler(req: Request) {
  const { type} = await req.json();
  const session = await getServerSession(options)
  const username = session?.user?.name
  const email = session?.user?.email
  console.log(`EMAIL:${email}\nNAME:${username}\n`);
  let imports = [];
  const selection = { username: username, email: email, type:type }
  imports = await db.document.findMany({
        where: selection,
        select: {
          name: true,
          type: true,
          recieveDate:true
        },
      });
  console.log(`IMPORTS:${imports}`);
  return Response.json(
    { message: "Working!", imports: imports },
    { status: 200 }
  );
}

export { handler as GET, handler as POST };
