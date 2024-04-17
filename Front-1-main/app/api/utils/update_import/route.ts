import { db } from "@/app/lib/db";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

async function handler(req: Request) {
  const session = await getServerSession(options);
  console.log(session)
  if (!session) {
    return Response.json({ message: "Log in first" }, { status: 400 });
  }
  const { project,content, type } = await req.json();
  let upd = null;
  const selection = {
    username: session.user?.name,
    email: session.user?.email,
    project:project
  };
  let isProject = null
  console.log(`NEW_CONTENT:${content}`)
  if (content && project && type) {
    switch (type) {
      case "lr":
      isProject = await db.literature.findUnique({
        where:{
          project:project
        },
        select:{
          content:true
        }
      })
      if(!isProject){
        return Response.json({error:"Project name not found, change 'Project name' field to a saved project name or import one"},{status:429})
      }
        upd = await db.literature.update({
          where: selection,
          data: {
            content: content,
          },
        });
        break;
      case "art":
        isProject = await db.article.findUnique({
          where:{
            project:project
          },
          select:{
            content:true
          }
        })
        if(!isProject){
          return Response.json({error:"Project name not found, change 'Project name' field to a saved project name or import one"},{status:429})
        }
        upd = await db.article.update({
          where: selection,
          data: {
            content: content,
          },
        });
        break;
        case "out":
          isProject = await db.outline.findUnique({
            where:{
              project:project
            },
            select:{
              content:true
            }
          })
          if(!isProject){
            return Response.json({error:"Project name not found, change 'Project name' field to a saved project name or import one"},{status:429})
          }
        upd = await db.outline.update({
          where: selection,
          data: {
            content: content,
          },
        });
        break;
        case "ref":
          isProject = await db.reflist.findUnique({
            where:{
              project:project
            },
            select:{
              list:true
            }
          })
          if(!isProject){
            return Response.json({error:"Project name not found, change 'Project name' field to a saved project name or import one"},{status:429})
          }
        upd = await db.reflist.update({
          where: selection,
          data: {
            list: content,
          },
        });
        break;
        default:
          return Response.json({error:"Invalid type"},{status:400})
    }
    if(!upd){
      return Response.json({error:"db error"},{status:400})
    } else {
      return Response.json({message:"updated"},{status:200})
    }
  } else {
    return Response.json({ error: "Invalid parameters", status: 400 });
  }
}
export { handler as POST };
