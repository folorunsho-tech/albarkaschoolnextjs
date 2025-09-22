import prisma from "@/config/prisma";
export async function POST(request: Request) {
	// Parse the request body
	const body = await request.json();
	const { session, term } = body;
	try {
		const dises = await prisma.disengagedstudent.findMany({
			where: {
				session,
				term,
			},
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
