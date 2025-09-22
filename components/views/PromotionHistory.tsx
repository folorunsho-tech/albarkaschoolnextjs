"use client";
import React, { useEffect, useState } from "react";
import PaginatedTable from "@/components/PaginatedTable";
import { Table, NumberFormatter } from "@mantine/core";
import moment from "moment";
import { useFetch } from "@/hooks/useQueries";

const Promotions = ({ empid }: { empid: string | null }) => {
	const headers = [
		"EMP No.",
		"Staff name",
		"promotion from",
		"prev salary",
		"promotion to",
		"current salary",
		"promoted On",
	];
	const { loading, fetch, data } = useFetch();
	const [queryData, setQueryData] = useState(data);
	const [sortedData, setSortedData] = useState([]);

	const rows = sortedData?.map((row: any, index: number) => (
		<Table.Tr key={row?.id}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{row?.staff_id}</Table.Td>
			<Table.Td>
				{row?.staff?.first_name} {row?.staff?.last_name}
			</Table.Td>
			<Table.Td>{row?.from}</Table.Td>
			<Table.Td>
				<NumberFormatter
					prefix='N '
					value={row?.prev_salary}
					thousandSeparator
				/>
			</Table.Td>
			<Table.Td>{row?.to?.name}</Table.Td>
			<Table.Td>
				<NumberFormatter
					prefix='N '
					value={row?.curr_salary}
					thousandSeparator
				/>
			</Table.Td>
			<Table.Td>{moment(row?.promotedOn).format("MMMM Do YYYY")}</Table.Td>
		</Table.Tr>
	));

	useEffect(() => {
		async function getPromotion() {
			const { data } = await fetch(`/promotions/staffs/${empid}`);
			setQueryData(data);
		}
		getPromotion();
	}, []);

	return (
		<section className='flex flex-col gap-4'>
			<PaginatedTable
				depth='staff'
				showlast={false}
				showSearch={false}
				rows={rows}
				sortedData={sortedData}
				data={queryData}
				headers={headers}
				placeholder='Search by staff name or employment id'
				setSortedData={setSortedData}
				loading={loading}
			/>
		</section>
	);
};

export default Promotions;
