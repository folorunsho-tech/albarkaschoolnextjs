import prisma from "@/config/prisma";
export async function POST(request: Request) {
	// Parse the request body
	const body = await request.json();
	const { session } = body;
	try {
		const students = await prisma.students.findMany({
			where: {
				active: true,
				admission_session: session,
			},
			include: {
				curr_class: true,
				StudentsDemotions: true,
				StudentsPromotions: true,
				ClassHistory: true,
			},
			orderBy: {
				updatedAt: "desc",
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
