import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "../AuthForm";
import { login } from "../actions";
import { getCurrentUser, isStaff } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your BioPlus Labs Research Hub.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const user = await getCurrentUser();
  if (user) redirect(isStaff(user) ? "/admin" : "/account");

  return <AuthForm mode="login" action={login} next={next} />;
}
