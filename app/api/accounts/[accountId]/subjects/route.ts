import prisma from "@/config/prisma";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ accountId: string }> }
) {
	const accountId = (await params).accountId;
	try {
		const account = await prisma.accounts.findUnique({
			where: {
				id: accountId,
			},
			select: {
				subjects: true,
			},
		});
		return new Response(JSON.stringify(account), {
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
