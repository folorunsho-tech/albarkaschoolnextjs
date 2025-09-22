import prisma from "@/config/prisma";

export async function POST(request: Request) {
	const body = await request.json();
	const { value } = body;
	try {
		if (value !== "") {
			const found = await prisma.students.findMany({
				where: {
					OR: [
						{
							admission_no: {
								contains: value,
							},
						},
						{
							first_name: {
								contains: value,
							},
						},
						{
							last_name: {
								contains: value,
							},
						},
					],
				},
				take: 100,
				include: {
					curr_class: {
						select: {
							id: true,
							name: true,
							fees: true,
						},
					},
				},
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
