import prisma from "@/config/prisma";

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const id = (await params).id;
	// Parse the request body
	const body = await request.json();

	try {
		const edited = await prisma.fcaresults.update({
			where: {
				id,
			},
			data: { ...body },
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
