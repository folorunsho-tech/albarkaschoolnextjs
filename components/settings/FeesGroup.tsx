"use client";
import React, { useEffect, useState } from "react";
import PaginatedTable from "@/components/PaginatedTable";
import { useFetch, usePost } from "@/hooks/useQueries";
import {
	Table,
	ActionIcon,
	Button,
	Drawer,
	TextInput,
	NumberFormatter,
	MultiSelect,
} from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "react-hook-form";
import Link from "next/link";
const Subjects = () => {
	const { register, handleSubmit, reset } = useForm();
	const { loading, data, fetch } = useFetch();
	const { post } = usePost();
	const headers = ["ID", "name", "amount", "classes"];
	const [queryData, setQueryData] = useState(data);
	const [sortedData, setSortedData] = useState([]);
	const [classList, setClassList] = useState([]);
	const [classes, setClasses] = useState([]);
	const [opened, { open, close }] = useDisclosure(false);

	const rows = sortedData?.map((row: any, index: number) => (
		<Table.Tr key={row?.id}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{row?.id}</Table.Td>
			<Table.Td>{row?.name}</Table.Td>
			<Table.Td>
				<NumberFormatter prefix='N ' value={row?.amount} thousandSeparator />
			</Table.Td>
			<Table.Td>{row?.classes?.map((cl: any) => `${cl?.name}, `)}</Table.Td>

			<Table.Td className='flex items-center gap-3 '>
				<Link href={`settings/fees?id=${row?.id}`}>
					<ActionIcon variant='outline' color='green' aria-label='action menu'>
						<IconPencil style={{ width: "70%", height: "70%" }} stroke={2} />
					</ActionIcon>
				</Link>
			</Table.Td>
		</Table.Tr>
	));

	useEffect(() => {
		const getAll = async () => {
			const { data } = await fetch("/feesgroup");
			const { data: classes } = await fetch("/classes/list");
			const sortedClasses = classes?.map((cl: any) => {
				return {
					value: cl?.id,
					label: cl?.name,
				};
			});
			setClassList(sortedClasses);
			setQueryData(data);
		};

		getAll();
	}, []);

	return (
		<section className='flex flex-col gap-4'>
			<div className='flex justify-between mt-2'>
				<h2 className='font-bold text-xl text-blue-700'>Fees group</h2>
				<div className='flex gap-3 items-center'>
					<Button
						onClick={() => {
							open();
						}}
						className='bg-teal-500 text-white hover:bg-teal-700 px-4 py-2 rounded-sm transition duration-200 ease-linear'
					>
						Add a new fees group
					</Button>
				</div>
			</div>
			<Drawer
				offset={8}
				radius='md'
				opened={opened}
				onClose={close}
				title='Add a new fees group'
			>
				<form
					onSubmit={handleSubmit(async (values) => {
						await post("/feesgroup/create", {
							name: values.name,
							amount: values.amount,
							classes: classes?.map((cl: any) => {
								return {
									id: cl,
								};
							}),
						});
						const { data } = await fetch("/feesgroup");
						setQueryData(data);
						setClasses([]);
						reset();
					})}
					className='flex flex-col gap-4'
				>
					<TextInput
						label='Fee group name'
						required
						placeholder='fee group name...'
						{...register("name")}
					/>
					<TextInput
						label='Fee group amount'
						leftSectionPointerEvents='none'
						leftSection='N'
						required
						placeholder='fee group amount...'
						{...register("amount")}
					/>
					<MultiSelect
						label='Classes'
						placeholder='Pick one or more class'
						checkIconPosition='right'
						value={classes}
						data={classList}
						clearable
						searchable
						hidePickedOptions
						onChange={(value: any) => {
							setClasses(value);
						}}
					/>

					<div className='flex gap-4 justify-end mt-3'>
						<Button
							onClick={() => {
								close();
								setClasses([]);
							}}
						>
							Cancel
						</Button>
						<Button type='submit' color='teal'>
							Add new fees group
						</Button>
					</div>
				</form>
			</Drawer>
			<PaginatedTable
				depth=''
				showlast
				showSearch
				rows={rows}
				sortedData={sortedData}
				data={queryData}
				headers={headers}
				placeholder='Search by fees name'
				setSortedData={setSortedData}
				loading={loading}
			/>
		</section>
	);
};

export default Subjects;
