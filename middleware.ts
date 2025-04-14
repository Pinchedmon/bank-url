import { NextRequest, NextResponse } from "next/server";

// middleware.ts

export function middleware(request: NextRequest) {
  const user = request.cookies.get("user")?.value;
  const path = request.nextUrl.pathname;

  if (!user && path !== "/auth") {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  const userData = user ? JSON.parse(user) : null;

  if (userData) {
    if (path.startsWith("/dashboard/client") && userData.role !== "CLIENT") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (path.startsWith("/dashboard/admin") && userData.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (
      path.startsWith("/dashboard/employee") &&
      !["EMPLOYEE", "ADMIN"].includes(userData.role)
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
