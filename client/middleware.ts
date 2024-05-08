import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith("/telegram")) {
        if(!request.nextUrl.pathname.endsWith("/authorization") && 
            !request.cookies.get("telegram_id"))
            return NextResponse.redirect("http://localhost:44144/telegram/authorization");
    }
    if (request.nextUrl.pathname.startsWith("/vkontakte")) {
        if(!request.nextUrl.pathname.includes("/authorization") &&
            !request.cookies.get("vkontakte_id"))
            return NextResponse.redirect("http://localhost:44144/vkontakte/authorization");
    }
}

export const config = {
    matcher: ["/telegram/:path*", "/vkontakte/:path*"],
};
