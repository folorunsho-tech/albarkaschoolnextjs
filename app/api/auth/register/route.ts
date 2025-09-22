export const runtime = "nodejs";
import prisma from "@/config/prisma";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
	// Parse the request body
	const body = await request.json();
	const { username, password, permissions, role } = body;
	try {
		const passHash = await bcrypt.hash(password, 10);
		const created = await prisma.accounts.create({
			data: {
				id: nanoid(),
				username,
				permissions,
				passHash,
				role,
			},
		});
		return new Response(JSON.stringify(created), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify(error), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
