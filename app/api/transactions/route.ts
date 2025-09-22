import { nanoid } from "nanoid";
import prisma from "@/config/prisma";
import { curMonth, curYear } from "@/libs/ynm";
import { generator } from "@/libs/tnxIdGen";

export async function GET(request: Request) {
	try {
		const found = await prisma.transaction.findMany({
			include: {
				items: true,
				reciepts: true,
				student: true,
			},
		});
		return new Response(JSON.stringify(found), {
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
		total,
		balance,
		items,
		status,
		studentId,
		createdById,
		curr_class,
		session,
		term,
	} = body;
	const Items = items.map(
		(item: {
			feeId: any;
			price: any;
			paid: any;
			balance: any;
			name: any;
			method: any;
		}) => {
			return {
				id: nanoid(8),
				feeId: item?.feeId,
				price: item?.price,
				paid: item?.paid,
				balance: item?.balance,
				year: curYear,
				month: curMonth,
				name: item?.name,
				method: item?.method,
				class: curr_class,
				session,
				term,
			};
		}
	);
	const tnxItems = Items.map(
		(item: { id: any; feeId: any; price: any; paid: any; balance: any }) => {
			return {
				id: item?.id,
				feeId: item?.feeId,
				price: item?.price,
				paid: item?.paid,
				balance: item?.balance,
				year: curYear,
				month: curMonth,
				class: curr_class,
				session,
				term,
			};
		}
	);
	const payments = Items.map(
		(item: { id: any; paid: any; name: any; method: any }) => {
			return {
				id: nanoid(8),
				itemId: item?.id,
				paid: item?.paid,
				year: curYear,
				month: curMonth,
				name: item?.name,
				method: item?.method,
				createdById,
				class: curr_class,
				session,
				term,
			};
		}
	);
	const id = await generator(curYear, curMonth);
	try {
		const created = await prisma.transaction.create({
			data: {
				id,
				total,
				status,
				balance,
				studentId,
				class: curr_class,
				session,
				term,
				items: {
					createMany: {
						data: tnxItems,
					},
				},
				payments: {
					createMany: {
						data: payments,
					},
				},
				year: curYear,
				month: curMonth ?? "",
				reciepts: {
					create: {
						id: `${id}${1}`,
						items: JSON.stringify(Items),
						year: curYear,
						month: curMonth ?? "",
						status,
						createdById,
					},
				},
				createdById,
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
