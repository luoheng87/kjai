import { NextResponse } from "next/server";
import { auth, signOut } from "@/lib/auth";

export async function POST() {
  const session = await auth();
  if (session) {
    await signOut({ redirect: false });
  }
  return NextResponse.redirect(new URL("/", process.env.NEXTAUTH_URL ?? "http://localhost:3000"));
}
