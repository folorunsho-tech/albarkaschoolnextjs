import prisma from "@/config/prisma";
export async function GET({ params }: { params: Promise<{ name: string }> }) {
	const name = (await params).name;
	try {
		const classes = await prisma.classes.findMany({
			where: {
				name,
			},
			include: {
				fees: true,
			},
			orderBy: {
				name: "asc",
			},
		});
		return new Response(JSON.stringify(classes), {
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
