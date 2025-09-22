import prisma from "@/config/prisma";
export async function GET(request: Request) {
	try {
		const students = await prisma.students.findMany({
			where: {
				active: true,
			},
			include: {
				curr_class: {
					include: {
						fees: true,
					},
				},
				transactions: true,
			},
			orderBy: {
				updatedAt: "desc",
			},
		});
		return new Response(JSON.stringify(students), {
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
