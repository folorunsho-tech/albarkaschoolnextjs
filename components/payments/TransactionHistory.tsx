"use client";
import React from "react";
import { useFetch } from "@/hooks/useQueries";
import PaginatedTable from "../PaginatedTable";
import { NumberFormatter, Table, Text, Radio, Button } from "@mantine/core";
import moment from "moment";
import convert from "@/libs/numberConvert";
import { useReactToPrint } from "react-to-print";
import PrintHeader from "../PrintHeader";
const TransactionHistory = ({ id }: { id: string | null }) => {
	const { loading, fetch } = useFetch();
	const [queryData, setQueryData] = React.useState<any[]>([]);
	const [sortedData, setSortedData] = React.useState<any[]>([]);
	const [selected, setSelected] = React.useState<any>(null);
	const contentRef = React.useRef(null);
	const reactToPrintFn: any = useReactToPrint({
		contentRef,
		documentTitle: `TNXID - ${selected?.tnxId} - ${selected?.student?.admission_no}`,
	});

	const headers = [
		"admission no.",
		"student name",
		"class",
		"items",
		"paid",
		"CreatedAt",
		"UpdatedAt",
		"Select to print",
	];
	React.useEffect(() => {
		async function getTnx() {
			const { data } = await fetch("/transactions/history/" + id);
			setQueryData(data);
			// console.log(data);
		}
		getTnx();
	}, []);

	const rows = sortedData?.map((row: any, index: number) => (
		<Table.Tr key={row?.id}>
			<Table.Td>{index + 1}</Table.Td>
			<Table.Td>{row?.student?.admission_no}</Table.Td>
			<Table.Td>
				{row?.student?.first_name} {row?.student?.last_name}
			</Table.Td>
			<Table.Td>{row?.class}</Table.Td>
			<Table.Td>
				{JSON.parse(row?.items)?.map(
					(item: any) => `${item?.item?.name} (N ${item?.paid}), `
				)}
			</Table.Td>
			<Table.Td>
				<NumberFormatter
					prefix='NGN '
					value={JSON.parse(row?.items)?.reduce((prev: any, curr: any) => {
						return Number(prev) + Number(curr?.paid);
					}, 0)}
					thousandSeparator
				/>
			</Table.Td>

			<Table.Td>{moment(row?.createdAt).format("MMMM Do YYYY")}</Table.Td>
			<Table.Td>{moment(row?.updatedAt).format("MMMM Do YYYY")}</Table.Td>
			<Table.Td className='flex items-center gap-3 '>
				<Radio
					checked={selected?.id == row?.id}
					onChange={(e) => {
						setSelected(row);
						console.log(row);
					}}
				/>
			</Table.Td>
		</Table.Tr>
	));
	return (
		<main className='h-screen flex flex-col gap-2 py-2'>
			<Button
				disabled={!selected}
				className='self-end w-max py-2'
				onClick={reactToPrintFn}
			>
				Print selected
			</Button>
			{selected && (
				<section style={{ display: "none" }}>
					<div
						className='border border-black max-w-[40rem] p-2 m-2'
						ref={contentRef}
					>
						<div>
							<PrintHeader />
							<h2 className='text-center font-semibold'>
								STUDENT PAYMENT RECIEPT
							</h2>
						</div>
						<div className='border-y-2 flex flex-wrap gap-2 w-full py-2'>
							<Text fw={600}>
								FULL NAME:
								<i className='text-sm font-normal pl-2'>
									{selected?.student?.last_name} {selected?.student?.first_name}
								</i>
							</Text>
							<Text fw={600}>
								GUARDIAN NAME:
								<i className='text-sm font-normal pl-2'>
									{selected?.student?.guardian_name}
								</i>
							</Text>
							<Text fw={600}>
								ADMISSION NO:
								<i className='text-sm font-normal pl-2'>
									{selected?.student?.admission_no}
								</i>
							</Text>
							<Text fw={600}>
								CLASS:
								<i className='text-sm font-normal pl-2'>{selected?.class}</i>
							</Text>
							<Text fw={600}>
								SESSION:
								<i className='text-sm font-normal pl-2'>{selected?.session}</i>
							</Text>
							<Text fw={600}>
								TERM:
								<i className='text-sm font-normal pl-2'>{selected?.term}</i>
							</Text>
						</div>
						<div className='border-y-2 flex flex-wrap gap-2 w-full py-2'>
							<Text fw={600}>
								DATE OF PAYMENT:
								<i className='text-sm font-normal pl-2'>
									{new Date(selected?.createdAt).toDateString()}
								</i>
							</Text>
							<Text fw={600}>
								RECIEPT NO:
								<i className='text-sm font-normal pl-2'>{selected?.tnxId}</i>
							</Text>
							<Text fw={600}>
								CASHIER:
								<i className='text-sm font-normal pl-2 underline'>
									{selected?.createdBy?.name}
								</i>
							</Text>
						</div>
						<table className='recieptable'>
							<thead>
								<tr>
									<th>Name</th>
									<th>Paid</th>
								</tr>
							</thead>
							<tbody>
								{JSON.parse(selected?.items)?.map((item: any) => {
									return (
										<tr key={item?.payment_id}>
											<td>{item?.item?.name}</td>

											<td>
												<NumberFormatter
													prefix='NGN '
													value={item?.paid}
													thousandSeparator
												/>
											</td>
										</tr>
									);
								})}
							</tbody>
							<tfoot>
								<tr>
									<td className='font-bold text-right'>Total :</td>

									<td className='font-bold'>
										<NumberFormatter
											prefix='NGN '
											value={JSON.parse(selected?.items)?.reduce(
												(prev: any, curr: any) => {
													return Number(prev) + Number(curr?.paid);
												},
												0
											)}
											thousandSeparator
										/>
									</td>
								</tr>
							</tfoot>
						</table>
						<div className='flex justify-between items-center px-2 py-2'>
							<Text fw={600}>
								Total amount paid:
								<b className='text-sm pl-2'>
									<NumberFormatter
										prefix='NGN '
										value={JSON.parse(selected?.items)?.reduce(
											(prev: any, curr: any) => {
												return Number(prev) + Number(curr?.paid);
											},
											0
										)}
										thousandSeparator
									/>
								</b>
							</Text>
							<Text fw={600}>
								Total amount paid in words:
								<i className='text-sm pl-2 capitalize'>
									{convert(
										Number(
											JSON.parse(selected?.items)?.reduce(
												(prev: any, curr: any) => {
													return Number(prev) + Number(curr?.paid);
												},
												0
											)
										)
									)}{" "}
									Naira
								</i>
							</Text>
						</div>
					</div>
				</section>
			)}
			<PaginatedTable
				depth='student'
				showlast={true}
				placeholder=''
				showSearch={false}
				setSortedData={setSortedData}
				sortedData={sortedData}
				data={queryData}
				loading={loading}
				headers={headers}
				rows={rows}
			/>
		</main>
	);
};

export default TransactionHistory;
