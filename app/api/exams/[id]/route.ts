import prisma from "@/config/prisma";
export async function GET(
	request: Request,
	{
		params,
	}: {
		params: Promise<{ id: string }>;
	}
) {
	const id = (await params).id;
	try {
		const exam = await prisma.examresults.findUnique({
			where: {
				id,
			},
			include: {
				student: true,
				subject: true,
				class: true,
			},
		});
		return new Response(JSON.stringify(exam), {
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
