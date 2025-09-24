"use server";
import { decodeToken } from "@/libs/jwt";
import { cookies } from "next/headers";
const getUser = async (name: string) => {
	const cookieStore = await cookies();
	const cookie = cookieStore.get(name);
	const user = await decodeToken(cookie?.value || "");
	return user;
};
export default getUser;
