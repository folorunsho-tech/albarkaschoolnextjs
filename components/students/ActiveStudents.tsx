"use client";
import React, { useRef, useState } from "react";
import PaginatedTable from "@/components/PaginatedTable";
import Link from "next/link";
import { usePostNormal } from "@/hooks/useQueries";
import { Table, ActionIcon, Button, ScrollArea, Drawer } from "@mantine/core";
import { useReactToPrint } from "react-to-print";
import { IconEye, IconPencil, IconPrinter } from "@tabler/icons-react";
import moment from "moment";
import { useDisclosure } from "@mantine/hooks";
import AStudentsFilter from "../filters/AStudentsFilter";
import PrintHeader from "../PrintHeader";
import { userContext } from "@/context/User";
import DataLoader from "../DataLoader";
const ActiveStudents = () => {
	const { permissions } = React.useContext(userContext);

	const headers = [
		"S/N",
		"admission no",
		"admission date",
		"admission session",
		"admission term",
		"name",
		"class",
		"guardian name",
		"guardian telephone",
	];

	const permission = permissions?.students;
	const { post: dPost, loading } = usePostNormal();

	const [queryData, setQueryData] = useState([]);
	const [sortedData, setSortedData] = useState([]);
	const [opened, { open, close }] = useDisclosure(false);
	const contentRef = useRef<HTMLTableElement>(null);
	const reactToPrintFn: any = useReactToPrint({ contentRef });
	const rows = sortedData?.map((row: any, index: number) => (
		<Table.Tr key={row?.admission_no}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{row?.admission_no}</Table.Td>
			<Table.Td>
				{moment(row?.date_of_admission).format("MMMM Do YYYY")}
			</Table.Td>
			<Table.Td>{row?.admission_session}</Table.Td>
			<Table.Td>{row?.admission_term}</Table.Td>
			<Table.Td>
				{row?.first_name} {row?.last_name}
			</Table.Td>
			<Table.Td>{row?.curr_class?.name}</Table.Td>
			<Table.Td>{row?.guardian_name}</Table.Td>
			<Table.Td>{row?.guardian_telephone}</Table.Td>

			<Table.Td className='flex items-center gap-3 '>
				<ActionIcon variant='outline' aria-label='action menu'>
					<Link
						href={`students/view/${row?.id}`}
						className='flex justify-center'
					>
						<IconEye style={{ width: "70%", height: "70%" }} stroke={2} />
					</Link>
				</ActionIcon>
				{permission?.edit && (
					<ActionIcon variant='outline' color='teal' aria-label='action menu'>
						<Link
							href={`students/edit/${row?.id}`}
							className='flex justify-center'
						>
							<IconPencil style={{ width: "70%", height: "70%" }} stroke={2} />
						</Link>
					</ActionIcon>
				)}
			</Table.Td>
		</Table.Tr>
	));

	return (
		<section className='flex flex-col gap-1 bg-white p-4 '>
			<div className='flex justify-between mt-2'>
				<h2 className='font-bold text-xl text-blue-700'>Students</h2>
				<div className='flex flex-wrap gap-3 items-center'>
					<DataLoader
						link='/students'
						setQueryData={setQueryData}
						showReload={false}
						loadCriteria='Session'
						post={dPost}
					/>
					<Button
						leftSection={<IconPrinter />}
						onClick={() => {
							open();
						}}
						className='bg-indigo-500 text-white hover:bg-indigo-700 px-4 py-2 rounded-sm transition duration-200 ease-linear'
					>
						Print
					</Button>
					{permission?.create && (
						<Link
							className='bg-teal-500 text-white hover:bg-teal-700 px-4 py-2 rounded-sm transition duration-200 ease-linear'
							href='students/create'
						>
							New admission
						</Link>
					)}
				</div>
			</div>

			<AStudentsFilter
				setQueryData={setQueryData}
				setSortedData={setSortedData}
				sortedData={sortedData}
				queryData={queryData}
			/>
			<PaginatedTable
				depth='curr_class'
				showlast={true}
				showSearch
				rows={rows}
				data={queryData}
				headers={headers}
				placeholder='Search by admission no or name'
				setSortedData={setSortedData}
				loading={loading}
				sortedData={sortedData}
			/>
			<Drawer
				opened={opened}
				onClose={() => {
					close();
				}}
				title='Print students'
				size='100%'
			>
				<div className='flex gap-4'>
					<Button
						onClick={reactToPrintFn}
						className=' mb-2 bg-indigo-500 text-white hover:bg-indigo-700 px-4 py-2 rounded-sm transition duration-200 ease-linear'
					>
						<IconPrinter />
					</Button>
				</div>
				<section ref={contentRef}>
					<PrintHeader />
					<ScrollArea>
						<table className='printable'>
							<thead>
								<tr>
									{[
										"S/N",
										"adm no",
										"adm date",
										"adm session",
										"adm term",
										"name",
										"class",
										"guard name",
										"guard tel",
									].map((head) => (
										<th key={head}>{head}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{sortedData?.map((row: any, index: number) => (
									<tr key={row?.admission_no + index}>
										<td>{index + 1}</td>
										<td>{row?.admission_no}</td>

										<td>
											{moment(row?.date_of_admission).calendar("MMMM Do YYYY")}
										</td>
										<td>{row?.admission_session}</td>
										<td>{row?.admission_term}</td>
										<td>
											{row?.first_name} {row?.last_name}
										</td>
										<td>{row?.curr_class?.name}</td>

										<td>{row?.guardian_name}</td>
										<td>{row?.guardian_telephone}</td>
									</tr>
								))}
							</tbody>
						</table>
					</ScrollArea>
				</section>
			</Drawer>
		</section>
	);
};

export default ActiveStudents;
