import bcryptjs from "bcryptjs";
import { db } from "@/app/lib/db";
import {sendVerificationMail} from "@/app/lib/mail";
import { NextRequest } from "next/server";
import { hash } from "bcryptjs";

async function signup(req: NextRequest) {
  // getting request parameters
  const { usr, email, pwd } = await req.json();
  const existingUserEmail = await db.user.findUnique({
    where: { email: email },
  });
  const existingUserName = await db.user.findUnique({
    where: { name: usr },
  });
  if (existingUserName)
    return Response.json(
      { user: null, error: { username: "User with this username already exists" } },
      { status: 226 }
    );
  if (existingUserEmail)
    return Response.json(
      { user: null, error: { email: "User with this email already exists" } },
      { status: 226 }
    );
  // parsing parameters
  const dImg = 'https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg'
  const hashedPwd = await hash(pwd.toString(), 10);
  const token = await bcryptjs.hash(usr.toString(), 10);
  const expire = new Date();
  const expDur = 10;
  expire.setMinutes(expire.getMinutes() + expDur);
  // creating new User at database
  const newUser = await db.user.create({
    data: {
      name: usr,
      email: email,
      isVerified: false,
      password: hashedPwd,
      token: token,
      expirationTime: expire,
      image:dImg
    }
  });
  const verifyUrl = new URL("http://localhost:3000/authentication/verification");
  verifyUrl.searchParams.append("token", token);
  verifyUrl.searchParams.append("email", email);
  const res = await sendVerificationMail(email, verifyUrl, usr, expDur);
  if (newUser && res) {
    return Response.json(
      { user: newUser, message: "User created successfully" },
      { status: 201 }
    );
  } else {
    return Response.json(
      { error: "Something went wrong, try again later" },
      { status: 226 }
    );
  }
}

export { signup as GET, signup as POST };
