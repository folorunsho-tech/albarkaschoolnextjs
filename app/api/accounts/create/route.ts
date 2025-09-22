export const runtime = "nodejs";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import prisma from "@/config/prisma";

export async function POST(request: Request) {
	// Parse the request body
	const body = await request.json();
	const { username, password, permissions, role, subjects } = body;
	const passHash = await bcrypt.hash(password, 10);
	try {
		const created = await prisma.accounts.create({
			data: {
				id: nanoid(),
				username,
				permissions,
				passHash,
				role,
				subjects: {
					connect: subjects,
				},
			},
		});
		return new Response(JSON.stringify(created), {
			status: 201,
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
