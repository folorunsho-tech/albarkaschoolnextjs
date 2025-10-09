"use client";
import { useEffect, useState } from "react";
import { useFetch } from "@/hooks/useQueries";
import PaginatedTable from "../PaginatedTable";
import { NumberFormatter, Table } from "@mantine/core";
import { format } from "date-fns";
const Payments = ({ id }: { id: string }) => {
	const { loading, fetch, data } = useFetch();
	const [queryData, setQueryData] = useState<any[]>(data);
	const [sortedData, setSortedData] = useState<any[]>(queryData);
	const getType = (type: string | any) => {
		if (type == "reversal") {
			return "bg-red-500 text-white text-center capitalize";
		} else if (type == "payment") {
			return "bg-green-500 text-white text-center capitalize";
		} else {
			return "bg-orange-500 text-white text-center capitalize";
		}
	};
	const rows = sortedData?.map((row, i: number) => (
		<Table.Tr key={row?.id}>
			<Table.Td>{i + 1}</Table.Td>
			<Table.Td>{format(new Date(row?.createdAt), "Pp")}</Table.Td>
			<Table.Td>{row?.name}</Table.Td>
			<Table.Td>
				<NumberFormatter value={row?.paid} prefix='NGN ' thousandSeparator />
			</Table.Td>
			<Table.Td>{row?.method}</Table.Td>
			<Table.Td>{row?.createdBy?.username}</Table.Td>
			<Table.Td className={getType(row?.type)}>{row?.type}</Table.Td>
		</Table.Tr>
	));
	useEffect(() => {
		async function getAll() {
			const { data } = await fetch(`/transactions/${id}/payments`);

			setQueryData(data);
		}
		getAll();
	}, []);
	return (
		<main>
			<PaginatedTable
				headers={[
					"S/N",
					"Payment Date",
					"Item",
					"Amount Paid",
					"Method",
					"Cashier",
					"Type",
				]}
				sortedData={sortedData}
				rows={rows}
				showSearch={false}
				showPagination={true}
				data={queryData}
				setSortedData={setSortedData}
				loading={loading}
				placeholder={""}
				depth={""}
			/>
		</main>
	);
};

export default Payments;
