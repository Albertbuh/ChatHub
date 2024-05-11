"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export async function navigate(url: string) {
    redirect(url);
}

export async function setCookie(key: string, value: string, cookie?: Partial<ResponseCookie> | undefined) {
    cookies().set(key, value, cookie);
}
