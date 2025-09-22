import prisma from "@/config/prisma";
export async function POST(request: Request) {
	// Parse the request body
	const body = await request.json();
	const { from, to } = body;
	try {
		const found = await prisma.tnxitem.findMany({
			where: {
				AND: [
					{
						updatedAt: {
							gte: new Date(new Date(from).setUTCHours(0, 0, 0, 0)),
						},
					},
					{
						updatedAt: {
							lte: new Date(new Date(to).setUTCHours(23, 59, 59, 999)),
						},
					},
					{
						active: true,
					},
				],
			},
			include: {
				transaction: {
					include: {
						student: true,
					},
				},
				fee: true,
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
