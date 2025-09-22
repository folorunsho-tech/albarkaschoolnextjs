import prisma from "@/config/prisma";
import { nanoid } from "nanoid";
export async function GET(request: Request) {
	try {
		const promotions = await prisma.studentspromotions.findMany({
			orderBy: {
				promotedOn: "desc",
			},
			include: {
				student: true,
				to: true,
			},
		});
		return new Response(JSON.stringify(promotions), {
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
	const { session } = body;
	try {
		const created = await prisma.studentspromotions.create({
			data: {
				id: nanoid(7),
				...body,
			},
		});
		const updated = await prisma.students.update({
			where: {
				id: created.student_id,
			},
			data: {
				curr_class_id: created.to_id,
			},
		});
		const connectHistory = await prisma.classhistory.create({
			data: {
				student_id: updated?.id,
				class_id: updated?.curr_class_id,
				session,
			},
		});
		return new Response(JSON.stringify({ created, connectHistory }), {
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
