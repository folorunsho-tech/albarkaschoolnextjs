import prisma from "@/config/prisma";
export async function POST(request: Request) {
	// Parse the request body
	const body = await request.json();
	const { session, term, className, studentId } = body;
	try {
		const schoolFee = await prisma.tnxitem.findFirst({
			where: {
				fee: {
					name: "School Fee",
				},
				class: className,
				session,
				term,
				transaction: {
					studentId,
				},
			},
		});
		const pta = await prisma.tnxitem.findFirst({
			where: {
				fee: {
					name: "PTA",
				},
				class: className,
				term,
				session,
				transaction: {
					studentId,
				},
			},
		});
		if (!schoolFee && !pta) {
			return new Response(
				JSON.stringify({
					message: "Outsanding payment for school fee and PTA fee",
					status: "error",
				}),
				{
					status: 201,
					headers: { "Content-Type": "application/json" },
				}
			);
		} else if (!schoolFee && pta) {
			return new Response(
				JSON.stringify({
					message: "Outsanding payment for school fee",
					status: "error",
				}),
				{
					status: 201,
					headers: { "Content-Type": "application/json" },
				}
			);
		} else if (!pta && schoolFee) {
			return new Response(
				JSON.stringify({
					message: "Outsanding payment for PTA fee",
					status: "error",
				}),
				{
					status: 201,
					headers: { "Content-Type": "application/json" },
				}
			);
		} else {
			return new Response(
				JSON.stringify({
					message: "No outsanding payments",
					status: "success",
				}),
				{
					status: 201,
					headers: { "Content-Type": "application/json" },
				}
			);
		}
	} catch (error) {
		console.log(error);

		return new Response(JSON.stringify(error), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
