import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function Layout({children}:{children:ReactNode}){
  return (
    <>{children}</>
  )
}