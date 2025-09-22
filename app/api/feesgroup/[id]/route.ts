import prisma from "@/config/prisma";
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const id = (await params).id;
	try {
		const feesGroup = await prisma.feesgroup.findUnique({
			where: { id },
			include: { classes: true },
		});
		return new Response(JSON.stringify(feesGroup), {
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
