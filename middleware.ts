import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * Edge gate for the private areas.
 *
 * This only checks that a valid session cookie exists and carries a staff role
 * — it is a cheap redirect for anonymous visitors, not the authorisation
 * boundary. Every /admin page and server action independently calls
 * requireStaff()/requireAdmin(), which re-reads the user from the database.
 */

const SESSION_COOKIE = "bioplus_session";

async function roleFromRequest(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET ?? "");
    const { payload } = await jwtVerify(token, secret);
    return (payload.role as string) ?? null;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const role = await roleFromRequest(req);

  const signIn = () => {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  };

  if (pathname.startsWith("/admin")) {
    if (!role) return signIn();
    if (role !== "ADMIN" && role !== "STAFF") {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/account") && !role) return signIn();

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/account", "/account/:path*"],
};
