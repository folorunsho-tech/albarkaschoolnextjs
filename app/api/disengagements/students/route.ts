import prisma from "@/config/prisma";
import { nanoid } from "nanoid";
export async function GET(request: Request) {
	try {
		const dises = await prisma.disengagedstudent.findMany({
			include: {
				student: {
					select: {
						id: true,
						admission_no: true,
						first_name: true,
						last_name: true,
						admission_class: true,
						date_of_admission: true,
						curr_class: true,
						sex: true,
					},
				},
			},
		});
		return new Response(JSON.stringify(dises), {
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
	try {
		const dis = await prisma.disengagedstudent.create({
			data: { ...body },
			include: {
				student: true,
			},
		});
		if (dis.student_id)
			await prisma.students.update({
				where: {
					id: dis.student_id,
				},
				data: {
					active: false,
				},
			});
		return new Response(JSON.stringify(dis), {
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
