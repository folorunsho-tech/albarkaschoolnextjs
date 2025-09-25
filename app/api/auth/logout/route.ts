import { NextResponse } from "next/server";

export async function POST() {
	const res = NextResponse.json({ success: true });
	res.cookies.set("albarkaschooltoken", "", { maxAge: 0 });
	return res;
}
