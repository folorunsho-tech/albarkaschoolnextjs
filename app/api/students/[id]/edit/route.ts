import prisma from "@/config/prisma";
export async function POST(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const id = (await params).id;
	// Parse the request body
	const body = await request.json();
	const { curr_class_id } = body;
	try {
		const edited = await prisma.students.update({
			where: {
				id: id,
			},
			data: { ...body },
		});
		if (edited.curr_class_id !== curr_class_id) {
			const connectHistory = await prisma.classhistory.create({
				data: {
					student_id: edited?.id,
					session: edited?.admission_session,
					class_id: edited.curr_class_id,
				},
			});

			return new Response(JSON.stringify({ edited, connectHistory }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
		} else {
			return new Response(JSON.stringify(edited), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
		}
	} catch (error) {
		console.log(error);

		return new Response(JSON.stringify(error), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
