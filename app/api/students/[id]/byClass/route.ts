import prisma from "@/config/prisma";
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const id = (await params).id;
	try {
		const student = await prisma.students.findMany({
			where: {
				AND: [{ curr_class_id: id }, { active: true }],
			},
			include: {
				curr_class: true,
			},
		});
		return new Response(JSON.stringify(student), {
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
