import prisma from "@/config/prisma";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const id = (await params).id.substring(0, 7);
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
				reciepts: true,
				student: {
					select: {
						id: true,
						first_name: true,
						last_name: true,
						admission_no: true,
						address: true,
					},
				},
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
