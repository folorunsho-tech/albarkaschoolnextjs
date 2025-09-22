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
		const found = await prisma.reciept.findMany({
			where: {
				tnxId: id,
			},
			include: {
				createdBy: {
					select: {
						username: true,
					},
				},
				transaction: {
					select: {
						student: {
							select: {
								admission_no: true,
								first_name: true,
								last_name: true,
								address: true,
							},
						},
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
