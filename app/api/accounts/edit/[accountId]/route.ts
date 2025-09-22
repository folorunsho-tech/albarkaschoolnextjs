import prisma from "@/config/prisma";
import bcrypt from "bcrypt";
export async function POST(
	request: Request,
	{
		params,
	}: {
		params: Promise<{ accountId: string }>;
	}
) {
	const accountId = (await params).accountId;

	// Parse the request body
	const body = await request.json();
	const { username, password, permissions, updatedById, role, subjects } = body;
	try {
		if (password) {
			const passHash = await bcrypt.hash(password, 10);
			const edited = await prisma.accounts.update({
				where: {
					id: accountId,
				},
				data: {
					username,
					permissions,
					passHash,
					updatedById,
					role,
					subjects: {
						set: [],
						connect: subjects,
					},
				},
			});
			return new Response(JSON.stringify(edited), {
				status: 201,
				headers: { "Content-Type": "application/json" },
			});
		} else {
			const edited = await prisma.accounts.update({
				where: {
					id: accountId,
				},
				data: {
					username,
					permissions,
					updatedById,
					role,
					subjects: {
						set: [],
						connect: subjects,
					},
				},
			});
			return new Response(JSON.stringify(edited), {
				status: 201,
				headers: { "Content-Type": "application/json" },
			});
		}
	} catch (error) {
		console.log(error);

		return new Response(JSON.stringify(error), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
