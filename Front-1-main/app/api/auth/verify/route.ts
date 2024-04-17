import { db } from "@/app/lib/db";

async function handler(req: Request) {
  try {
    let { token, email } = await req.json();
    //let token,email;
    //console.log(token);
//console.log(email);
    //email = "hassan.n.afif@gmail.com";
    //token = "$2a$10$4e/Nslxtz9x7wTvl09FxFOYiW0GrgcR/l0bjSGOxjRueP1lwaGat2"
    const getDbToken = await db.user.findUnique({
      where: {
        email: email,
      },
      select: {
        token: true,
        expirationTime: true,
        isVerified: true,
      },
    });
    console.log(getDbToken);
    if (getDbToken?.isVerified)
      return Response.json({ token: token }, { status: 200 });
    const now = new Date();
    if (getDbToken?.token === token) {
      if (getDbToken && getDbToken.expirationTime)
        if (now > getDbToken.expirationTime) {
          return Response.json({ error: "Token Expired" }, { status: 226 });
        } else {
          await db.user.update({
            where: {
              email: email,
            },
            data: {
              emailVerified: now,
              isVerified: true,
            },
          });
          return Response.json({ token: token }, { status: 200 });
        }
    } else {
      return Response.json(
        { message: "Somthing went wrong, user not verified" },
        { status: 226 }
      );
    }
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export { handler as GET, handler as POST };
