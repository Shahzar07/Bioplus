import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { db } from "@/lib/db";
import type { Role, User } from "@/generated/prisma";

/**
 * Session handling.
 *
 * A signed JWT in an httpOnly cookie carries the user id and role. The role is
 * embedded so middleware can gate /admin at the edge without a database round
 * trip, but every server component and action that acts on a user re-reads
 * them from the database — a role change or suspension must take effect
 * immediately, not when the cookie happens to expire.
 */

const COOKIE = "bioplus_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export type SessionPayload = {
  sub: string;
  role: Role;
  email: string;
};

function secret(): Uint8Array {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) {
    throw new Error("AUTH_SECRET must be set to at least 32 characters — see .env.example");
  }
  return new TextEncoder().encode(value);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ role: payload.role, email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secret());
}

export async function readSessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub) return null;
    return {
      sub: payload.sub,
      role: payload.role as Role,
      email: payload.email as string,
    };
  } catch {
    return null;
  }
}

export async function startSession(user: Pick<User, "id" | "role" | "email">) {
  const token = await signSession({ sub: user.id, role: user.role, email: user.email });
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function endSession() {
  const store = await cookies();
  store.delete(COOKIE);
}

/**
 * The signed-in user, or null. Cached per request so a page that checks auth in
 * several components still issues one query.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;

  const session = await readSessionToken(token);
  if (!session) return null;

  const user = await db.user.findUnique({ where: { id: session.sub } });
  if (!user || user.status === "SUSPENDED") return null;
  return user;
});

/** For customer-facing areas: /account and checkout-linked pages. */
export async function requireUser(returnTo = "/account"): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(returnTo)}`);
  return user;
}

export function isStaff(user: Pick<User, "role"> | null): boolean {
  return user?.role === "ADMIN" || user?.role === "STAFF";
}

/** For everything under /admin. */
export async function requireStaff(returnTo = "/admin"): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(returnTo)}`);
  if (!isStaff(user)) redirect("/");
  return user;
}

/** Destructive settings (user roles, deletions) are ADMIN-only. */
export async function requireAdmin(returnTo = "/admin"): Promise<User> {
  const user = await requireStaff(returnTo);
  if (user.role !== "ADMIN") redirect("/admin");
  return user;
}

export const SESSION_COOKIE = COOKIE;
