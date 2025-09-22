import prisma from "@/config/prisma";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const id = (await params).id;
	try {
		const dises = await prisma.disengagedstudent.findMany({
			where: {
				student: {
					id,
				},
			},
			include: {
				student: {
					select: {
						id: true,
						admission_no: true,
						first_name: true,
						last_name: true,
						admission_class: true,
						date_of_admission: true,
						curr_class: true,
						sex: true,
					},
				},
			},
		});
		return new Response(JSON.stringify(dises), {
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
