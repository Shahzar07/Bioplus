"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { endSession, hashPassword, startSession, verifyPassword } from "@/lib/auth";
import { limitFromEnv, rateLimit, pruneRateLimits } from "@/lib/rate-limit";

export type AuthState = { error?: string } | undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** A redirect target must stay on this site — never trust ?next= blindly. */
function safeNext(value: FormDataEntryValue | null, fallback: string): string {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}

async function clientKey(scope: string): Promise<string> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  return `${scope}:${ip}`;
}

export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
  pruneRateLimits();
  const limit = rateLimit(await clientKey("login"), {
    limit: limitFromEnv("LOGIN_RATE_LIMIT", 15),
    windowMs: 5 * 60_000,
  });
  if (!limit.ok) {
    return { error: `Too many attempts. Try again in ${limit.retryAfterSeconds} seconds.` };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const user = await db.user.findUnique({ where: { email } });

  // Same message either way — never reveal whether an account exists.
  const invalid = { error: "Email or password is incorrect." };
  if (!user?.passwordHash) return invalid;
  if (!(await verifyPassword(password, user.passwordHash))) return invalid;
  if (user.status === "SUSPENDED") {
    return { error: "This account has been suspended. Contact customerservice@biopluslabs.co.uk." };
  }

  await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await startSession(user);

  const fallback = user.role === "ADMIN" || user.role === "STAFF" ? "/admin" : "/account";
  redirect(safeNext(formData.get("next"), fallback));
}

export async function register(_prev: AuthState, formData: FormData): Promise<AuthState> {
  pruneRateLimits();
  const limit = rateLimit(await clientKey("register"), {
    limit: limitFromEnv("REGISTER_RATE_LIMIT", 20),
    windowMs: 60 * 60_000,
  });
  if (!limit.ok) {
    return { error: `Too many attempts. Try again in ${limit.retryAfterSeconds} seconds.` };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const organisation = String(formData.get("organisation") ?? "").trim();

  if (!EMAIL_RE.test(email)) return { error: "Enter a valid email address." };
  if (password.length < 10) return { error: "Choose a password of at least 10 characters." };
  if (!name) return { error: "Enter your name." };

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with that email already exists. Try signing in instead." };
  }

  const user = await db.user.create({
    data: {
      email,
      name,
      organisation: organisation || null,
      passwordHash: await hashPassword(password),
      role: "CUSTOMER",
    },
  });

  // Any guest orders placed with this email become visible in the account.
  await db.order.updateMany({ where: { email, userId: null }, data: { userId: user.id } });

  await startSession(user);
  redirect(safeNext(formData.get("next"), "/account"));
}

export async function logout() {
  await endSession();
  redirect("/");
}
