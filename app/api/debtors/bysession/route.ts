import prisma from "@/config/prisma";
export async function POST(request: Request) {
	// Parse the request body
	const body = await request.json();
	const { session } = body;
	try {
		const found = await prisma.tnxitem.findMany({
			where: {
				session,
				balance: {
					gt: 0,
				},
				active: true,
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
