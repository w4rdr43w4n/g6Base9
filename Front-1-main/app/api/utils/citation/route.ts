import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { db } from "@/app/lib/db";

async function handler(req: Request) {
  const session = await getServerSession(options);
  if(!session){
    return Response.json({message:'Log in first'},{status:200})
  }
  const {authors,title,style,link,year} = await req.json()
  console.log(title)
  if(!style || !title || !style  || !authors || !year){
    return Response.json({message:'Invalid parameters'},{status:400})
  }
  let uniqueProject = null
  const now = new Date()
  let citation = '[]'
  switch (style){
    case 'ieee':
      const refcite = await db.ref.create({
        data:{
          email:session.user?.email,
          username:session.user?.name,
          title:title,
          authors:authors,
          style:style,
          link:link,
          year:year,
          citation:citation,
          recieveDate:now,
        }
      })
      if(refcite)return Response.json({ok:true},{status:200})
        break 
    case 'mla':
        citation = `(${authors})`;
        const refcite2 = await db.ref.create({
            data:{
                email:session.user?.email,
                username:session.user?.name,
                title:title,
                authors:authors,
                style:style,
                link:link,
                year:year,
                citation:citation,
                recieveDate:now,
              }
        })
        if(refcite2)return Response.json({ok:true},{status:200})
        break
    default:
        citation = `(${authors},${year})`
        const refcite3 = await db.ref.create({
            data:{
                email:session.user?.email,
                username:session.user?.name,
                title:title,
                authors:authors,
                style:style,
                link:link,
                year:year,
                citation:citation,
                recieveDate:now,
              }
        })
        if(refcite3)return Response.json({ok:true},{status:200})
        return Response.json({message:'Invalid request'},{status:300})
    }

}


export {handler as POST, handler as GET };
