import prisma from "@/config/prisma";
export async function GET(request: Request) {
	try {
		const debtors = await prisma.tnxitem.findMany({
			where: {
				balance: {
					gt: 0,
				},
				active: true,
			},
			include: {
				transaction: {
					include: {
						student: true,
					},
				},
				fee: true,
			},
			orderBy: {
				updatedAt: "desc",
			},
		});
		return new Response(JSON.stringify(debtors), {
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
