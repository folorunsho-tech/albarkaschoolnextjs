import prisma from "@/config/prisma";
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const id = (await params).id;
	console.log(id);
	try {
		const currClass = await prisma.classes.findUnique({
			where: {
				id,
			},
			include: {
				subjects: {
					select: {
						name: true,
						id: true,
					},
					orderBy: {
						name: "asc",
					},
				},
				Students: {
					where: {
						active: true,
					},
					select: {
						first_name: true,
						last_name: true,
						admission_no: true,
						sex: true,
						religion: true,
						guardian_name: true,
						guardian_telephone: true,
					},
				},
				ClassHistory: {
					select: {
						student: true,
						session: true,
					},
				},
				_count: {
					select: {
						subjects: true,
						Students: true,
					},
				},
			},
		});
		return new Response(JSON.stringify(currClass), {
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
