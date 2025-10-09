"use client";
import { useEffect, useRef, useState } from "react";
import PaginatedTable from "../PaginatedTable";
import { useFetch } from "@/hooks/useQueries";
import {
	NumberFormatter,
	Drawer,
	Table,
	ActionIcon,
	Text,
} from "@mantine/core";
import { format } from "date-fns";
import { useReactToPrint } from "react-to-print";
import Image from "next/image";
import { IconReceipt } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { Eye } from "lucide-react";
import convert from "@/libs/numberConvert";

const Receipts = ({ id }: { id: string }) => {
	const { loading, fetch, data } = useFetch();
	const [queryData, setQueryData] = useState<any[]>(data);
	const [sortedData, setSortedData] = useState<any[]>(queryData);
	const [opened, { open, close }] = useDisclosure(false);
	const [selected, setSelected] = useState<any>(null);
	const [items, setItems] = useState<any[]>([]);
	const contentRef = useRef<HTMLTableElement>(null);
	const reactToPrintFn = useReactToPrint({
		contentRef,
		bodyClass: "print",
		documentTitle: `reciept no ${Number(selected?.id)} for tnx no ${Number(
			selected?.tnxId
		)}`,
	});
	const getStatus = (status: string | any) => {
		if (status == "Fully Paid") {
			return "bg-green-500 text-white";
		} else if (status == "Partly Paid") {
			return "bg-orange-500 text-white";
		} else if (status == "Partly Reversed") {
			return "bg-pink-500 text-white";
		} else if (status == "Fully Reversed") {
			return "bg-red-500 text-white";
		}
	};
	const rows = sortedData?.map((row, i: number) => (
		<Table.Tr key={row?.id}>
			<Table.Td>{i + 1}</Table.Td>
			<Table.Td>{row?.id}</Table.Td>
			<Table.Td>{format(new Date(row?.createdAt), "Pp")}</Table.Td>
			<Table.Td>{JSON.parse(row?.items).length}</Table.Td>
			<Table.Td>{row?.createdBy?.username}</Table.Td>
			<Table.Td className={getStatus(row?.status)}>{row?.status}</Table.Td>
			<Table.Td>
				<ActionIcon
					onClick={() => {
						setSelected(row);
						setItems(JSON.parse(row?.items));
						open();
					}}
				>
					<Eye />
				</ActionIcon>
			</Table.Td>
		</Table.Tr>
	));

	useEffect(() => {
		async function getAll() {
			const { data } = await fetch(`/transactions/${id}/reciepts`);
			setQueryData(data);
		}
		getAll();
	}, []);
	return (
		<main>
			<Drawer
				opened={opened}
				onClose={close}
				title={`Reciept no: ${selected?.id}`}
				size='xl'
			>
				{selected && (
					<div ref={contentRef} className='printable text-sm'>
						<div className='flex items-start gap-4 mb-1'>
							<Image
								src='/logo.svg'
								height={100}
								width={100}
								alt='Albarka logo'
								loading='eager'
							/>
							<div className='space-y-1 w-full'>
								<div className='flex items-center w-full justify-between'>
									<h2 className='font-extrabold font-serif '>ALBARKA SCHOOL</h2>
									<p>{format(new Date(), "Pp")}</p>
								</div>
								<h3 className=''>Rofia Road, Wawa, Niger State</h3>
								<p className=' italic'>E-mail: albarkaschool@yahoo.com</p>
							</div>
						</div>
						<div className='flex flex-wrap gap-2 mb-1'>
							<div className='flex items-center'>
								<h2 className='text-sm font-extrabold font-serif '>
									Receipt No:
								</h2>
								<p className='underline pl-1.5'>{selected?.id}</p>
							</div>
							{selected && (
								<div className='flex items-center'>
									<h2 className='text-sm font-extrabold font-serif '>
										Tnx Date:
									</h2>
									<p className='underline pl-1.5'>
										{format(new Date(selected?.createdAt), "PPPpp")}
									</p>
									<ActionIcon
										className='ml-6 self-end'
										onClick={() => {
											reactToPrintFn();
										}}
									>
										<IconReceipt />
									</ActionIcon>
								</div>
							)}
							<div className='flex items-center'>
								<h2 className='text-sm font-extrabold font-serif '>
									Student name:
								</h2>
								<p className='underline pl-1.5'>
									{selected?.transaction?.student?.last_name}{" "}
									{selected?.transaction?.student?.first_name}
								</p>
							</div>
							<div className='flex items-center'>
								<h2 className='text-sm font-extrabold font-serif '>Adm No:</h2>
								<p className='underline pl-1.5'>
									{selected?.transaction?.student?.admission_no}
								</p>
							</div>
							<div className='flex items-center'>
								<h2 className='text-sm font-extrabold font-serif '>Address:</h2>
								<p className='underline pl-1.5'>
									{selected?.transaction?.student?.address}
								</p>
							</div>
							<div className='flex items-center '>
								<h2 className='text-sm font-extrabold font-serif '>Cashier:</h2>
								<p className='underline pl-1.5'>
									{selected?.createdBy?.username}
								</p>
							</div>
						</div>
						<Table>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>Item</Table.Th>
									<Table.Th>Amount</Table.Th>
									<Table.Th>Paid</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{items?.map((item: any, i: number) => (
									<Table.Tr key={i + 1}>
										<Table.Td>{item?.name}</Table.Td>
										<Table.Td>
											<NumberFormatter
												prefix='N '
												value={Number(item?.price)}
												thousandSeparator
											/>
										</Table.Td>
										<Table.Td>
											<NumberFormatter
												prefix='N '
												value={Number(item?.paid)}
												thousandSeparator
											/>
										</Table.Td>
									</Table.Tr>
								))}
							</Table.Tbody>
							<Table.Tfoot className='font-semibold border bg-gray-200'>
								<Table.Tr>
									<Table.Td>Total: </Table.Td>
									<Table.Td>
										<NumberFormatter
											prefix='N '
											value={items?.reduce(
												(prev: any, curr: { paid: number }) => {
													return Number(prev) + Number(curr.paid);
												},
												0
											)}
											thousandSeparator
										/>
									</Table.Td>
									<Table.Td>
										<NumberFormatter
											prefix='N '
											value={items?.reduce(
												(prev: any, curr: { price: number }) => {
													return prev + curr.price;
												},
												0
											)}
											thousandSeparator
										/>
									</Table.Td>
								</Table.Tr>
							</Table.Tfoot>
						</Table>
						<Text fw={600}>
							Total amount paid in words:
							<i className='text-sm pl-2 capitalize'>
								{convert(
									Number(
										items?.reduce((prev: any, curr: { price: number }) => {
											return prev + curr.price;
										}, 0)
									)
								)}{" "}
								Naira
							</i>
						</Text>
					</div>
				)}
			</Drawer>
			<PaginatedTable
				headers={[
					"S/N",
					"Id",
					"Date",
					"Items",
					"CreatedBy",
					"Status",
					"Action",
				]}
				sortedData={sortedData}
				rows={rows}
				showSearch={false}
				showPagination={true}
				data={queryData}
				setSortedData={setSortedData}
				loading={loading}
				depth=''
				placeholder={""}
			/>
		</main>
	);
};

export default Receipts;
