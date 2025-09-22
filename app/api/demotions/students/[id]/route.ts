import prisma from "@/config/prisma";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const id = (await params).id;
	try {
		const demotions = await prisma.studentsdemotions.findMany({
			where: {
				student: {
					id,
				},
			},
			orderBy: {
				demotedOn: "desc",
			},
			include: {
				student: true,
				to: true,
			},
		});
		return new Response(JSON.stringify(demotions), {
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
