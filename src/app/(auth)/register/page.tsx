import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "../AuthForm";
import { register } from "../actions";
import { getCurrentUser, isStaff } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create a BioPlus Labs account to track orders and download Certificates of Analysis.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const user = await getCurrentUser();
  if (user) redirect(isStaff(user) ? "/admin" : "/account");

  return <AuthForm mode="register" action={register} next={next} />;
}
