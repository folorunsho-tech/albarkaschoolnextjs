"use client";
import React, { useState } from "react";
import PaginatedTable from "@/components/PaginatedTable";
import Link from "next/link";
import { usePostNormal } from "@/hooks/useQueries";
import { Table, ActionIcon, NumberFormatter } from "@mantine/core";
import { IconEye, IconPencil } from "@tabler/icons-react";
import moment from "moment";
import { userContext } from "@/context/User";
import DataLoader from "../DataLoader";

const TPayments = () => {
	const { user } = React.useContext(userContext);
	const permission = user?.permissions?.payments;
	const headers = [
		"tnxid",
		"admission no.",
		"student name",
		"class",
		"items count",
		"total",
		"paid",
		"balance",
		"term - session",
		"status",
		"CreatedAt",
		"UpdatedAt",
	];
	const { loading, post } = usePostNormal();
	const [queryData, setQueryData] = useState([]);
	const [sortedData, setSortedData] = useState([]);
	const getStatusColor = (status: string) => {
		if (status === "Partly paid") {
			return "bg-orange-500 text-white";
		} else if (status === "Paid") {
			return "bg-green-500 text-white";
		} else if (status === "Unpaid") {
			return "bg-red-500 text-white";
		} else if (status === "Cancelled") {
			return "bg-red-500 text-white";
		}
	};
	const rows = sortedData?.map((row: any, index: number) => (
		<Table.Tr key={row?.tnxId}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{row?.tnxId}</Table.Td>
			<Table.Td>{row?.student?.admission_no}</Table.Td>
			<Table.Td>
				{row?.student?.first_name} {row?.student?.last_name}
			</Table.Td>
			<Table.Td>{row?.class}</Table.Td>
			<Table.Td>{row?._count?.items}</Table.Td>
			<Table.Td>
				<NumberFormatter prefix='N ' value={row?.total} thousandSeparator />
			</Table.Td>
			<Table.Td>
				<NumberFormatter prefix='N ' value={row?.paid} thousandSeparator />
			</Table.Td>
			<Table.Td>
				<NumberFormatter
					prefix='N '
					value={Number(row?.total) - Number(row?.paid)}
					thousandSeparator
				/>
			</Table.Td>
			<Table.Td>
				{row?.term} - {row?.session}
			</Table.Td>
			<Table.Td className={getStatusColor(row?.status)}>{row?.status}</Table.Td>
			<Table.Td>{moment(row?.createdAt).format("MMMM Do YYYY")}</Table.Td>
			<Table.Td>{moment(row?.updatedAt).format("MMMM Do YYYY")}</Table.Td>
			<Table.Td className='flex items-center gap-3 '>
				<Link href={`payments/view/${row?.tnxId}`}>
					<ActionIcon variant='outline' color='orange' aria-label='action menu'>
						<IconEye style={{ width: "70%", height: "70%" }} stroke={2} />
					</ActionIcon>
				</Link>
			</Table.Td>
		</Table.Tr>
	));

	return (
		<section className='flex flex-col gap-4 p-3 bg-white '>
			<div className='flex justify-between  mt-2'>
				<h2 className='font-bold text-xl text-blue-700'>Transactions</h2>
				<div className='flex gap-3 items-end'>
					<DataLoader
						link='/transactions'
						setQueryData={setQueryData}
						post={post}
					/>
					{permission?.create && (
						<Link
							className='bg-teal-500 text-white hover:bg-teal-700 px-4 py-2 rounded-sm transition duration-200 ease-linear'
							href='payments/create'
						>
							Make a new transaction
						</Link>
					)}
				</div>
			</div>
			<div className='p-2'>
				<PaginatedTable
					depth='student'
					showlast={true}
					showSearch
					rows={rows}
					data={queryData}
					headers={headers}
					placeholder='Search by student name or admission no or transaction id'
					setSortedData={setSortedData}
					loading={loading}
					sortedData={sortedData}
				/>
			</div>
		</section>
	);
};

export default TPayments;
