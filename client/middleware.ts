import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    if (!request.nextUrl.pathname.includes("/authorization")) {
        if (
            request.nextUrl.pathname.startsWith("/telegram") &&
            !request.cookies.get("telegram_id")
        ) {
            return NextResponse.redirect(
                "http://localhost:44144/telegram/authorization",
            );
        } else if (
            request.nextUrl.pathname.startsWith("/vkontakte") &&
            !request.cookies.get("vkontakte_id")
        ) {
            return NextResponse.redirect(
                "http://localhost:44144/vkontakte/authorization",
            );
        }
    }
}

export const config = {
    matcher: ["/telegram/:path*", "/vkontakte/:path*"],
};
