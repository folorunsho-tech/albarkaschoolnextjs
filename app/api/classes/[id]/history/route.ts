import prisma from "@/config/prisma";
export async function POST(
	request: Request,
	{
		params,
	}: {
		params: Promise<{ id: string }>;
	}
) {
	const id = (await params).id;
	// Parse the request body
	const body = await request.json();
	const { session } = body;
	try {
		const history = await prisma.classhistory.findMany({
			where: {
				class_id: id,
				session,
			},
			include: {
				student: {
					select: {
						id: true,
						first_name: true,
						last_name: true,
						admission_no: true,
					},
				},
			},
		});
		return new Response(JSON.stringify(history), {
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
