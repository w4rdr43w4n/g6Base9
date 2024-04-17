import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Profile",
};

export default function Layout({children}:{children:ReactNode}){
  return <>{children}</>
}