import { db } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";

async function handler(req: Request) {
  const { type,project ,list} = await req.json();
  const session = await getServerSession(options)
  const username = session?.user?.name
  const email = session?.user?.email
  console.log(`EMAIL:${email}\nNAME:${username}\nTYPE:${type}`);
  let imports = [];
  const selection =
    project.length > 0
      ? { username: username, email: email, project:project }
      : { username: username, email: email };
  const selectioncite = { username: username, email: email };
  const refselection =
    list.length > 0
      ? { username: username, email: email, project:project }
      : { username: username, email: email };
  const criteria = {
    project:true,
    content: true,
    title: true,
    style: true,
    saveDate:true,
  }
  switch (type) {
    case "lr":
      imports = await db.literature.findMany({
        where: selection,
        select:criteria,
      });
      break;
    case "art":
      imports = await db.article.findMany({
        where: selection,
        select: criteria,
      });
      break;
    case "out":
      imports = await db.outline.findMany({
        where: selection,
        select: {
          project:true,
          content: true,
          title: true,
          saveDate:true,
        },
      });
      break;
    case "ref":
      imports = await db.reflist.findMany({
        where:refselection,
        select: {
          project:true,
          list: true,
          style: true,
          saveDate:true,
        },
      });
      break;
      case "cite":
        imports = await db.ref.findMany({
          where:selectioncite,
          select: {
            title:true,
            authors: true,
            style: true,
            citation:true,
            link:true,
            year:true,
            recieveDate:true,
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
