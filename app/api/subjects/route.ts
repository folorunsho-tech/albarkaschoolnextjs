import prisma from "@/config/prisma";
import { nanoid } from "nanoid";

export async function GET(request: Request) {
	try {
		const subjects = await prisma.subjects.findMany({
			include: {
				_count: {
					select: {
						Classes: true,
					},
				},
			},
			orderBy: {
				name: "asc",
			},
		});
		return new Response(JSON.stringify(subjects), {
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

export async function POST(request: Request) {
	// Parse the request body
	const body = await request.json();
	const { name } = body;
	try {
		const created = await prisma.subjects.create({
			data: {
				id: nanoid(7),
				name,
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
