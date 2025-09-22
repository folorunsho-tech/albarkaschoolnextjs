"use client";
import React, { useEffect, useState } from "react";
import PaginatedTable from "@/components/PaginatedTable";
import Link from "next/link";
import { useFetch, usePost } from "@/hooks/useQueries";
import {
	Table,
	ActionIcon,
	Menu,
	rem,
	Text,
	LoadingOverlay,
} from "@mantine/core";
import {
	IconPencil,
	IconKeyOff,
	IconGridDots,
	IconCheck,
	IconX,
	IconKey,
} from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import moment from "moment";
import chunk from "@/libs/chunk";

const Accounts = () => {
	const { loading, data, fetch } = useFetch();
	const { loading: pLoading, post } = usePost();
	const headers = ["username", "login access", "createdAt", "updatedAt"];
	const openAModal = (row: any) =>
		modals.openConfirmModal({
			title: "Revoke login access for account",
			children: (
				<Text size='sm'>
					Revoke login access for account <i>{row?.username}</i>
				</Text>
			),
			confirmProps: {
				color: "teal",
			},
			labels: { confirm: "Allow", cancel: "Cancel" },
			onConfirm: async () => {
				await post(`auth/allow/${row?.id}`);
				const { data } = await fetch("/accounts");
				setQueryData(data);
				const paginated: any[] = chunk(data, 50);
				setSortedData(paginated[0]);
			},
		});
	const openRModal = (row: any) =>
		modals.openConfirmModal({
			title: "Revoke login access for account",
			children: (
				<Text size='sm'>
					Revoke login access for account <i>{row?.username}</i>
				</Text>
			),
			confirmProps: {
				color: "red",
			},
			labels: { confirm: "Revoke", cancel: "Cancel" },
			onConfirm: async () => {
				await post(`auth/revoke/${row?.id}`);
				const { data } = await fetch("/accounts");
				setQueryData(data);
				const paginated: any[] = chunk(data, 50);
				setSortedData(paginated[0]);
			},
		});
	const [queryData, setQueryData] = useState(data);
	const [sortedData, setSortedData] = useState([]);

	const rows = sortedData?.map((row: any, index: number) => (
		<Table.Tr key={row?.id}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{row?.username}</Table.Td>
			<Table.Td>
				{row?.active === true ? (
					<IconCheck color='teal' />
				) : (
					<IconX color='red' />
				)}
			</Table.Td>
			<Table.Td>{moment(row?.createdAt).format("MMMM Do YYYY")}</Table.Td>
			<Table.Td>{moment(row?.updatedAt).format("MMMM Do YYYY")}</Table.Td>
			<Table.Td>
				<Menu shadow='md' width={250}>
					<Menu.Target>
						<ActionIcon>
							<IconGridDots style={{ width: rem(14), height: rem(14) }} />
						</ActionIcon>
					</Menu.Target>

					<Menu.Dropdown>
						<Menu.Item
							href={`accounts/edit/${row?.id}`}
							component={Link}
							leftSection={
								<IconPencil style={{ width: rem(14), height: rem(14) }} />
							}
						>
							Edit Account
						</Menu.Item>
						<Menu.Item
							onClick={() => {
								openAModal(row);
							}}
							color='teal'
							leftSection={
								<IconKey style={{ width: rem(14), height: rem(14) }} />
							}
						>
							Allow account's login access
						</Menu.Item>
						<Menu.Item
							onClick={() => {
								openRModal(row);
							}}
							color='red'
							leftSection={
								<IconKeyOff style={{ width: rem(14), height: rem(14) }} />
							}
						>
							Revoke account's login access
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			</Table.Td>
		</Table.Tr>
	));
	useEffect(() => {
		const getAll = async () => {
			const { data } = await fetch("/accounts");
			setQueryData(data);
			const paginated: any[] = chunk(data, 50);
			setSortedData(paginated[0]);
		};

		getAll();
	}, [pLoading]);

	return (
		<section className='flex flex-col gap-4 p-4 bg-white relative'>
			<div className='flex justify-between mt-2'>
				<h2 className='font-bold text-xl text-blue-700'>Accounts</h2>
				<div className='flex gap-3 items-end'>
					<Link
						className='bg-teal-500 text-white hover:bg-teal-700  px-4 py-2  rounded-sm transition duration-200 ease-linear'
						href='accounts/create'
					>
						Create account
					</Link>
				</div>
			</div>
			<LoadingOverlay visible={pLoading} />
			<PaginatedTable
				depth='staff'
				showlast
				showSearch
				rows={rows}
				data={queryData}
				headers={headers}
				placeholder='Search by name or username'
				setSortedData={setSortedData}
				loading={loading}
				sortedData={sortedData}
			/>
		</section>
	);
};

export default Accounts;
