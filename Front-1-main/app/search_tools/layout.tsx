import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Research Tools",
  description: "A collection of Research tools developed by G6 company",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {children}
    </div>
  );
}
