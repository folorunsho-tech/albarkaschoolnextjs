import prisma from "@/config/prisma";
import { nanoid } from "nanoid";

export async function GET(request: Request) {
	try {
		const classes = await prisma.classes.findMany({
			include: {
				_count: {
					select: {
						Students: {
							where: {
								active: true,
							},
						},
						subjects: true,
					},
				},
				subjects: true,
				Students: true,
				fees: true,
				ClassHistory: {
					select: {
						student: true,
						session: true,
					},
				},
			},
			orderBy: {
				name: "asc",
			},
		});
		return new Response(JSON.stringify(classes), {
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
	const { name, section, subjects } = body;
	try {
		const created = await prisma.classes.create({
			data: {
				id: nanoid(7),
				school_section: section,
				name,
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
