import prisma from "@/config/prisma";
export async function GET(request: Request) {
	try {
		const payments = await prisma.payment.findMany({
			include: {
				transaction: {
					include: {
						student: true,
					},
				},
				tnxItem: true,
				createdBy: {
					select: {
						username: true,
					},
				},
			},
			orderBy: {
				tnxId: "asc",
			},
		});
		return new Response(JSON.stringify(payments), {
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
