import { db } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";

async function handler(req: Request) {
  try {
  const { name} = await req.json();
  const session = await getServerSession(options)
  const username = session?.user?.name
  const email = session?.user?.email
  console.log(`EMAIL:${email}\nNAME:${username}\n`);
  let imports = [];
  const selection = { username: username, email: email,type:'html' };
      imports = await db.document.findMany({
        where: selection,
        select: {
          type: true,
          name:true
        },
      });
      const key = username+imports.length.toString();
      const now = new Date()
      const newkey = await db.document.create({
        data:{
          email:email,
          username:username,
          type:'html',
          link:key,
          name:name,
          recieveDate:now
        }
      })
    if(key && newkey) 
      {return Response.json({key:key},{status:200})}} catch(error) {
        return Response.json({error},{status:500})
      }
    
    }

export { handler as GET, handler as POST };
