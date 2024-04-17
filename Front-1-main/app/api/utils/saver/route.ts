import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { db } from "@/app/lib/db";

async function handler(req: Request) {
  const session = await getServerSession(options);
  if(!session){
    return Response.json({message:'Log in first'},{status:200})
  }
  const {project,title,content,type,style,outline} = await req.json()
  console.log(project)
  if(!type || !title || !content || !style || !outline || !project){
    return Response.json({message:'Invalid parameters'},{status:400})
  }
  const now = new Date()
  let uniqueProject = null
  switch (type){
    case 'lr':
      uniqueProject = await db.literature.findUnique({
        where:{
         project:project 
        },
        select:{
          content:true
        }
      })

      if(uniqueProject){
        return Response.json({error:"This Project name already exists, choose another one"},{status:429})
      }
      const lrRec = await db.literature.create({
        data:{
          email:session.user?.email,
          username:session.user?.name,
          title:title,
          content:content,
          style:style,
          project:project,
          saveDate:now,
        }
      })
      if(lrRec)return Response.json({ok:true},{status:200})
        break 
    case 'ar':
      uniqueProject = await db.article.findUnique({
        where:{
         project:project 
        },
        select:{
          content:true
        }
      })
      if(uniqueProject){
        return Response.json({error:"This Project name already exists, choose another one"},{status:429})
      }
        const arRec = await db.article.create({
          data:{
            email:session.user?.email,
            username:session.user?.name,
            title:title,
            content:content,
            style:style,
            outline:outline,
            project:project,
            saveDate:now,
          }
        })
        if(arRec)return Response.json({ok:true},{status:200})
        break
    case 'out':
      uniqueProject = await db.outline.findUnique({
        where:{
         project:project 
        },
        select:{
          content:true
        }
      })
      if(uniqueProject){
        return Response.json({error:"This Project name already exists, choose another one"},{status:429})
      }
          const outRec = await db.outline.create({
            data:{
              email:session.user?.email,
              username:session.user?.name,
              title:title,
              content:content,
              project:project,
              saveDate:now,
            }
          })
        if(outRec)return Response.json({ok:true},{status:200})
          break
    case 'ref':
      uniqueProject = await db.reflist.findUnique({
        where:{
         project:project 
        },
        select:{
          list:true
        }
      })
      if(uniqueProject){
        return Response.json({error:"This Project name already exists, choose another one"},{status:429})
      }
          const refRec = await db.reflist.create({
            data:{
              email:session.user?.email,
              username:session.user?.name,
              style:style,
              list:content,
              project:project,
              saveDate:now,
            }
          })
        if(refRec)return Response.json({ok:true},{status:200})
      break  
    default:
    return Response.json({message:'Invalid request'},{status:300})
    }

}


export {handler as POST, handler as GET };
