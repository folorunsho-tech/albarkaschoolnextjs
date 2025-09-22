import prisma from "@/config/prisma";
export async function POST(request: Request) {
	// Parse the request body
	const body = await request.json();
	const { from, to } = body;
	try {
		const found = await prisma.payment.findMany({
			where: {
				AND: [
					{
						createdAt: {
							gte: new Date(new Date(from).setUTCHours(0, 0, 0, 0)),
						},
					},
					{
						createdAt: {
							lte: new Date(new Date(to).setUTCHours(23, 59, 59, 999)),
						},
					},
				],
			},
			include: {
				transaction: {
					include: {
						student: true,
					},
				},
				tnxItem: true,
				createdBy: {
					select: {
						username: true,
					},
				},
			},
			orderBy: {
				tnxId: "asc",
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
