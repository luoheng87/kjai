import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const form = await request.formData();
  const path = (form.get("path") as string) || "/";

  revalidatePath(path);
  revalidatePath("/directory");
  revalidatePath("/hub");
  revalidatePath("/media");
  revalidatePath("/events");

  return NextResponse.redirect(new URL("/admin?revalidated=1", request.url));
}
