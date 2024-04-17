"use client";

import React, { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import "@/app/styles/styles.css";
import { options } from "@/app/api/auth/[...nextauth]/options";

type Props = {
  searchParams?: Record<"callbackUrl" | "error", string>;
};

const SignoutPage = (props: Props) => {
  const redirect_url = "http://localhost:3000/"

  return (
    <>
     <div className="form">
      <h1>Are you sure to sign out?</h1>
      <button onClick={()=> signOut({redirect:true,callbackUrl:redirect_url})}>Sign out</button>
     </div>
    </>
  );
};

export default SignoutPage;
