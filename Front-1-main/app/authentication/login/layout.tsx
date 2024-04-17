import { ReactNode } from "react";
import { Metadata } from "next";
import '@/app/styles/styles.css'

export const metadata: Metadata = {
  title: "Login",
};

export default function Layout({children}:{children:ReactNode}){
  return (
    <section className="layout">{children}</section>
  )
}