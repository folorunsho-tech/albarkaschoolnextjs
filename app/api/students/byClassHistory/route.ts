import prisma from "@/config/prisma";
export async function POST(request: Request) {
	// Parse the request body
	const body = await request.json();
	const { session, class_id } = body;
	try {
		const students = await prisma.classhistory.findMany({
			where: {
				session,
				class_id,
			},
			include: {
				student: {
					select: {
						first_name: true,
						last_name: true,
						admission_no: true,
						id: true,
					},
				},
			},
		});
		return new Response(JSON.stringify(students), {
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
