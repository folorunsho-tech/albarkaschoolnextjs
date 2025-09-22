"use client";
import React, { useEffect, useState } from "react";
import PaginatedTable from "@/components/PaginatedTable";
import { useFetch, usePost } from "@/hooks/useQueries";
import { Table, Button, Drawer, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "react-hook-form";
const Subjects = () => {
	const { register, handleSubmit, reset } = useForm();
	const { loading, data, fetch } = useFetch();

	const { post } = usePost();
	const headers = ["ID", "Subject name", "No of classes"];
	const [queryData, setQueryData] = useState(data);
	const [sortedData, setSortedData] = useState([]);
	const [opened, { open, close }] = useDisclosure(false);

	const rows = sortedData?.map((row: any, index: number) => (
		<Table.Tr key={row?.id}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{row?.id}</Table.Td>
			<Table.Td className='capitalize'>{row?.name}</Table.Td>
			<Table.Td>{row?._count.Classes}</Table.Td>
		</Table.Tr>
	));
	useEffect(() => {
		const getAll = async () => {
			const { data } = await fetch("/subjects");
			setQueryData(data);
		};

		getAll();
	}, []);
	return (
		<section className='flex flex-col gap-4'>
			<div className='flex justify-between mt-2'>
				<h2 className='font-bold text-xl text-blue-700'>Subjects</h2>
				<div className='flex gap-3 items-center'>
					<Button
						onClick={() => {
							open();
						}}
						className='bg-teal-500 text-white hover:bg-teal-700 px-4 py-2 rounded-sm transition duration-200 ease-linear'
					>
						Add a new subject
					</Button>
				</div>
			</div>
			<Drawer
				offset={8}
				radius='md'
				opened={opened}
				onClose={close}
				title='Add a new subject'
			>
				<form
					onSubmit={handleSubmit(async ({ subject_name }) => {
						await post("/subjects/create", {
							name: subject_name,
						});
						const { data } = await fetch("/subjects");
						setQueryData(data);

						reset();
					})}
					className='flex flex-col gap-4'
				>
					<TextInput
						label='Subject'
						required
						placeholder='subject name...'
						{...register("subject_name")}
					/>
					<div className='flex gap-4 justify-end mt-3'>
						<Button
							onClick={() => {
								close();
							}}
						>
							Cancel
						</Button>
						<Button type='submit' color='teal'>
							Add subject
						</Button>
					</div>
				</form>
			</Drawer>
			<PaginatedTable
				depth=''
				showlast={false}
				showSearch
				rows={rows}
				sortedData={sortedData}
				data={queryData}
				headers={headers}
				placeholder='Search by subject name'
				setSortedData={setSortedData}
				loading={loading}
			/>
		</section>
	);
};

export default Subjects;
