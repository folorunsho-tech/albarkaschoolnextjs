import { nanoid } from "nanoid";
import prisma from "@/config/prisma";

export async function GET(request: Request) {
	try {
		const SCAResults = await prisma.scaresults.findMany({
			orderBy: {
				updatedAt: "desc",
			},
			include: {
				class: true,
				subject: true,
				student: true,
			},
		});
		return new Response(JSON.stringify(SCAResults), {
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

export async function POST(request: Request) {
	// Parse the request body
	const body = await request.json();
	const {
		uploads,
		createdById,
	}: {
		uploads: Array<{
			student_id: string;
			class_id: string;
			subject_id: string;
			term: string;
			session: string;
			score: number;
		}>;
		createdById: string;
	} = body;
	try {
		uploads.forEach(async (upload) => {
			const { student_id, class_id, subject_id, term, session, score } = upload;
			const found = await prisma.scaresults.findFirst({
				where: {
					student_id,
					class_id,
					subject_id,
					term,
					session,
				},
			});
			if (found) {
				await prisma.scaresults.update({
					where: {
						id: found?.id,
					},
					data: {
						score,
					},
				});
			} else {
				await prisma.scaresults.create({
					data: {
						id: nanoid(7),
						...upload,
						createdById,
					},
				});
			}
		});
		return new Response(JSON.stringify("done"), {
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
