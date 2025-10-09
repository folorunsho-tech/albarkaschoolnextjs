import prisma from "@/config/prisma";
export async function POST(request: Request) {
	// Parse the request body
	const body = await request.json();
	const { value } = body;
	try {
		if (value !== "") {
			const found = await prisma.payment.findMany({
				where: {
					transaction: {
						studentId: value,
					},
				},
				include: {
					transaction: {
						select: {
							id: true,
							student: {
								select: {
									admission_no: true,
									first_name: true,
									last_name: true,
								},
							},
						},
					},
					createdBy: {
						select: {
							username: true,
						},
					},
				},
				orderBy: { createdAt: "desc" },
			});
			return new Response(JSON.stringify(found), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
		} else {
			return new Response(JSON.stringify([]), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
		}
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify(error), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
