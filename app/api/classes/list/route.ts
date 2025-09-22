import prisma from "@/config/prisma";
export async function GET(request: Request) {
	try {
		const classes = await prisma.classes.findMany({
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
