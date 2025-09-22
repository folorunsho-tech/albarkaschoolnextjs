import prisma from "@/config/prisma";
export async function POST(request: Request) {
	// Parse the request body
	const body = await request.json();
	const { value } = body;
	try {
		const found = await prisma.transaction.findMany({
			where: {
				AND: [
					{
						updatedAt: {
							gte: new Date(new Date(value).setUTCHours(0, 0, 0, 0)),
						},
					},
					{
						updatedAt: {
							lte: new Date(new Date(value).setUTCHours(23, 0, 0, 0)),
						},
					},
				],
			},
			include: {
				_count: {
					select: {
						items: true,
					},
				},
				student: true,
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
