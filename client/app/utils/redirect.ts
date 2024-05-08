"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import UserInfo from "../models/userInfo";

export async function navigate(url: string) {
    redirect(url);
}

export async function setCookie(key: string, value: string) {
    cookies().set(key, value);
}
