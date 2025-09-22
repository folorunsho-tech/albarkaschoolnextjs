/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useState } from "react";
import PaginatedTable from "@/components/PaginatedTable";
import { usePostNormal } from "@/hooks/useQueries";
import { Table, ActionIcon } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import moment from "moment";
import Link from "next/link";
import ResultsFilter from "../filters/ResultsFilter";
import { userContext } from "@/context/User";
import { useDisclosure } from "@mantine/hooks";
import DataLoader from "../DataLoader";
const Fca = () => {
	const { user, permissions } = React.useContext(userContext);

	const headers = [
		"Admission no",
		"Student name",
		"Student class",
		"Session - Term",
		"Subject",
		"Score",
		"Uploaded on",
	];
	const { loading, post } = usePostNormal();
	const [queryData, setQueryData] = useState<any>([]);
	const [sortedData, setSortedData] = useState<any>([]);
	const [filterCount, setFilterCount] = useState(0);
	const [opened, { toggle }] = useDisclosure();
	const rows = sortedData?.map((row: any, index: number) => (
		<Table.Tr key={row?.id + index}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{row?.student?.admission_no}</Table.Td>
			<Table.Td>
				{row?.student?.first_name} {row?.student?.last_name}
			</Table.Td>
			<Table.Td>{row?.class?.name}</Table.Td>
			<Table.Td>
				{row?.term} - {row?.session}
			</Table.Td>
			<Table.Td>{row?.subject?.name}</Table.Td>
			<Table.Td>{row?.score}</Table.Td>
			<Table.Td>{moment(row?.updatedAt).format("MMMM Do YYYY")}</Table.Td>
			{permissions?.results?.edit && (
				<Table.Td className='flex items-center gap-3 '>
					<Link href={`results/exam/edit/${row?.id}`}>
						<ActionIcon
							variant='outline'
							color='green'
							aria-label='action menu'
						>
							<IconPencil style={{ width: "70%", height: "70%" }} stroke={2} />
						</ActionIcon>
					</Link>
				</Table.Td>
			)}
		</Table.Tr>
	));
	return (
		<section className='p-3 bg-white space-y-6'>
			<div className='flex gap-1 justify-between mt-2'>
				<h2 className='font-bold text-xl text-blue-700'>
					Terminal exams Results
				</h2>
				<div className='flex flex-wrap gap-6 justify-between items-end'>
					<button
						onClick={() => {
							toggle();
						}}
						className='flex items-center hover:bg-gray-600 transition duration-150 bg-gray-500 w-20 justify-between divide-x-2 rounded-md text-white shadow-sm inset-2'
					>
						<span className='p-1'>Filters</span>
						<span className='p-1 rounded-e-md bg-gray-300'>
							{filterCount == 0 ? "None" : filterCount}
						</span>
					</button>
					<DataLoader
						link={`/exams/byId`}
						post={post}
						setQueryData={setQueryData}
					/>
					<Link
						href={`results/exam`}
						className='bg-teal-500 text-white hover:bg-teal-700 px-4 py-2 rounded-sm transition duration-200 ease-linear'
					>
						New exam result
					</Link>
				</div>
			</div>
			{opened && (
				<ResultsFilter
					setSortedData={setSortedData}
					queryData={queryData}
					resultType='exams'
					sortedData={sortedData}
					setFilterCount={setFilterCount}
				/>
			)}

			<PaginatedTable
				depth='student'
				showlast={false}
				showSearch
				rows={rows}
				sortedData={sortedData}
				data={queryData}
				headers={headers}
				placeholder='Search by student name or admission no'
				setSortedData={setSortedData}
				loading={loading}
			/>
		</section>
	);
};

export default Fca;
