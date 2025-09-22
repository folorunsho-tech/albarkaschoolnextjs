import prisma from "@/config/prisma";
export async function POST(request: Request) {
	// Parse the request body
	const body = await request.json();
	const { session, term } = body;
	try {
		const promotions = await prisma.studentspromotions.findMany({
			where: {
				session,
				term,
			},
			orderBy: {
				promotedOn: "desc",
			},
			include: {
				student: true,
				to: true,
			},
		});
		return new Response(JSON.stringify(promotions), {
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
