import prisma from "@/config/prisma";
export async function POST(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const id = (await params).id;
	// Parse the request body
	const body = await request.json();
	const { session, term } = body;
	try {
		const results = await prisma.classes.findMany({
			where: {
				id,
			},
			include: {
				Students: true,
				FCAResults: {
					where: {
						session,
						term,
					},
					select: {
						id: true,
						subject: true,
						student: true,
						student_id: true,
						score: true,
						session: true,
						term: true,
					},
				},
				SCAResults: {
					where: {
						session,
						term,
					},
					select: {
						id: true,
						subject: true,
						student: true,
						student_id: true,
						score: true,
						session: true,
						term: true,
					},
				},
				ExamResults: {
					where: {
						session,
						term,
					},
					select: {
						id: true,
						subject: true,
						student: true,
						student_id: true,
						score: true,
						session: true,
						term: true,
					},
				},
			},
		});
		return new Response(JSON.stringify(results), {
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
