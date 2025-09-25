export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/config/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "@/libs/jwt";

export async function POST(request: NextRequest) {
	const body = await request.json();
	const { username, password } = body;
	try {
		const user = await prisma.accounts.findFirst({
			where: {
				username,
			},
		});
		const compared = await bcrypt.compare(password, user?.passHash ?? "");
		if (!user?.active && !compared) {
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 }
			);
		} else {
			const token = await generateToken({
				userId: user?.id,
				menu: user?.permissions,
				role: user?.role,
				active: user?.active,
				username: user?.username,
			});
			const res = NextResponse.json({
				userId: user?.id,
				menu: user?.permissions,
				role: user?.role,
				active: user?.active,
				username: user?.username,
			});
			res.cookies.set("albarkaschooltoken", token, {
				httpOnly: true,
				path: "/",
			});

			return res;
		}
	} catch (error) {
		console.error("Error during login:", error);
		return new Response(JSON.stringify({ error: "Internal Server Error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
