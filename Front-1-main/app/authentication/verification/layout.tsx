import { Metadata } from "next";
import '@/app/styles/styles.css'

export const metadata: Metadata = {
  title: "Verification Page",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <main>{children}</main>
  );
}
