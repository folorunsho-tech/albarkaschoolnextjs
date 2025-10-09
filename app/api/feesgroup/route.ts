import { nanoid } from "nanoid";
import prisma from "@/config/prisma";
export async function GET(request: Request) {
	try {
		const feesGroup = await prisma.feesgroup.findMany({
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

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	// Parse the request body
	const body = await request.json();
	const { name, amount, classes } = body;
	try {
		const created = await prisma.feesgroup.create({
			data: {
				id: nanoid(7),
				name,
				amount,
				classes: {
					connect: classes,
				},
			},
		});
		return new Response(JSON.stringify(created), {
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
