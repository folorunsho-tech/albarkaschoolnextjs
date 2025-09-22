import prisma from "@/config/prisma";
export async function POST(request: Request) {
	// Parse the request body
	const body = await request.json();
	const { session, term } = body;
	try {
		const found = await prisma.transaction.findMany({
			where: {
				session,
				term,
			},
			include: {
				_count: {
					select: {
						items: true,
					},
				},
				student: {
					select: {
						admission_no: true,
						first_name: true,
						last_name: true,
					},
				},
			},
			orderBy: {
				updatedAt: "desc",
			},
		});
		return new Response(JSON.stringify(found), {
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
