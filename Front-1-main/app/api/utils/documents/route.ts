import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { db } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

async function handler(req: Request) {
  const session = await getServerSession(options);
  if(!session){
    return Response.json({message:'Log in first'},{status:200})
  }
  const {link,date,type,status,total_pages} = await req.json()
  if(!link || !date || !type || !status || !total_pages){
   // console.log(type);
    //console.log(title);
    //console.log(content);
    return Response.json({message:'Invalid parameters'},{status:400})
  }

      const lrRec = await db.document.create({
        data:{
          email:session.user?.email,
          username:session.user?.name,
          link:link,
          status:status,
          type:type,
          total_pages:total_pages
        }
      })
      if(lrRec)return Response.json({ok:true},{status:200}) 
   
    return Response.json({message:'Invalid request'},{status:300})
    }



export {handler as POST, handler as GET };
