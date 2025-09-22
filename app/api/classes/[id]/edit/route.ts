import prisma from "@/config/prisma";
export async function POST(
	request: Request,
	{
		params,
	}: {
		params: Promise<{ id: string }>;
	}
) {
	const id = (await params).id;
	// Parse the request body
	const body = await request.json();
	const { section, subjects } = body;
	try {
		const edited = await prisma.classes.update({
			where: {
				id,
			},
			data: {
				school_section: section,
				subjects: {
					set: [],
					connect: subjects,
				},
			},
			include: {
				subjects: true,
			},
		});
		return new Response(JSON.stringify(edited), {
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
