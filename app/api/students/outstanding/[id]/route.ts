import prisma from "@/config/prisma";
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const id = (await params).id;
	// Parse the request body
	try {
		const outstandingFees = await prisma.tnxitem.findMany({
			where: {
				transaction: {
					studentId: id,
				},
				balance: {
					gt: 0,
				},
				active: true,
			},
			include: {
				fee: true,
			},
		});
		return new Response(JSON.stringify(outstandingFees), {
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
