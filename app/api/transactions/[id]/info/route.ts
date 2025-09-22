import prisma from "@/config/prisma";

export async function GET(
	request: Request,
	{
		params,
	}: {
		params: Promise<{ id: string }>;
	}
) {
	const id = (await params).id;
	try {
		const found = await prisma.transaction.findUnique({
			where: {
				id,
			},
			include: {
				items: {
					include: {
						fee: true,
					},
				},
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
