import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { db } from "@/app/lib/db";


async function handler(req: Request) {
  const session = await getServerSession(options);
  if(!session){
    return Response.json({message:'Log in first'},{status:400})
  }
  const {type,plgId} = await req.json()
  if(!type || !plgId){
    return Response.json({message:'Invalid parameters'},{status:400})
  }
  switch (type){
    case 'plg':
      const plgRec = await db.plg.create({
        data:{
          plgId:plgId,
          email:session.user?.email,
          username:session.user?.name,
        }
      })
      if(plgRec)return Response.json({ok:true},{status:200}) 

      break  
    default:
    return Response.json({message:'Invalid record type'},{status:400})
    }
}

export {handler as POST, handler as GET };
