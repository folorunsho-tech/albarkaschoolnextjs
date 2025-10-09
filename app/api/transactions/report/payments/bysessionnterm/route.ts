import prisma from "@/config/prisma";
export async function POST(request: Request) {
	// Parse the request body
	const body = await request.json();
	const { session, term } = body;
	try {
		const found = await prisma.payment.findMany({
			where: {
				session,
				term,
			},
			include: {
				tnxItem: true,
				transaction: {
					include: {
						student: true,
					},
				},
				createdBy: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});
		return new Response(JSON.stringify(found), {
			status: 200,
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
