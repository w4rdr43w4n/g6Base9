import { PropsWithChildren } from "react";
import AuthProvider from "./context/AuthProvider";
import "@/app/styles/main.css";
import { Metadata } from "next";
import Header from "@/components/Management/Header";

export const metadata: Metadata = {
  title: "G6 Research Platform",
};

export default function RootLayout({children}:PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
        </AuthProvider>
          <main>{children}</main>
      </body>
    </html>
  );
}
