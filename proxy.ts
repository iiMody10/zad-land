import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const headers = new Headers(request.headers);
    headers.set("x-admin-return-to", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    // The dashboard layout verifies the actual Laravel session. Cookie names
    // are configurable and must not decide whether a user is signed in.
    return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ["/admin/:path*"] };
