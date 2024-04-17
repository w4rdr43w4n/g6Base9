import { db } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";

async function handler(req: Request) {
  const { type, title ,list} = await req.json();
  const session = await getServerSession(options)
  const username = session?.user?.name
  const email = session?.user?.email
  console.log(`EMAIL:${email}\nNAME:${username}\nTYPE:${type}`);
  let imports = [];
  const selection =
    title.length > 0
      ? { username: username, email: email, title: title }
      : { username: username, email: email };
  const refselection =
    list.length > 0
      ? { username: username, email: email, list: title }
      : { username: username, email: email };
  switch (type) {
    case "lr":
      imports = await db.literature.findMany({
        where: selection,
        select: {
          content: true,
          title: true,
          style: true,
        },
      });
      break;
    case "art":
      imports = await db.article.findMany({
        where: selection,
        select: {
          content: true,
          title: true,
          style: true,
        },
      });
      break;
    case "out":
      imports = await db.outline.findMany({
        where: selection,
        select: {
          content: true,
          title: true,
        },
      });
      break;
    case "ref":
      imports = await db.reflist.findMany({
        where:refselection,
        select: {
          list: true,
          style: true,
        },
      });
      break;
    default:
      return Response.json({ error: "Invalid document type" }, { status: 400 });
  }
  console.log(`IMPORTS:${imports}`);
  return Response.json(
    { message: "Working!", imports: imports },
    { status: 200 }
  );
}

export { handler as GET, handler as POST };