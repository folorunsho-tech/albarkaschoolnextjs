import { verifyToken } from "@/libs/jwt";
import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
	const token = request.cookies.get("albarkaschooltoken");
	if (!token)
		return new Response(JSON.stringify({ error: "Unauthorized" }), {
			status: 401,
			headers: { "Content-Type": "application/json" },
		});
	try {
		const user = await verifyToken(request);
		const res = NextResponse.json(user);
		return res;
	} catch (error) {
		console.log(error);

		return new Response(JSON.stringify({ error: "Invalid Token" }), {
			status: 403,
			headers: { "Content-Type": "application/json" },
		});
	}
}
