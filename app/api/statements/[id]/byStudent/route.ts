import prisma from "@/config/prisma";
export async function POST(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const id = (await params).id;
	// Parse the request body
	const body = await request.json();
	const { session, term, classId } = body;
	try {
		const studentClass = await prisma.classes.findUnique({
			where: {
				id: classId,
			},
			include: {
				subjects: true,
			},
		});
		const results = await prisma.students.findUnique({
			where: {
				id,
			},
			include: {
				FCAResults: {
					where: {
						session,
						term,
						class_id: classId,
					},
					select: {
						id: true,
						subject: {
							select: {
								name: true,
							},
						},
						score: true,
					},
					orderBy: {
						subject: {
							name: "asc",
						},
					},
				},
				SCAResults: {
					where: {
						session,
						term,
						class_id: classId,
					},
					select: {
						id: true,
						subject: {
							select: {
								name: true,
							},
						},
						score: true,
					},
					orderBy: {
						subject: {
							name: "asc",
						},
					},
				},
				ExamResults: {
					where: {
						session,
						term,
						class_id: classId,
					},
					select: {
						id: true,
						subject: {
							select: {
								name: true,
							},
						},
						score: true,
					},
					orderBy: {
						subject: {
							name: "asc",
						},
					},
				},
			},
		});
		return new Response(
			JSON.stringify({
				results,
				subjects: studentClass?.subjects,
				session,
				term,
				className: studentClass?.name,
				school_section: studentClass?.school_section,
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			}
		);
	} catch (error) {
		console.log(error);

		return new Response(JSON.stringify(error), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
