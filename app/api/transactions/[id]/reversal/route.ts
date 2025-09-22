import { nanoid } from "nanoid";
import prisma from "@/config/prisma";
import { Rgenerator } from "@/libs/tnxIdGen";
import { curMonth, curYear } from "@/libs/ynm";

export async function POST(
	request: Request,
	{
		params,
	}: {
		params: Promise<{ id: string }>;
	}
) {
	const id = (await params).id.substring(0, 7);
	// Parse the request body
	const body = await request.json();
	const { status, toReverse, updatedById, curr_class, session, term } = body;
	const payments = toReverse.map((item: { id: any; paid: any; name: any }) => {
		return {
			id: nanoid(8),
			itemId: item?.id,
			paid: item?.paid,
			year: curYear,
			month: curMonth,
			name: item?.name,
			method: "",
			type: "reversal",
			createdById: updatedById,
			class: curr_class,
			session,
			term,
		};
	});

	try {
		toReverse.forEach(async (i: { id: any; active: any }) => {
			await prisma.tnxitem.update({
				where: {
					id: i?.id,
				},
				data: {
					active: i?.active,
				},
			});
		});
		const updated = await prisma.transaction.update({
			where: {
				id,
			},
			data: {
				status,
				payments: {
					createMany: {
						data: payments,
					},
				},
				updatedById,
				updatedAt: new Date(),
			},
		});
		return new Response(JSON.stringify(updated), {
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
