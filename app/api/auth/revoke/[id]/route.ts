import prisma from "@/config/prisma";

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const id = (await params).id;

	try {
		const updated = await prisma.accounts.update({
			where: {
				id,
			},
			data: {
				active: false,
			},
		});
		return new Response(JSON.stringify(updated), {
			status: 201,
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
