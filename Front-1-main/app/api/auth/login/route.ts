import { db } from "@/app/lib/db";
import { NextRequest } from "next/server";
import { compare } from "bcryptjs";

async function login(req: NextRequest) {
  const { usr, pwd } = await req.json();
  try {
    const userData = await db.user.findUnique({
      where: {
        name: usr,
      },
      select: {
        password: true,
        isVerified: true,
        id: true,
        email: true,
        token: true,
      },
    });
    if (!userData)
      return Response.json(
        { message: "User with this username don't exist" },
        { status: 226 }
      );

    let passwordCheck;
    if (userData?.password) {
      passwordCheck = await compare(pwd, userData.password);
    }

    if (!passwordCheck) {
      return Response.json({ message: "Wrong Password" }, { status: 226 });
    }
    if (!userData.isVerified) {
      return Response.json(
        { message: "Your account is not verified" },
        { status: 226 }
      );
    }
    return Response.json(
      {
        message: "logged in successfully",
        userId: userData.id,
        email: userData.email,
        token: userData.token,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.log(`ERROR:${err.message}`);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export { login as GET, login as POST };
