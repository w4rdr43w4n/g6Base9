import { db} from "@/app/lib/db";

async function handler(req:Request) {
  const {upd} = await req.json()
  console.log("R"+upd.access_token)
  if(upd.access_token === ""){
const tokens: any = await db.tokens.findFirst({
  where: {
    tokenType: "plg",
  },
  select: {
    plgToken: true,
    issued:true,
    expired:true
  },
});
let token;
if (!tokens?.plgToken) {
  token = "";
  await db.tokens.create({
    data: {
      plgToken:
        "2A5554C9FD48DA72D0737DE844C980A72C46D59E02170F57C56C6D7A569FEA58",
      tokenType: "plg",
      issued: "4545454",
    expired:"454546546",
    },
  });
 // console.log(`EMPTY_TOKEN:${token}`);
} else {
  token = {
    access_token: tokens.plgToken.toString(),
    ".issued": tokens.issued.toString(),
    ".expires": tokens.expired.toString(),
  };
 // console.log(`DB_TOKEN:${token.access_token}`);
}
return Response.json({token:token},{status:200})
} else {
  console.log(upd)
   await db.tokens.update({
        where: {
          tokenType: "plg",
        },
        data: {
          plgToken: upd.access_token,
          issued:upd['.issued'],
          expired:upd['.expires']
        },
      });
      return Response.json({status:200})
}

}
export {handler as POST}