import prisma from "@/config/prisma";
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const id = (await params).id;
	try {
		const student = await prisma.students.findUnique({
			where: {
				id,
			},
			include: {
				curr_class: {
					select: {
						name: true,
						id: true,
						subjects: true,
						school_section: true,
					},
				},
				transactions: true,
				StudentsDemotions: true,
				StudentsPromotions: true,
				Disengagedstudent: true,
				ClassHistory: true,
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
