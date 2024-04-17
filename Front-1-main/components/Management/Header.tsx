"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import "../styles/mgmt_components.css";

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const loading = status === "loading";
  return (
    <header>
      <div className="auth-options">
        {session ? (
          <div>
          <p>{session.user?.name}</p>
          <Link className="header-link" href={"/api/auth/signout"}>
            Sign Out
          </Link>
          </div>
        ) : (
          <div>
            <Link className="header-link" href={"/api/auth/signin"}>
              Sign in
            </Link>
            <Link className="header-link" href={"/authentication/signup"}>
              Sign up
            </Link>
          </div>
        )}
      </div>
      <nav>
        <Link className="header-link" href={"/"}>
          Home
        </Link>
        <Link className="header-link" href={"/profile"}>
          User Profile
        </Link>
        <Link className="header-link" href={"/dashboard"}>
          Account Dashboard
        </Link>
        <Link className="header-link" href={"/search_tools"}>
          Search Tools
        </Link>
        <Link className="header-link" href={"/editor"}>
          Editor
        </Link>
      </nav>
    </header>
  );
}
