import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { loginRequest } from "./app/utils/getRequests";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith("/telegram")) {
        if (
            !request.nextUrl.pathname.endsWith("/authorization") &&
            !request.cookies.get("telegram_id")
        ) {
            //check if user already logged
            var phone = localStorage.getItem("telegram_phone");
            if (!phone) {
                return NextResponse.redirect(
                    "http://localhost:44144/telegram/authorization",
                );
            }

            //send request to save data to localStorage and cookies
            await loginRequest(
                "telegram",
                `http://localhost:5041/api/v1.0/telegram/login?info=${phone}`,
            );
        }
    } else if (request.nextUrl.pathname.startsWith("/vkontakte")) {
        if (
            !request.nextUrl.pathname.includes("/authorization") &&
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
