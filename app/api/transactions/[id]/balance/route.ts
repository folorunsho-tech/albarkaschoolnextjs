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
	const { balance, items, status, updatedById, curr_class, session, term } =
		body;
	const Items = items.map(
		(item: { paid: any; price: any; balance: any; name: any; method: any }) => {
			return {
				id: nanoid(8),
				paid: item?.paid,
				price: item?.price,
				balance: item?.balance,
				name: item?.name,
				method: item?.method,
			};
		}
	);
	const tnxItems = items.map((item: { id: any; mpaid: any; balance: any }) => {
		return {
			id: item?.id,
			paid: item?.mpaid,
			balance: item?.balance,
		};
	});
	const payments = items.map(
		(item: { id: any; paid: any; name: any; method: any }) => {
			return {
				id: nanoid(8),
				itemId: item?.id,
				paid: item?.paid,
				year: curYear,
				month: curMonth,
				name: item?.name,
				method: item?.method,
				type: "balance",
				createdById: updatedById,
				class: curr_class,
				session,
				term,
			};
		}
	);
	const recieptId = await Rgenerator(id);
	try {
		tnxItems.forEach(async (i: any) => {
			await prisma.tnxitem.update({
				where: {
					id: i?.id,
				},
				data: {
					paid: i?.paid,
					balance: i?.balance,
				},
			});
		});
		const updated = await prisma.transaction.update({
			where: {
				id,
			},
			data: {
				status,
				balance,
				payments: {
					createMany: {
						data: payments,
					},
				},
				reciepts: {
					create: {
						id: recieptId,
						items: JSON.stringify(Items),
						year: curYear,
						month: curMonth ?? "",
						status,
						createdById: updatedById,
					},
				},
				updatedById,
				updatedAt: new Date(),
			},
			select: {
				reciepts: {
					include: {
						createdBy: {
							select: {
								username: true,
							},
						},
						transaction: {
							select: {
								student: {
									select: {
										admission_no: true,
										first_name: true,
										last_name: true,
										address: true,
									},
								},
							},
						},
					},
					orderBy: {
						createdAt: "desc",
					},
				},
				_count: {
					select: {
						items: true,
					},
				},
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
