import prisma from "@/config/prisma";

export async function POST(request: Request) {
	// Parse the request body
	const body = await request.json();
	const { value } = body;
	try {
		const found = await prisma.transaction.findMany({
			where: {
				student: {
					admission_no: value,
				},
				balance: {
					gt: 0,
				},
			},
			include: {
				items: {
					include: {
						fee: true,
					},
				},
				reciepts: true,
				student: true,
				updatedBy: {
					select: {
						username: true,
					},
				},
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
