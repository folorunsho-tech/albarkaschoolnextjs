import prisma from "@/config/prisma";
export async function POST(request: Request) {
	// Parse the request body
	const body = await request.json();
	const { session } = body;
	try {
		const demotions = await prisma.studentsdemotions.findMany({
			where: {
				session,
			},
			orderBy: {
				demotedOn: "desc",
			},
			include: {
				student: true,
				to: true,
			},
		});
		return new Response(JSON.stringify(demotions), {
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
