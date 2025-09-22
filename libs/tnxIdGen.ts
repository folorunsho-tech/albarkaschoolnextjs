import prisma from "@/config/prisma";
import { mNo } from "./ynm";
export const generator = async (year: number, month: string) => {
	const Ids = await prisma.transaction.findMany({
		where: {
			year,
			month,
		},
		select: {
			id: true,
		},
		orderBy: {
			id: "desc",
		},
	});
	const yearN = Number(new Date().getFullYear().toString().substring(2));
	if (Ids.length > 0) {
		const lastId = Ids[0];
		const id = Number(lastId?.id) + 1;
		return String(id);
	} else {
		return `${yearN}${mNo}001`;
	}
};
export const Rgenerator = async (id: string) => {
	const Ids = await prisma.transaction.findUnique({
		where: {
			id,
		},
		select: {
			reciepts: {
				select: {
					id: true,
					tnxId: true,
				},
				orderBy: {
					id: "desc",
				},
			},
		},
	});
	const lastId = Ids?.reciepts[0]?.id;
	return String(Number(lastId) + 1);
};
