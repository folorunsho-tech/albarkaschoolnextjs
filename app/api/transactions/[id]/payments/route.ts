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
		const found = await prisma.payment.findMany({
			where: {
				tnxId: id,
			},
			include: {
				createdBy: {
					select: {
						username: true,
					},
				},
			},
			orderBy: {
				updatedAt: "desc",
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
