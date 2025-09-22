"use client";
import React, { useEffect, useState } from "react";
import PaginatedTable from "@/components/PaginatedTable";
import Link from "next/link";
import { useFetch } from "@/hooks/useQueries";
import { Table, ActionIcon } from "@mantine/core";
import { IconEye, IconPencil } from "@tabler/icons-react";
import { userContext } from "@/context/User";
import chunk from "@/libs/chunk";

const Classes = () => {
	const { user } = React.useContext(userContext);
	const { loading, data, fetch } = useFetch();
	const headers = [
		"class name",
		"school section",
		"No. of subjects",
		"No. of students",
	];
	const [queryData, setQueryData] = useState(data);
	const [sortedData, setSortedData] = useState([]);
	const rows = sortedData?.map((row: any, index: number) => (
		<Table.Tr key={row?.id}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{row?.name}</Table.Td>
			<Table.Td>{row?.school_section}</Table.Td>
			<Table.Td>{row?._count.subjects}</Table.Td>
			<Table.Td>{row?._count.Students}</Table.Td>
			<Table.Td className='flex items-center gap-3 '>
				<ActionIcon variant='outline' aria-label='action menu'>
					<Link
						href={`classes/view/${row?.id}`}
						className='flex justify-center'
					>
						<IconEye style={{ width: "70%", height: "70%" }} stroke={2} />
					</Link>
				</ActionIcon>
				{user?.role === "admin" && (
					<ActionIcon variant='outline' color='teal' aria-label='action menu'>
						<Link
							href={`classes/edit/${row?.id}`}
							className='flex justify-center'
						>
							<IconPencil style={{ width: "70%", height: "70%" }} stroke={2} />
						</Link>
					</ActionIcon>
				)}
			</Table.Td>
		</Table.Tr>
	));
	useEffect(() => {
		const getAll = async () => {
			const { data } = await fetch("/classes");
			setQueryData(data);
			const paginated: any[] = chunk(data, 50);
			setSortedData(paginated[0]);
		};

		getAll();
	}, []);

	return (
		<section className='flex flex-col gap-4 bg-white p-4'>
			<div className='flex justify-between mt-2'>
				<h2 className='font-bold text-xl text-blue-700'>Classes</h2>
				{user?.role == "admin" && (
					<Link
						className='bg-emerald-500 text-white hover:bg-emerald-700 transition duration-150 p-2 rounded-sm'
						href={"classes/create"}
					>
						Add class
					</Link>
				)}
			</div>

			<PaginatedTable
				depth=''
				showlast
				showSearch
				rows={rows}
				data={queryData}
				headers={headers}
				placeholder='Search by class name'
				setSortedData={setSortedData}
				sortedData={sortedData}
				loading={loading}
			/>
		</section>
	);
};

export default Classes;
